"use strict";
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
        while (_) try {
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
exports.__esModule = true;
exports.existFile = exports.importFileDefault = exports.importFile = exports.getProjectRoot = exports.proxyController = exports.convertFileToRoute = exports.listFiles = exports.isApiFile = exports.isTsOrJsFile = exports.isFn = void 0;
var upath_1 = require("upath");
var fs_1 = require("fs");
var pluralize_1 = require("pluralize");
var pkg_dir_1 = require("pkg-dir");
var jiti_1 = require("jiti");
var config_1 = require("./config");
var jiti = (0, jiti_1["default"])(process.cwd(), { cache: false });
var isFn = function (item) {
    return typeof item === "function";
};
exports.isFn = isFn;
var isTsOrJsFile = function (file) {
    return [".ts", ".js"].includes((0, upath_1.extname)(file));
};
exports.isTsOrJsFile = isTsOrJsFile;
/**
 * 判断是不是属于 controller下的js文件
 * 存在这种情况 D:/Github/Gganbu/src/api/manage/order.ts?t=1637686059242
 */
var isApiFile = function (file) {
    var resolvedControllerDir = (0, config_1.getResolvedControllerDir)();
    if (file.indexOf(resolvedControllerDir) == -1)
        return false;
    if (!(0, exports.isTsOrJsFile)(file))
        return false;
    return true;
};
exports.isApiFile = isApiFile;
/**
 * 列出某个目录下的文件，返回格式
 * {filePath,fileName}
 */
var listFiles = function (currentDirPath) {
    return fs_1["default"].readdirSync(currentDirPath).reduce(function (acc, file) {
        var filePath = upath_1["default"].resolve(currentDirPath, file);
        var stat = fs_1["default"].statSync(filePath);
        if (stat.isDirectory()) {
            var childFiles = (0, exports.listFiles)(filePath);
            return acc.concat(childFiles);
        }
        else if (stat.isFile()) {
            if (!(0, exports.isTsOrJsFile)(file))
                return acc;
            acc.push({ filePath: filePath, fileName: file });
        }
        return acc;
    }, []);
};
exports.listFiles = listFiles;
/**
 * file: D:/Github/Gganbu/src/controller/manage/order.js
 * ---->  manage/orders
 */
var convertFileToRoute = function (file) {
    var resolvedControllerDir = (0, config_1.getResolvedControllerDir)();
    var splitArr = file.split(resolvedControllerDir);
    var fileSplit = splitArr[1].split("/");
    var lastItem = fileSplit[fileSplit.length - 1];
    if ((0, exports.isTsOrJsFile)(file)) {
        lastItem = lastItem.substring(0, lastItem.indexOf(".")); // 去除js后缀
    }
    fileSplit.splice(fileSplit.length - 1, 1, (0, pluralize_1["default"])(lastItem)); // 替换原来的最后一项
    return fileSplit.join("/");
};
exports.convertFileToRoute = convertFileToRoute;
/**
 * 在一体化中，用return 值 来表示 ctx.body
 *
 */
var proxyController = function (actionFn) {
    return function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, args, query;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        res = {};
                        if (!(ctx.method == "POST")) return [3 /*break*/, 2];
                        _a = ctx.request.body.args, args = _a === void 0 ? [] : _a;
                        return [4 /*yield*/, actionFn.apply(void 0, args)];
                    case 1:
                        res = _b.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(ctx.method == "GET")) return [3 /*break*/, 4];
                        query = ctx.request.query || {};
                        return [4 /*yield*/, actionFn(query)];
                    case 3:
                        res = _b.sent();
                        _b.label = 4;
                    case 4:
                        ctx["body"] = res;
                        return [2 /*return*/];
                }
            });
        });
    };
};
exports.proxyController = proxyController;
/**
 * 根据 package.json 找到项目根目录
 */
var getProjectRoot = function (cwd) {
    return (0, pkg_dir_1.sync)(cwd) || process.cwd();
};
exports.getProjectRoot = getProjectRoot;
/**
 * 动态require文件 包含所有的了 文件只能读取一次 所以需要加一个缓存了
 */
var importFile = function (filePath) {
    var contents = jiti(filePath);
    return contents;
};
exports.importFile = importFile;
/**
 * import file 相当于 importFile 的default
 */
var importFileDefault = function (filePath) {
    var contents = (0, exports.importFile)(filePath);
    return contents["default"] || {};
};
exports.importFileDefault = importFileDefault;
/**
 * 判断文件是否存在
 */
var existFile = function (filePath) {
    return (0, fs_1.existsSync)(filePath);
};
exports.existFile = existFile;
