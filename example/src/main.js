"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var client_1 = __importDefault(require("react-dom/client"));
var App_tsx_1 = __importDefault(require("./App.tsx"));
client_1.default.createRoot(document.getElementById('root')).render(react_1.default.createElement(react_1.default.StrictMode, null,
    react_1.default.createElement(App_tsx_1.default, null)));
//# sourceMappingURL=main.js.map