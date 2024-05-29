import stripe from "../configs/stripe";
import logger from "../utils/logger";
import { Response, Request } from "express";
import {paymentService} from "../services/paymentService";

export const payment_checkout = async (req: Request, res: Response) => {
  try {
    const { booking } = req.body;
    if (!booking || !Array.isArray(booking) || booking.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking data." });
    }
    const bookingItem = booking[0];
    const lineItems = {
      price_data: {
        currency: "inr",
        product_data: {
          name: bookingItem.fullName
        },
        unit_amount: parseInt(bookingItem.fare) * 100
      },
      quantity: 1
    };

    const stripeCustomer = await stripe.customers.create({
      name: bookingItem.fullName,
      email: "admin@easygo.com",
      address: {
        line1: "7Span",
        city: "Ahmedabad",
        country: "US"
      }
    });
    (await paymentService.createPayment(booking[0])).save(); //add db

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [lineItems],
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
      customer: stripeCustomer.id
    });
    return res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    logger.error("error in stripe" + err);
    return res
      .status(500)
      .json({ error: "An error occurred during checkout." + err });
  }
};

export const getallPayment = async (req: Request, res: Response) => {
  try {
    const response = await paymentService.allPayment();
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "No Payment Record Found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        data: response,
        message: "all payment record here."
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `error in get all payment` + err });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }
    const response = await paymentService.updateStatus(
      req.params.id,
      {
        $set:{status}
      },
      { new: true }
    );  
    if(!response){
      return res
      .status(404)
      .json({
        success: false,
        message: "Invalid Enter Id"
      })
    }
    return res.status(200).json({
      success: true,
      data: response,
      message: "Payment status updated successfully."
    });
  } catch (error) {
    logger.error("Error in updatePayment controller: " + error);
    return res.status(500).json({ success: false, message: `Error in updatePayment: ${error}` });
  }
};