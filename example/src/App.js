"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
var react_1 = __importDefault(require("react"));
var PeopleList_1 = require("./PeopleList");
var Films_1 = require("./Films");
var LoadablePerson_1 = require("./LoadablePerson");
var react_override_1 = require("react-override");
window.overridden = react_1.default.useState;
var useState = (0, react_override_1.createOverride)(function () { return window.overridden; });
var UseState = useState.createRef();
window.UseState = UseState;
function App() {
    var _a = useState.useValue()()(0), count = _a[0], setCount = _a[1];
    var _b = react_1.default.useState(0), count2 = _b[0], setCount2 = _b[1];
    return (react_1.default.createElement(react_1.default.Fragment, null,
        count,
        react_1.default.createElement("button", { onClick: function () { return setCount(count + 1); } }, "Inc"),
        count2,
        react_1.default.createElement("button", { onClick: function () { return setCount2(count2 + 1); } }, "Inc"),
        react_1.default.createElement("div", null,
            react_1.default.createElement(LoadablePerson_1.LoadablePerson, null)),
        react_1.default.createElement("div", null,
            react_1.default.createElement(Films_1.Films, null)),
        react_1.default.createElement("div", null,
            react_1.default.createElement(PeopleList_1.PeopleList, null))));
}
function App2() {
    return (react_1.default.createElement(UseState, null,
        react_1.default.createElement(App, null)));
}
exports.default = App2;
//# sourceMappingURL=App.js.map