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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = exports.createCart = void 0;
const uuid_1 = require("uuid");
const cart_model_1 = require("../model/cart.model");
const now = new Date();
const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
const createCart = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, items = []) {
    const cartId = (0, uuid_1.v4)();
    const cart = {
        id: cartId,
        userId,
        items,
        createdAt: now,
        expiresAt,
    };
    yield (0, cart_model_1.saveCart)(cart);
    return cart;
});
exports.createCart = createCart;
const getCart = (cartId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, cart_model_1.getCartById)(cartId);
});
exports.getCart = getCart;
