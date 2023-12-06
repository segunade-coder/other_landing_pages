"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("./login/route"));
const route_2 = __importDefault(require("./signup/route"));
const route_3 = __importDefault(require("./rep/route"));
const router = (0, express_1.Router)();
router.use("/login", route_1.default);
router.use("/rep", route_3.default);
router.use("/sign-up", route_2.default);
exports.default = router;
