"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const connection_js_1 = require("./DB/connection.js");
const port = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, connection_js_1.connection)();
app.use('/users', user_routes_1.default);
app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});
