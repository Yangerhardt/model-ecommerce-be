import redis from '../config/redis';

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

export const getAllUsersFromRedis = async () => {
  const keys = await redis.keys('user:*');
  const users = await Promise.all(
    keys.map(async (key) => {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    }),
  );
  return users.filter(Boolean);
};

export const deleteUserFromRedis = async (email: string) => {
  await redis.del(`user:${email}`);
};
