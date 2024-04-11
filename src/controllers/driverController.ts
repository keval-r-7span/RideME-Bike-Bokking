import { driverService } from "../services/driverService";
import { vehicleService } from "../services/vehicleService";
import { Request, Response, NextFunction } from "express";
import { AWS_S3 } from "../helper/constants";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import logger from "../utils/logger";

export const getDriver = async (req: Request, res: Response) => {
  try {
    const response = await driverService.viewDriver();
    if (!response) {
      return res
        .status(404)
        .json({ success: true, message: "No Any Driver Register." });
    }
    return res.status(200).json({
      sucess: true,
      data: response,
      message: "All Available Driver",
    });
  } catch (error) {
    return res.json({
      sucess: false,
      message: "Error in GetDriver" + error,
    });
  }
};

export const getDriverByID = async (req: Request, res: Response) => {
  try {
    const response = await driverService.viewDriverById(req.params.id);
    return res.status(200).json({
      sucess: true,
      data: response,
    });
  } catch (error) {
    return res.json({
      sucess: false,
      message: "Error in GetDriver ID" + error,
    });
  }
};

export const addVehicle = async (req: Request, res: Response) => {
  try {
    const { model, year, licensePlate, vehicleClass, driverId } = req.body;
    const vehicleExist = await vehicleService.findVehicle({ licensePlate });
    if (vehicleExist) {
      return res.status(500).json({
        success: false,
        message: "Already Register Vehicle ",
      });
    }
    const response = await vehicleService.addVehicle({
      model,
      year,
      licensePlate,
      vehicleClass,
      driverId,
      fare: 0,
      save: function (): unknown {
        throw new Error("Function not implemented.");
      },
    });
    await response.save();
    return res.status(201).json({
      success: true,
      data: response,
      message: "vehicle added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while addind vehicle " + error,
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { model, year, licensePlate, vehicleClass } = req.body;
    const response = await vehicleService.updateVehicleDetails(id, {
      model,
      year,
      licensePlate,
      vehicleClass,
    });
    return res.status(200).json({
      success: true,
      data: response,
      message: "vehicle details updated Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    const response = await driverService.updateDriver(req.params.id, {
      name,
      email,
      role,
    });
    return res.status(200).json({
      success: true,
      data: response,
      message: "Driver updated Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
};

export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const response = await driverService.deleteDriver(req.params.id);
    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Invalid driverID",
      });
    }
    return res.status(200).json({
      success: true,
      data: response,
      message: "Driver deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const availableDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await driverService.availableDrivers();
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Not Available Any Driver" });
    }
    return res.status(200).json({
      success: true,
      data: response,
      message: "all available driver",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const imageUpload = async (req: Request, res: Response) => {
  try {
  const fileName = Date.now().toString();
  const config: S3ClientConfig = {
    credentials: {
      accessKeyId: AWS_S3.API_KEY ?? "",
      secretAccessKey: AWS_S3.SECRET ?? "",
    },
    region: AWS_S3.REGION,
  };
  const client = new S3Client(config);
  const fileUrl = `https://${AWS_S3.NAME}.s3.${AWS_S3.REGION}.amazonaws.com/${fileName}`;
  const command = new PutObjectCommand({
    Bucket: AWS_S3.NAME,
    Key: fileName,
  });
  const preSignedUrl = await getSignedUrl(client, command);
  return res.status(200).json({
    success: true,
    data: {
      preSignedUrl,
      fileUrl,
    },
    message: "preSignedUrl Generated...",
  });
  } catch (error) {
    return res.status(500).json({success:false,message:"preSigned URL failed:"+error})
  }
};
