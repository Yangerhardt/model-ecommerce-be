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
exports.handleCreateCart = void 0;
const cart_service_1 = require("../service/cart.service");
const cart_schema_1 = require("../schema/cart.schema");
const handleCreateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const parsed = cart_schema_1.CreateCartSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = parsed.error.flatten();
        return res
            .status(400)
            .json({ error: 'Invalid data', details: errors.fieldErrors });
    }
    const { items } = req.body;
    const cart = yield (0, cart_service_1.createCart)(userId, items);
    res.status(201).json(cart);
});
exports.handleCreateCart = handleCreateCart;
