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
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("../redis"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const uuid_1 = require("uuid");
const asyncHandler_1 = require("../middleware/asyncHandler");
const authRoutes = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET;
function sendResetEmail(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperação de Senha',
            text: `Clique no link para redefinir sua senha: http://localhost:3001/auth/reset-password/${token}`,
        };
        yield transporter.sendMail(mailOptions);
    });
}
authRoutes.post('/register', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userExists = yield redis_1.default.get(`user:${email}`);
    if (userExists)
        return res.status(400).json({ error: 'Usuário já existe' });
    const userId = (0, uuid_1.v4)();
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    yield redis_1.default.set(`user:${email}`, JSON.stringify({ id: userId, email, password: hashedPassword }));
    res.json({ message: 'Usuário cadastrado com sucesso!', id: userId });
})));
authRoutes.post('/login', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userData = yield redis_1.default.get(`user:${email}`);
    if (!userData)
        return res.status(400).json({ error: 'User not found' });
    const { id, password: hashedPassword } = JSON.parse(userData);
    const isMatch = yield bcryptjs_1.default.compare(password, hashedPassword);
    if (!isMatch)
        return res.status(400).json({ error: 'Invalid password' });
    const token = jsonwebtoken_1.default.sign({ email, id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Sucesso', token, email, id });
})));
authRoutes.post('/forgot-password', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield redis_1.default.get(`user:${email}`);
    if (!user)
        return res.status(400).json({ error: 'Usuário não encontrado' });
    const token = jsonwebtoken_1.default.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
    yield redis_1.default.set(`reset:${token}`, email, 'EX', 900); // expira em 15 min
    yield sendResetEmail(email, token);
    res.json({ message: 'Email de recuperação enviado!' });
})));
authRoutes.post('/reset-password/:token', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    const email = yield redis_1.default.get(`reset:${token}`);
    if (!email)
        return res.status(400).json({ error: 'Token inválido ou expirado' });
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    yield redis_1.default.set(`user:${email}`, JSON.stringify({ email, password: hashedPassword }));
    res.json({ message: 'Senha redefinida com sucesso!' });
})));
exports.default = authRoutes;
