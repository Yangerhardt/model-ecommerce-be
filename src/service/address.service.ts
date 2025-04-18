import {
  getUserAddress,
  removeUserAddress,
  saveUserAddress,
} from '../model/address.model';
import { v4 as uuidv4 } from 'uuid';
import { UserAddress } from '../types/address';
import { NotFoundError, ValidationError } from '../utils/errors';

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

export const deleteUserAddress = async (userId: string) => {
  const address = await getUserAddress(userId);

  if (!address) {
    throw new NotFoundError('No address found', 404);
  }

  await removeUserAddress(userId);
  return { message: `Address from ${userId} removed \n${address}` };
};
