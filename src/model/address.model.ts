import redis from '../config/redis';
import { UserAddress } from '../types/address';

export const saveUserAddress = async (userId: string, address: UserAddress) => {
  await redis.set(`address:${userId}`, JSON.stringify({ ...address, userId }));
};

export const getUserAddress = async (
  userId: string,
): Promise<UserAddress | null> => {
  const data = await redis.get(`address:${userId}`);
  return data ? JSON.parse(data) : null;
};

export const removeUserAddress = async (userId: string) => {
  await redis.del(`address:${userId}`);
};
