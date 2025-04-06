import redis from '../redis';

export const getUserByEmail = async (email: string) => {
  const userData = await redis.get(`user:${email}`);
  return userData ? JSON.parse(userData) : null;
};

export const saveUser = async (email: string, data: any) => {
  await redis.set(`user:${email}`, JSON.stringify(data));
};

export const saveResetToken = async (token: string, email: string) => {
  await redis.set(`reset:${token}`, email, 'EX', 900); // 15 min
};

export const getEmailByResetToken = async (token: string) => {
  return await redis.get(`reset:${token}`);
};
