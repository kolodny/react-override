"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
var react_1 = __importDefault(require("react"));
var react_2 = require("@testing-library/react");
var App_1 = __importDefault(require("./App"));
var swapi_1 = require("./swapi");
var react_override_1 = require("react-override");
var vitest_1 = require("vitest");
vitest_1.vitest.setConfig({ testTimeout: 30000 });
var myWaitFor = function (cb) {
    return (0, react_2.waitFor)(cb, { timeout: 30000 });
};
(0, vitest_1.test)('using the regular api with no errors', function () { return __awaiter(void 0, void 0, void 0, function () {
    var getByText;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getByText = (0, react_2.render)(react_1.default.createElement(App_1.default, null)).getByText;
                return [4 /*yield*/, myWaitFor(function () { return (0, vitest_1.expect)(getByText('Films:')).toBeInTheDocument(); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, myWaitFor(function () { return (0, vitest_1.expect)(getByText('People:')).toBeInTheDocument(); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.test)('using the regular api with people errors', function () { return __awaiter(void 0, void 0, void 0, function () {
    var getByText;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getByText = (0, react_2.render)(react_1.default.createElement(swapi_1.SwapiOverride.Override, { with: function (swapi) {
                        return __assign(__assign({}, swapi), { getPeople: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, Promise.reject(new Error())];
                            }); }); } });
                    } },
                    react_1.default.createElement(App_1.default, null))).getByText;
                return [4 /*yield*/, myWaitFor(function () {
                        return (0, vitest_1.expect)(getByText('Error loading people')).toBeInTheDocument();
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, myWaitFor(function () { return (0, vitest_1.expect)(getByText('Films:')).toBeInTheDocument(); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.test)('using the override api with no errors', function () { return __awaiter(void 0, void 0, void 0, function () {
    var getByText;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getByText = (0, react_2.render)(react_1.default.createElement(swapi_1.SwapiOverride.Override, { with: function (swapi) {
                        return __assign(__assign({}, swapi), { getFilms: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, [
                                            {
                                                title: 'Some title',
                                                url: '1',
                                            },
                                        ]];
                                });
                            }); }, getPeople: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, [
                                            {
                                                name: 'Luke Skyguy',
                                                url: '1',
                                            },
                                        ]];
                                });
                            }); } });
                    } },
                    react_1.default.createElement(App_1.default, null))).getByText;
                return [4 /*yield*/, myWaitFor(function () { return (0, vitest_1.expect)(getByText('Films:')).toBeInTheDocument(); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, myWaitFor(function () { return (0, vitest_1.expect)(getByText('Luke Skyguy')).toBeInTheDocument(); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.test)('Nested overrides', function () { return __awaiter(void 0, void 0, void 0, function () {
    var getByText;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getByText = (0, react_2.render)(
                // LEVEL 1
                react_1.default.createElement(swapi_1.SwapiOverride.Override, { with: function (swapi) {
                        return __assign(__assign({}, swapi), { getFilms: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            }); }); }, getPeople: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, [
                                            {
                                                name: 'Luke Skyguy',
                                                url: '1',
                                            },
                                        ]];
                                });
                            }); } });
                    } },
                    react_1.default.createElement(swapi_1.SwapiOverride.Override, { with: function (swapi) {
                            return __assign(__assign({}, swapi), { getPeople: function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, swapi.getPeople()];
                                            case 1: return [2 /*return*/, (_a.sent()).map(function (person) { return (__assign(__assign({}, person), { name: "".concat(person.name.toUpperCase(), "!!") })); })];
                                        }
                                    });
                                }); } });
                        } },
                        react_1.default.createElement(App_1.default, null)))).getByText;
                return [4 /*yield*/, myWaitFor(function () { return (0, vitest_1.expect)(getByText('Films:')).toBeInTheDocument(); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, myWaitFor(function () { return (0, vitest_1.expect)(getByText('LUKE SKYGUY!!')).toBeInTheDocument(); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.test)('createRef', function () { return __awaiter(void 0, void 0, void 0, function () {
    var SwapiRef, getByText, getPerson;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                SwapiRef = swapi_1.SwapiOverride.createRef(function (a) { return a; });
                getByText = (0, react_2.render)(react_1.default.createElement(SwapiRef, null,
                    react_1.default.createElement(App_1.default, null))).getByText;
                getPerson = SwapiRef.current.getPerson;
                SwapiRef.current.getPerson = function (id) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (id === '1') {
                            return [2 /*return*/, {
                                    name: 'Luke Loaded',
                                    planet: 'Tatooine Loaded',
                                }];
                        }
                        return [2 /*return*/, getPerson(id)];
                    });
                }); };
                getByText('Click to load person').click();
                return [4 /*yield*/, myWaitFor(function () {
                        return (0, vitest_1.expect)(getByText('Luke Loaded', { exact: false })).toBeInTheDocument();
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
vitest_1.test.skip('forceUpdate', function () { return __awaiter(void 0, void 0, void 0, function () {
    var overridden, useState, UseState, Component, getByText, oldValue, called;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                overridden = react_1.default.useState;
                useState = (0, react_override_1.createOverride)(function () { return overridden; });
                UseState = useState.createRef();
                Component = function () {
                    var _a = useState.useValue()()(0), count = _a[0], setCount = _a[1];
                    react_1.default.useState(0); // To keep us honest that we didn't break the rules of hooks.
                    return (react_1.default.createElement(react_1.default.Fragment, null,
                        count,
                        react_1.default.createElement("button", { onClick: function () { return setCount(count + 1); } }, "Inc")));
                };
                getByText = (0, react_2.render)(react_1.default.createElement(UseState, null,
                    "My Cool Component",
                    react_1.default.createElement("span", null,
                        react_1.default.createElement(Component, null)))).getByText;
                (0, vitest_1.expect)(getByText('0')).toBeInTheDocument();
                getByText('Inc').click();
                (0, vitest_1.expect)(getByText('1')).toBeInTheDocument();
                oldValue = UseState.current();
                called = false;
                overridden = function () {
                    var value = oldValue()[0];
                    return [value + 100, function () { return (called = true); }];
                };
                return [4 /*yield*/, (0, react_2.act)(function () { return UseState.forceUpdate(); })];
            case 1:
                _a.sent();
                (0, vitest_1.expect)(called).toBe(false);
                (0, vitest_1.expect)(getByText('101')).toBeInTheDocument();
                getByText('Inc').click();
                (0, vitest_1.expect)(called).toBe(true);
                (0, vitest_1.expect)(getByText('101')).toBeInTheDocument();
                return [2 /*return*/];
        }
    });
}); });
vitest_1.test.skip('waitForRender', function () { return __awaiter(void 0, void 0, void 0, function () {
    var info, Info, Host, Component, queryByText;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                info = (0, react_override_1.createOverride)({ foo: 123 });
                Info = info.createRef(function () { return ({ foo: 321 }); });
                Host = function (props) {
                    var _a = react_1.default.useState(false), show = _a[0], setShow = _a[1];
                    react_1.default.useEffect(function () {
                        setTimeout(function () {
                            setShow(true);
                        }, 1000);
                    }, []);
                    return react_1.default.createElement(react_1.default.Fragment, null, show ? props.children : 'Loading...');
                };
                Component = function () {
                    var foo = info.useValue().foo;
                    return react_1.default.createElement(react_1.default.Fragment, null,
                        "Foo is ",
                        foo);
                };
                queryByText = (0, react_2.render)(react_1.default.createElement(Host, null,
                    react_1.default.createElement(Info, null,
                        "My Cool Component",
                        react_1.default.createElement("span", null,
                            react_1.default.createElement(Component, null))))).queryByText;
                (0, vitest_1.expect)(queryByText('Loading...')).toBeInTheDocument();
                (0, vitest_1.expect)(queryByText('0')).not.toBeInTheDocument();
                return [4 /*yield*/, (0, react_2.act)(function () { return Info.waitForRender(); })];
            case 1:
                _a.sent();
                (0, vitest_1.expect)(queryByText('Loading...')).not.toBeInTheDocument();
                (0, vitest_1.expect)(queryByText('Foo is 321')).toBeInTheDocument();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=App.test.js.map