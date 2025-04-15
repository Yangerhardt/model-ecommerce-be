import { Coupon } from '@ecommercebe/src/types/coupon';
import redis from '../config/redis';

export const saveCoupon = async (coupon: Coupon) => {
  await redis.set(
    `coupon:${coupon.code.toLowerCase()}`,
    JSON.stringify(coupon),
  );
};

export const getCouponByCode = async (code: string): Promise<Coupon | null> => {
  const data = await redis.get(`coupon:${code.toLowerCase()}`);
  return data ? JSON.parse(data) : null;
};

export const deleteCoupon = async (code: string) => {
  await redis.del(`coupon:${code.toLowerCase()}`);
};
