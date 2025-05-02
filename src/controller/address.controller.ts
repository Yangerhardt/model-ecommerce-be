import { NextFunction, Response, Request } from 'express';
import { UserAddressSchema } from '../schema/address.schema';
import {
  upsertUserAddress,
  findUserAddress,
  deleteUserAddress,
} from '../service/address.service';
import { AuthRequest } from '@ecommercebe/src/types/authRequest';
import { validateBrazilianAddress } from '../utils/validateBrazilianAddress';

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

  const address = parsed.data;

  const validation = await validateBrazilianAddress(address);
  if (!validation.success) {
    return res.status(validation.status ?? 400).json({
      error: validation.error,
      ...(typeof validation.details === 'object' && validation.details !== null
        ? { details: validation.details }
        : {}),
    });
  }

  const savedAddress = await upsertUserAddress(userId, address);
  res.status(200).json(savedAddress);
};

export const handleDeleteUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const result = await deleteUserAddress(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
