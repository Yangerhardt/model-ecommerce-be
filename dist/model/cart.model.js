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
exports.getCartById = exports.saveCart = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const saveCart = (cart) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.default.set(`cart:${cart.id}`, JSON.stringify(cart), 'EX', 60 * 15);
});
exports.saveCart = saveCart;
const getCartById = (cartId) => __awaiter(void 0, void 0, void 0, function* () {
    const cartData = yield redis_1.default.get(`cart:${cartId}`);
    if (!cartData)
        return null;
    return JSON.parse(cartData);
});
exports.getCartById = getCartById;
