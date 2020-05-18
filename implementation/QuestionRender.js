/**
 *
 *    This code has been exported from davecode.me's source.
 *    written by Dave Caruso, 2020.
 *
 *    You may do whatever you want with it, with the exception of selling this
 *    code, or any derivative of it. It is not required, but you should also
 *    modify the code if you want to make your own question page, so you don't
 *    look exactly like a copycat.
 *
 */
import React from 'react';
import NPMColor from 'color';

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function Block(_a) {
    var _b = _a.width, width = _b === void 0 ? 5 : _b;
    return (React.createElement(React.Fragment, null,
        React.createElement("span", { style: { background: 'var(--color)' } }, Array(width * 2)
            .fill(0)
            .map(function (_, i) { return (React.createElement(React.Fragment, { key: i }, "\u00A0")); }))));
}

var colorContext = React.createContext(null);
function Color(_a) {
    var color = _a.color, style = _a.style, component = _a.component, calcDark = _a.calcDark, props = __rest(_a, ["color", "style", "component", "calcDark"]);
    var Comp = component || 'div';
    return (React.createElement(colorContext.Provider, { value: color },
        React.createElement(Comp, __assign({ style: __assign(__assign({ '--color': color }, (calcDark ? { '--cd': NPMColor(color).darken(0.25).hex() } : {})), style) }, props))));
}
function bind(component) {
    return function (_a) {
        var props = __rest(_a, []);
        return React.createElement(Color, __assign({ component: component }, props));
    };
}
Color.div = Color;
Color.span = bind('span');
Color.p = bind('p');
Color.h1 = bind('h1');
Color.h2 = bind('h2');
Color.h3 = bind('h3');

var customComps = {
    Block: Block,
    Color: Color,
    Fragment: React.Fragment,
};
function RawFallback(_a) {
    var children = _a.children;
    return React.createElement("span", null, children);
}
function QuestionText(_a) {
    var text = _a.text, Raw = _a.Raw;
    var k = 0;
    if (!text) {
        return React.createElement("h1", null, "[[[NO TEXT]]]");
    }
    var paragraphs = text.split("\n").filter(Boolean);
    return (React.createElement(React.Fragment, null, paragraphs.map(function (text, i) {
        var Element = "p";
        var props = {};
        if (text.startsWith("RootElement=")) {
            var readCompName = "";
            var bracketCount = 0;
            var i_1 = "RootElement=".length;
            var jsonStart = 0;
            for (; i_1 < text.length; i_1++) {
                if (text[i_1] === "{") {
                    if (bracketCount === 0) {
                        jsonStart = i_1;
                    }
                    bracketCount++;
                }
                else if (text[i_1] === "}") {
                    bracketCount--;
                    if (bracketCount === 0) {
                        break;
                    }
                }
                else if (bracketCount === 0) {
                    readCompName += text[i_1];
                }
            }
            Element = readCompName;
            props = JSON.parse(text.substring(jsonStart, i_1 + 1));
            text = text.substring(i_1 + 1);
        }
        var parts = [];
        var match;
        while ((match = text.match(/<Component:/))) {
            parts.push(React.createElement(Raw, { key: k++ }, text.substr(0, match.index)));
            text = text.substr(match.index);
            var readCompName = "";
            var bracketCount = 0;
            var i_2 = "<Component:".length;
            var jsonStart = 0;
            for (; i_2 < text.length; i_2++) {
                if (text[i_2] === "{") {
                    if (bracketCount === 0) {
                        jsonStart = i_2;
                    }
                    bracketCount++;
                }
                else if (text[i_2] === "}") {
                    bracketCount--;
                    if (bracketCount === 0) {
                        break;
                    }
                }
                else if (bracketCount === 0) {
                    readCompName += text[i_2];
                }
            }
            var compProps = JSON.parse(text.substring(jsonStart, i_2 + 1));
            text = text.substring(i_2 + 2);
            var Comp = customComps[readCompName] || "span";
            parts.push(React.createElement(Comp, __assign({ key: k++ }, compProps)));
        }
        return (React.createElement(Element, __assign({}, props, { key: k++ }), parts.concat(React.createElement(Raw, { key: k++ }, text))));
    })));
}
function QuestionRender(_a) {
    var artifact = _a.artifact, sitegen = _a.sitegen;
    var _b;
    var conversation = "conversation" in artifact
        ? artifact.conversation
        : [
            ["question", artifact.question],
            ["answer", artifact.answer],
        ];
    var Raw = (_b = sitegen === null || sitegen === void 0 ? void 0 : sitegen.Raw) !== null && _b !== void 0 ? _b : RawFallback;
    return (React.createElement(React.Fragment, null,
        React.createElement("span", { className: "d" }, artifact.date.replace(/(....-..-..)T(..:..):.*$/, '$1 $2')),
        conversation.map(function (_a, i) {
            var speaker = _a[0], text = _a[1];
            if (speaker === "question") {
                return (React.createElement(Color, { key: i, component: "div", color: "white", className: "q" },
                    React.createElement(QuestionText, { text: text, Raw: Raw })));
            }
            if (speaker === "answer") {
                return (React.createElement(Color, { key: i, component: "div", color: "#81ff61", className: "a" },
                    React.createElement(QuestionText, { text: text, Raw: Raw })));
            }
        })));
}

export default QuestionRender;
