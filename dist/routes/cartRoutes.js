"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controller/cart.controller");
const asyncHandler_1 = require("../middleware/asyncHandler");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cartRoutes = (0, express_1.Router)();
cartRoutes.post('/create-cart', authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(cart_controller_1.handleCreateCart));
exports.default = cartRoutes;
