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
exports.handleResetPassword = exports.handleForgotPassword = exports.handleLogin = exports.handleRegister = void 0;
const auth_service_1 = require("../service/auth.service");
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield (0, auth_service_1.registerUser)(email, password);
    res.json({ message: 'User registered!', id: result.id });
});
exports.handleRegister = handleRegister;
const handleLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield (0, auth_service_1.loginUser)(email, password);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.handleLogin = handleLogin;
const handleForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield (0, auth_service_1.requestPasswordReset)(email);
    res.json({ message: 'Recovery email sent!' });
});
exports.handleForgotPassword = handleForgotPassword;
const handleResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    yield (0, auth_service_1.resetPassword)(token, password);
    res.json({ message: 'Password reset!' });
});
exports.handleResetPassword = handleResetPassword;
