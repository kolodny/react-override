"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Films = void 0;
var react_1 = __importDefault(require("react"));
var react_use_1 = require("react-use");
var swapi_1 = require("./swapi");
var Films = function () {
    var _a;
    var swapi = swapi_1.SwapiOverride.useValue();
    var films = (0, react_use_1.useAsync)(function () { return swapi.getFilms(); });
    return (react_1.default.createElement(react_1.default.Fragment, null, films.loading ? (react_1.default.createElement(react_1.default.Fragment, null, "Loading films...")) : films.error ? (react_1.default.createElement(react_1.default.Fragment, null, "Error loading films")) : (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("span", null, "Films:"),
        react_1.default.createElement("ul", null, (_a = films.value) === null || _a === void 0 ? void 0 : _a.map(function (r) { return (react_1.default.createElement("li", { key: r.url },
            react_1.default.createElement("div", null, r.title))); }))))));
};
exports.Films = Films;
//# sourceMappingURL=Films.js.map