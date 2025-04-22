import redis from '../config/redis';

export const getNewsletterUserByEmail = async (email: string) => {
  const userData = await redis.get(`newsletter:${email}`);
  return userData ? JSON.parse(userData) : null;
};

export const saveNewsletterEmail = async (email: string, data: any) => {
  await redis.set(`newsletter:${email}`, JSON.stringify(data));
};
