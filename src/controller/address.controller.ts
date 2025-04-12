import { Response } from 'express';
import { UserAddressSchema } from '../schema/address.schema';
import { upsertUserAddress, findUserAddress } from '../service/address.service';
import { AuthRequest } from '@ecommercebe/types/authRequest';

export const handleGetUserAddress = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const address = await findUserAddress(userId);

  if (!address) {
    return res.status(404).json({ error: 'Address not found' });
  }

  res.status(200).json(address);
};

export const handleUpsertUserAddress = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const parsed = UserAddressSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: 'Invalid data', details: parsed.error.flatten() });
  }

  const address = await upsertUserAddress(userId, parsed.data);
  res.status(200).json(address);
};
