import { UserAddress } from '../types/address';

const addressStore = new Map<string, UserAddress>();

export const saveUserAddress = async (userId: string, address: UserAddress) => {
  addressStore.set(userId, { ...address, userId });
};

export const getUserAddress = async (
  userId: string,
): Promise<UserAddress | null> => {
  return addressStore.get(userId) || null;
};