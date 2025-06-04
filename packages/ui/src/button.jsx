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
exports.buttonVariants = exports.Button = void 0;
var React = require("react");
var react_slot_1 = require("@radix-ui/react-slot");
var class_variance_authority_1 = require("class-variance-authority");
var ui_1 = require("@repo/ui");
var buttonVariants = (0, class_variance_authority_1.cva)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80",
            ghost: "px-4 py-2 hover:bg-accent hover:text-accent-foreground",
            fullGhost: "text-gray-500 hover:text-accent-foreground",
            link: "px-3 py-2 text-base font-semibold text-primary decoration-2 underline-offset-8 hover:underline",
            CTA: "rounded-full bg-secondary px-5 py-1.5 text-primary hover:bg-gray-300",
        },
        size: {
            icon: "h-9 w-9",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
exports.buttonVariants = buttonVariants;
var Button = React.forwardRef(function (_a, ref) {
    var className = _a.className, variant = _a.variant, size = _a.size, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["className", "variant", "size", "asChild"]);
    var Comp = asChild ? react_slot_1.Slot : "button";
    return (<Comp className={(0, ui_1.cn)(buttonVariants({ variant: variant, size: size, className: className }))} ref={ref} {...props}/>);
});
exports.Button = Button;
Button.displayName = "Button";
