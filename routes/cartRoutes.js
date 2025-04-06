const express = require('express');
const { v4: uuidv4 } = require('uuid');
const redis = require('../redis');

const router = express.Router();

router.post('/create-cart', async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart cannot be empty' });
  }

  for (const [index, item] of items.entries()) {
    if (typeof item !== 'object' || item === null) {
      return res
        .status(400)
        .json({ error: `Item on position ${index} is invalid.` });
    }

    const { sku, name, price, quantity } = item;

    if (typeof sku !== 'string' || sku.trim() === '') {
      return res
        .status(400)
        .json({
          error: `Item ${index + 1}: sku is required and must be a string.`,
        });
    }

    if (typeof name !== 'string' || name.trim() === '') {
      return res
        .status(400)
        .json({
          error: `Item ${index + 1}: name is required and must be a string.`,
        });
    }

    if (typeof price !== 'number' || price < 0) {
      return res
        .status(400)
        .json({
          error: `Item ${
            index + 1
          }: 'price' is required and must be an integer.`,
        });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res
        .status(400)
        .json({
          error: `Item ${
            index + 1
          }: quantity is required and must be and integer.`,
        });
    }
  }

  const cartId = uuidv4();

  let totalQuantity = 0;
  let totalPrice = 0;

  const processedItems = items.map((item) => {
    const { sku, name, price, quantity } = item;

    totalQuantity += quantity;
    totalPrice += quantity * price;

    return {
      sku,
      name,
      price,
      quantity,
    };
  });

  const cart = {
    id: cartId,
    items: processedItems,
    totalQuantity,
    totalPrice,
    createdAt: new Date().toISOString(),
  };

  await redis.set(`cart:${cartId}`, JSON.stringify(cart));

  res.status(201).json({ message: 'Cart created with success', cart });
});

module.exports = router;
