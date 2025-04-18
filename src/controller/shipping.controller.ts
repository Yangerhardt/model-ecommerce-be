import { Request, Response, NextFunction } from 'express';
import {
  getValidatedCepInfo,
  getShippingOptions,
} from '../service/shipping.service';

export const handleValidateCep = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cep } = req.params;
    const data = await getValidatedCepInfo(cep);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const handleCalculateShipping = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cep } = req.body;
    const options = await getShippingOptions(cep);
    res.status(200).json(options);
  } catch (err) {
    next(err);
  }
};
