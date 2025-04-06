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
exports.getEmailByResetToken = exports.saveResetToken = exports.saveUser = exports.getUserByEmail = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield redis_1.default.get(`user:${email}`);
    return userData ? JSON.parse(userData) : null;
});
exports.getUserByEmail = getUserByEmail;
const saveUser = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.default.set(`user:${email}`, JSON.stringify(data));
});
exports.saveUser = saveUser;
const saveResetToken = (token, email) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.default.set(`reset:${token}`, email, 'EX', 900); // 15 min
});
exports.saveResetToken = saveResetToken;
const getEmailByResetToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redis_1.default.get(`reset:${token}`);
});
exports.getEmailByResetToken = getEmailByResetToken;
