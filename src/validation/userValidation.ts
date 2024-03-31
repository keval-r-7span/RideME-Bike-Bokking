import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const userJoiSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).max(10).required(),
  role: Joi.string(),
});

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userJoiSchema.validate(req.body);
  if (error) {
    return res.status(200).json({
      success: false, 
      message: error.details[0].message
    });
  }
  next();
};

export default validateRequest;