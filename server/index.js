"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// require important modules
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)(); // server module
const session = require("express-session");
const server = require("http").createServer(app);
const cors = require("cors");
const compression = require("compression");
const routes_1 = __importDefault(require("./routes"));
const sessionConfig_1 = require("./config/sessionConfig");
const path_1 = __importDefault(require("path"));
const page_1 = __importDefault(require("./pagesRoute/page"));
const PORT = process.env.PORT || 3000;
app.set("trust proxy", 1);
app.use(cors(sessionConfig_1.corsConfig));
app.use(session(sessionConfig_1.sessionConfig));
app.use(express_1.default.json());
app.use(compression());
app.use(express_1.default.static(path_1.default.resolve(__dirname, "./public")));
app.use(page_1.default);
app.use(routes_1.default);
app.get("*", (req, res) => res.end("404"));
server.listen(PORT, (err) => {
    if (err) {
        throw err;
    }
    console.clear();
    console.log(`Live on ${PORT}`);
});
