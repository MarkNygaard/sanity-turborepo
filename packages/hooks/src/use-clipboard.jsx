"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClipboard = useClipboard;
var react_1 = require("react");
function useClipboard(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.timeout, timeout = _c === void 0 ? 2000 : _c;
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(false), copied = _e[0], setCopied = _e[1];
    var _f = (0, react_1.useState)(null), copyTimeout = _f[0], setCopyTimeout = _f[1];
    var onClearTimeout = function () {
        if (copyTimeout) {
            clearTimeout(copyTimeout);
        }
    };
    var handleCopyResult = function (value) {
        onClearTimeout();
        setCopyTimeout(setTimeout(function () { return setCopied(false); }, timeout));
        setCopied(value);
    };
    var copy = function (valueToCopy) {
        if ("clipboard" in navigator) {
            navigator.clipboard
                .writeText(valueToCopy)
                .then(function () { return handleCopyResult(true); })
                .catch(function (err) { return setError(err); });
        }
        else {
            setError(new Error("useClipboard: navigator.clipboard is not supported"));
        }
    };
    var reset = function () {
        setCopied(false);
        setError(null);
        onClearTimeout();
    };
    return { copy: copy, reset: reset, error: error, copied: copied };
}
