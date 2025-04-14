import { getUserAddress, saveUserAddress } from '../model/address.model';
import { v4 as uuidv4 } from 'uuid';
import { UserAddress } from '../types/address';

export const findUserAddress = async (
  userId: string,
): Promise<UserAddress | null> => {
  return await getUserAddress(userId);
};

export const upsertUserAddress = async (
  userId: string,
  address: Omit<UserAddress, 'id'>,
): Promise<UserAddress> => {
  const existing = await getUserAddress(userId);

  const finalAddress: UserAddress = {
    id: existing?.id ?? uuidv4(),
    ...address,
  };

  await saveUserAddress(userId, finalAddress);
  return finalAddress;
};
