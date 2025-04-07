"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCartSchema = exports.CartItemSchema = void 0;
const zod_1 = require("zod");
exports.CartItemSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'id deve ser ao menos 1'),
    sku: zod_1.z.string().min(1, 'sku deve ser ao menos 1'),
    quantity: zod_1.z.number().int().min(1, 'Quantidade deve ser ao menos 1'),
    price: zod_1.z.number().nonnegative('Preço deve ser um número positivo'),
});
exports.CreateCartSchema = zod_1.z.object({
    items: zod_1.z.array(exports.CartItemSchema).min(1, 'Carrinho não pode estar vazio'),
});
