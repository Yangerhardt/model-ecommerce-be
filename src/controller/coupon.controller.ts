import { Request, Response, NextFunction } from 'express';
import {
  findCoupon,
  createOrUpdateCoupon,
  removeCoupon,
} from '../service/coupon.service';
import { CouponSchema } from '../schema/coupon.schema';
import { ValidationError } from '../utils/errors';

export const handleGetCoupon = async (req: Request, res: Response) => {
  const { code } = req.params;
  const coupon = await findCoupon(code);
  res.status(200).json(coupon);
};

export const handleCreateOrUpdateCoupon = async (
  req: Request,
  res: Response,
) => {
  const parsed = CouponSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: new ValidationError(
        'Invalid data',
        JSON.stringify(parsed.error.flatten()),
      ),
    });
  }

  const coupon = await createOrUpdateCoupon(parsed.data);
  res.status(200).json(coupon);
};

export const handleDeleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code } = req.params;
    const result = await removeCoupon(code);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
