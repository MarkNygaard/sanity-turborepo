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
exports.AccordionContent = exports.AccordionTrigger = exports.AccordionItem = exports.Accordion = void 0;
var React = require("react");
var AccordionPrimitive = require("@radix-ui/react-accordion");
var react_icons_1 = require("@radix-ui/react-icons");
var ui_1 = require("@repo/ui");
var Accordion = AccordionPrimitive.Root;
exports.Accordion = Accordion;
var AccordionItem = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<AccordionPrimitive.Item ref={ref} className={(0, ui_1.cn)("border-b", className)} {...props}/>);
});
exports.AccordionItem = AccordionItem;
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger ref={ref} className={(0, ui_1.cn)("flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", className)} {...props}>
      {children}
      <react_icons_1.ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"/>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>);
});
exports.AccordionTrigger = AccordionTrigger;
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<AccordionPrimitive.Content ref={ref} className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...props}>
    <div className={(0, ui_1.cn)("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>);
});
exports.AccordionContent = AccordionContent;
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
