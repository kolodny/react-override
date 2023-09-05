"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleList = void 0;
var react_1 = __importDefault(require("react"));
var react_use_1 = require("react-use");
var Person_1 = require("./Person");
var swapi_1 = require("./swapi");
var PeopleList = function () {
    var _a;
    var swapi = swapi_1.SwapiOverride.useValue();
    var people = (0, react_use_1.useAsync)(function () { return swapi.getPeople(); });
    return (react_1.default.createElement(react_1.default.Fragment, null, people.loading ? (react_1.default.createElement(react_1.default.Fragment, null, "Loading people...")) : people.error ? (react_1.default.createElement(react_1.default.Fragment, null, "Error loading people")) : (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("span", null, "People:"),
        react_1.default.createElement("ul", null, (_a = people.value) === null || _a === void 0 ? void 0 : _a.map(function (r) { return (react_1.default.createElement("li", { key: r.url },
            react_1.default.createElement("div", null, r.name),
            react_1.default.createElement("div", null,
                "More info: ",
                react_1.default.createElement(Person_1.Person, { id: r.id })))); }))))));
};
exports.PeopleList = PeopleList;
//# sourceMappingURL=PeopleList.js.map