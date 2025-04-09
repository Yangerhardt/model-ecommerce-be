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
exports.resetPassword = exports.requestPasswordReset = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const auth_model_1 = require("../model/auth.model");
const mailer_1 = require("../utils/mailer");
const appError_1 = require("../error/appError");
const JWT_SECRET = process.env.JWT_SECRET;
const registerUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield (0, auth_model_1.getUserByEmail)(email);
    if (existing)
        throw new appError_1.AppError('User already registered', 400);
    const userId = (0, uuid_1.v4)();
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    yield (0, auth_model_1.saveUser)(email, { id: userId, email, password: hashedPassword });
    return { id: userId };
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_model_1.getUserByEmail)(email);
    if (!user)
        throw new appError_1.AppError('User not found', 404);
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new appError_1.AppError('Invalid password', 400);
    const token = jsonwebtoken_1.default.sign({ email, id: user.id }, JWT_SECRET, {
        expiresIn: '24h',
    });
    return { token, id: user.id };
});
exports.loginUser = loginUser;
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_model_1.getUserByEmail)(email);
    if (!user)
        throw new appError_1.AppError('User not found', 404);
    const token = jsonwebtoken_1.default.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
    yield (0, auth_model_1.saveResetToken)(token, email);
    yield (0, mailer_1.sendResetEmail)(email, token);
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const email = yield (0, auth_model_1.getEmailByResetToken)(token);
    if (!email)
        throw new appError_1.AppError('Invalid token', 401);
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    yield (0, auth_model_1.saveUser)(email, { email, password: hashedPassword });
    return;
});
exports.resetPassword = resetPassword;
