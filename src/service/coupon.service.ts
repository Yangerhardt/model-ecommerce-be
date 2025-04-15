import { Coupon } from '../types/coupon';
import {
  getCouponByCode,
  saveCoupon,
  deleteCoupon,
} from '../model/coupon.model';
import { NotFoundError } from '../utils/errors';

export const findCoupon = async (code: string): Promise<Coupon> => {
  const coupon = await getCouponByCode(code);
  if (!coupon || !coupon.isActive) {
    throw new NotFoundError('Coupon not found or inactive', 404);
  }
  return coupon;
};

export const createOrUpdateCoupon = async (data: Coupon): Promise<Coupon> => {
  await saveCoupon(data);
  return data;
};

export const removeCoupon = async (code: string) => {
  const coupon = await getCouponByCode(code);
  if (!coupon) {
    throw new NotFoundError('Coupon not found', 404);
  }
  await deleteCoupon(code);
  return { message: `Coupon "${code}" removed.` };
};
