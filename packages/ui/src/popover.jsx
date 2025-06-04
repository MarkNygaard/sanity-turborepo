"use client";
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopoverAnchor = exports.PopoverContent = exports.PopoverTrigger = exports.Popover = void 0;
var React = require("react");
var PopoverPrimitive = require("@radix-ui/react-popover");
var ui_1 = require("@repo/ui");
var Popover = PopoverPrimitive.Root;
exports.Popover = Popover;
var PopoverTrigger = PopoverPrimitive.Trigger;
exports.PopoverTrigger = PopoverTrigger;
var PopoverAnchor = PopoverPrimitive.Anchor;
exports.PopoverAnchor = PopoverAnchor;
var PopoverContent = React.forwardRef(function (_a, ref) {
    var className = _a.className, _b = _a.align, align = _b === void 0 ? "center" : _b, _c = _a.sideOffset, sideOffset = _c === void 0 ? 4 : _c, props = __rest(_a, ["className", "align", "sideOffset"]);
    return (<PopoverPrimitive.Portal>
    <PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} className={(0, ui_1.cn)("z-50 w-72 origin-[--radix-popover-content-transform-origin] border bg-popover p-4 text-popover-foreground shadow-md outline-none", className)} {...props}/>
  </PopoverPrimitive.Portal>);
});
exports.PopoverContent = PopoverContent;
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
