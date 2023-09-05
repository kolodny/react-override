"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
var react_1 = __importDefault(require("react"));
var react_use_1 = require("react-use");
var swapi_1 = require("./swapi");
var Person = function (props) {
    var _a, _b;
    var swapi = swapi_1.SwapiOverride.useValue();
    var person = (0, react_use_1.useAsync)(function () { return swapi.getPerson(props.id); });
    return (react_1.default.createElement(react_1.default.Fragment, null, person.loading ? (react_1.default.createElement(react_1.default.Fragment, null, "Loading person...")) : person.error ? (react_1.default.createElement(react_1.default.Fragment, null, "Error loading person")) : (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("span", null, "Person:"),
        react_1.default.createElement("span", null, (_a = person.value) === null || _a === void 0 ? void 0 :
            _a.name,
            " from ", (_b = person.value) === null || _b === void 0 ? void 0 :
            _b.planet)))));
};
exports.Person = Person;
//# sourceMappingURL=Person.js.map