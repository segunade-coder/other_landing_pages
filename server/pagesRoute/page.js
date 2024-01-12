"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => res.redirect("/login"));
router.get("/login", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/login.html"), (err) => {
    console.log(err);
}));
router.get("/signup", (req, res) => {
    var _a;
    const email = (_a = req.query) === null || _a === void 0 ? void 0 : _a.email;
    if (email !== undefined && email !== "") {
        res.sendFile(path_1.default.resolve(__dirname, "../pages/signup.html"), (err) => {
            err && console.log(err);
        });
    }
    else {
        res.redirect("/verify-email");
    }
});
router.get("/verify-email", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/verify-email.html"), (err) => {
    err && console.log(err);
}));
router.get("/otp", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/OTP.html"), (err) => {
    err && console.log(err);
}));
router.get("/admin-signup", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/admin_signup.html"), (err) => {
    err && console.log(err);
}));
router.get("/forgot-password", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/forgotPassword.html"), (err) => {
    err && console.log(err);
}));
router.get("/schedule", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/schedule.html"), (err) => {
    err && console.log(err);
}));
router.get("/driller", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/driller.html"), (err) => {
    err && console.log(err);
}));
router.get("/paymof", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/paymoff.html"), (err) => {
    err && console.log(err);
}));
router.get("/web", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/web.html"), (err) => {
    err && console.log(err);
}));
router.get("/compiler", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/compiler.html"), (err) => {
    err && console.log(err);
}));
router.get("/pricing", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/pricing.html"), (err) => {
    err && console.log(err);
}));
router.get("/ask", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/ask.html"), (err) => {
    err && console.log(err);
}));
router.get("/representative", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/repForm.html"), (err) => {
    err && console.log(err);
}));
router.get("/reset", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../pages/resetPassword.html"), (err) => {
    err && console.log(err);
}));
exports.default = router;
