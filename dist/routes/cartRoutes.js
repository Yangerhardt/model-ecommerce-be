"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const redis_1 = __importDefault(require("../redis"));
const asyncHandler_1 = require("../middleware/asyncHandler");
const cartRoutes = (0, express_1.Router)();
cartRoutes.post('/create-cart', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return res.status(400).json({
                error: `Item ${index + 1}: sku is required and must be a string.`,
            });
        }
        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({
                error: `Item ${index + 1}: name is required and must be a string.`,
            });
        }
        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({
                error: `Item ${index + 1}: 'price' is required and must be a number.`,
            });
        }
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                error: `Item ${index + 1}: quantity is required and must be an integer.`,
            });
        }
    }
    const cartId = (0, uuid_1.v4)();
    let totalQuantity = 0;
    let totalPrice = 0;
    const processedItems = items.map((item) => {
        const { sku, name, price, quantity } = item;
        totalQuantity += quantity;
        totalPrice += quantity * price;
        return { sku, name, price, quantity };
    });
    const cart = {
        id: cartId,
        items: processedItems,
        totalQuantity,
        totalPrice,
        createdAt: new Date().toISOString(),
    };
    yield redis_1.default.set(`cart:${cartId}`, JSON.stringify(cart));
    res.status(201).json({ message: 'Cart created with success', cart });
})));
exports.default = cartRoutes;
