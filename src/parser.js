"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unicode_1 = require("./unicode");
const validator_1 = require("./validator");
const DummyPattern = {};
const DummyFlags = {};
const DummyCapturingGroup = {};
class RegExpParserState {
    constructor(options) {
        this._node = DummyPattern;
        this._flags = DummyFlags;
        this._backreferences = [];
        this._capturingGroups = [];
        this.source = "";
        this.strict = Boolean(options && options.strict);
        this.ecmaVersion = (options && options.ecmaVersion) || 2018;
        this.disableChkCharacterClassRange = Boolean(options && options.disableChkCharacterClassRange);
    }
    get pattern() {
        if (this._node.type !== "Pattern") {
            throw new Error("UnknownError");
        }
        return this._node;
    }
    get flags() {
        if (this._flags.type !== "Flags") {
            throw new Error("UnknownError");
        }
        return this._flags;
    }
    onFlags(start, end, global, ignoreCase, multiline, unicode, sticky, dotAll) {
        this._flags = {
            type: "Flags",
            parent: null,
            start,
            end,
            raw: this.source.slice(start, end),
            global,
            ignoreCase,
            multiline,
            unicode,
            sticky,
            dotAll,
        };
    }
    onPatternEnter(start) {
        this._node = {
            type: "Pattern",
            parent: null,
            start,
            end: start,
            raw: "",
            alternatives: [],
        };
        this._backreferences.length = 0;
        this._capturingGroups.length = 0;
    }
    onPatternLeave(start, end) {
        this._node.end = end;
        this._node.raw = this.source.slice(start, end);
        for (const reference of this._backreferences) {
            const ref = reference.ref;
            const group = typeof ref === "number"
                ? this._capturingGroups[ref - 1]
                : this._capturingGroups.find(g => g.name === ref);
            reference.resolved = group;
            group.references.push(reference);
        }
    }
    onAlternativeEnter(start) {
        const parent = this._node;
        if (parent.type !== "Assertion" &&
            parent.type !== "CapturingGroup" &&
            parent.type !== "Group" &&
            parent.type !== "Pattern") {
            throw new Error("UnknownError");
        }
        this._node = {
            type: "Alternative",
            parent,
            start,
            end: start,
            raw: "",
            elements: [],
        };
        parent.alternatives.push(this._node);
    }
    onAlternativeLeave(start, end) {
        const node = this._node;
        if (node.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        node.end = end;
        node.raw = this.source.slice(start, end);
        this._node = node.parent;
    }
    onGroupEnter(start) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        this._node = {
            type: "Group",
            parent,
            start,
            end: start,
            raw: "",
            alternatives: [],
        };
        parent.elements.push(this._node);
    }
    onGroupLeave(start, end) {
        const node = this._node;
        if (node.type !== "Group" || node.parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        node.end = end;
        node.raw = this.source.slice(start, end);
        this._node = node.parent;
    }
    onCapturingGroupEnter(start, name) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        this._node = {
            type: "CapturingGroup",
            parent,
            start,
            end: start,
            raw: "",
            name,
            alternatives: [],
            references: [],
        };
        parent.elements.push(this._node);
        this._capturingGroups.push(this._node);
    }
    onCapturingGroupLeave(start, end) {
        const node = this._node;
        if (node.type !== "CapturingGroup" ||
            node.parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        node.end = end;
        node.raw = this.source.slice(start, end);
        this._node = node.parent;
    }
    onQuantifier(start, end, min, max, greedy) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        // Replace the last element.
        const element = parent.elements.pop();
        if (element == null ||
            element.type === "Quantifier" ||
            (element.type === "Assertion" && element.kind !== "lookahead")) {
            throw new Error("UnknownError");
        }
        const node = {
            type: "Quantifier",
            parent,
            start: element.start,
            end,
            raw: this.source.slice(element.start, end),
            min,
            max,
            greedy,
            element,
        };
        parent.elements.push(node);
        element.parent = node;
    }
    onLookaroundAssertionEnter(start, kind, negate) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        this._node = {
            type: "Assertion",
            parent,
            start,
            end: start,
            raw: "",
            kind,
            negate,
            alternatives: [],
        };
        parent.elements.push(this._node);
    }
    onLookaroundAssertionLeave(start, end) {
        const node = this._node;
        if (node.type !== "Assertion" || node.parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        node.end = end;
        node.raw = this.source.slice(start, end);
        this._node = node.parent;
    }
    onEdgeAssertion(start, end, kind) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        parent.elements.push({
            type: "Assertion",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            kind,
        });
    }
    onWordBoundaryAssertion(start, end, kind, negate) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        parent.elements.push({
            type: "Assertion",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            kind,
            negate,
        });
    }
    onAnyCharacterSet(start, end, kind) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        parent.elements.push({
            type: "CharacterSet",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            kind,
        });
    }
    onEscapeCharacterSet(start, end, kind, negate) {
        const parent = this._node;
        if (parent.type !== "Alternative" && parent.type !== "CharacterClass") {
            throw new Error("UnknownError");
        }
        ;
        parent.elements.push({
            type: "CharacterSet",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            kind,
            negate,
        });
    }
    onUnicodePropertyCharacterSet(start, end, kind, key, value, negate) {
        const parent = this._node;
        if (parent.type !== "Alternative" && parent.type !== "CharacterClass") {
            throw new Error("UnknownError");
        }
        ;
        parent.elements.push({
            type: "CharacterSet",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            kind,
            key,
            value,
            negate,
        });
    }
    onCharacter(start, end, value) {
        const parent = this._node;
        if (parent.type !== "Alternative" && parent.type !== "CharacterClass") {
            throw new Error("UnknownError");
        }
        ;
        parent.elements.push({
            type: "Character",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            value,
        });
    }
    onBackreference(start, end, ref) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        const node = {
            type: "Backreference",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            ref,
            resolved: DummyCapturingGroup,
        };
        parent.elements.push(node);
        this._backreferences.push(node);
    }
    onCharacterClassEnter(start, negate) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        this._node = {
            type: "CharacterClass",
            parent,
            start,
            end: start,
            raw: "",
            negate,
            elements: [],
        };
        parent.elements.push(this._node);
    }
    onCharacterClassLeave(start, end) {
        const node = this._node;
        if (node.type !== "CharacterClass" ||
            node.parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        node.end = end;
        node.raw = this.source.slice(start, end);
        this._node = node.parent;
    }
    onCharacterClassRange(start, end) {
        const parent = this._node;
        if (parent.type !== "CharacterClass") {
            throw new Error("UnknownError");
        }
        // Replace the last three elements.
        const elements = parent.elements;
        const max = elements.pop();
        const hyphen = elements.pop();
        const min = elements.pop();
        if (!min ||
            !max ||
            !hyphen ||
            min.type !== "Character" ||
            max.type !== "Character" ||
            hyphen.type !== "Character" ||
            hyphen.value !== unicode_1.HyphenMinus) {
            throw new Error("UnknownError");
        }
        const node = {
            type: "CharacterClassRange",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            min,
            max,
        };
        min.parent = node;
        max.parent = node;
        elements.push(node);
    }
}
class RegExpParser {
    /**
     * Initialize this parser.
     * @param options The options of parser.
     */
    constructor(options) {
        this._state = new RegExpParserState(options);
        this._validator = new validator_1.RegExpValidator(this._state);
    }
    /**
     * Parse a regular expression literal. E.g. "/abc/g"
     * @param source The source code to parse.
     * @param start The start index in the source code.
     * @param end The end index in the source code.
     * @returns The AST of the given regular expression.
     */
    parseLiteral(source, start = 0, end = source.length) {
        this._state.source = source;
        this._validator.validateLiteral(source, start, end);
        const pattern = this._state.pattern;
        const flags = this._state.flags;
        const literal = {
            type: "RegExpLiteral",
            parent: null,
            start,
            end,
            raw: source,
            pattern,
            flags,
        };
        pattern.parent = literal;
        flags.parent = literal;
        return literal;
    }
    /**
     * Parse a regular expression flags. E.g. "gim"
     * @param source The source code to parse.
     * @param start The start index in the source code.
     * @param end The end index in the source code.
     * @returns The AST of the given flags.
     */
    parseFlags(source, start = 0, end = source.length) {
        this._state.source = source;
        this._validator.validateFlags(source, start, end);
        return this._state.flags;
    }
    /**
     * Parse a regular expression pattern. E.g. "abc"
     * @param source The source code to parse.
     * @param start The start index in the source code.
     * @param end The end index in the source code.
     * @param uFlag The flag to set unicode mode.
     * @returns The AST of the given pattern.
     */
    parsePattern(source, start = 0, end = source.length, uFlag = false) {
        this._state.source = source;
        this._validator.validatePattern(source, start, end, uFlag);
        return this._state.pattern;
    }
}
exports.RegExpParser = RegExpParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBY0EsdUNBQXVDO0FBQ3ZDLDJDQUE2QztBQVU3QyxNQUFNLFlBQVksR0FBRyxFQUFhLENBQUE7QUFDbEMsTUFBTSxVQUFVLEdBQUcsRUFBVyxDQUFBO0FBQzlCLE1BQU0sbUJBQW1CLEdBQUcsRUFBb0IsQ0FBQTtBQUVoRCxNQUFNLGlCQUFpQjtJQWFuQixZQUFtQixPQUE4QjtRQVB6QyxVQUFLLEdBQW1CLFlBQVksQ0FBQTtRQUNwQyxXQUFNLEdBQVUsVUFBVSxDQUFBO1FBQzFCLG9CQUFlLEdBQW9CLEVBQUUsQ0FBQTtRQUNyQyxxQkFBZ0IsR0FBcUIsRUFBRSxDQUFBO1FBRXhDLFdBQU0sR0FBRyxFQUFFLENBQUE7UUFHZCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQTtRQUMzRCxJQUFJLENBQUMsNkJBQTZCLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtJQUNsRyxDQUFDO0lBRUQsSUFBVyxPQUFPO1FBQ2QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQTtTQUNsQztRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtJQUNyQixDQUFDO0lBRUQsSUFBVyxLQUFLO1FBQ1osSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQTtTQUNsQztRQUNELE9BQU8sSUFB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QztDQUNKO0FBOUVELG9DQThFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWx0ZXJuYXRpdmUsXG4gICAgQmFja3JlZmVyZW5jZSxcbiAgICBDYXB0dXJpbmdHcm91cCxcbiAgICBDaGFyYWN0ZXJDbGFzcyxcbiAgICBDaGFyYWN0ZXJDbGFzc0VsZW1lbnQsXG4gICAgQ2hhcmFjdGVyQ2xhc3NSYW5nZSxcbiAgICBGbGFncyxcbiAgICBHcm91cCxcbiAgICBSZWdFeHBMaXRlcmFsLFxuICAgIExvb2thcm91bmRBc3NlcnRpb24sXG4gICAgUGF0dGVybixcbiAgICBRdWFudGlmaWVyLFxufSBmcm9tIFwiLi9hc3RcIlxuaW1wb3J0IHsgSHlwaGVuTWludXMgfSBmcm9tIFwiLi91bmljb2RlXCJcbmltcG9ydCB7IFJlZ0V4cFZhbGlkYXRvciB9IGZyb20gXCIuL3ZhbGlkYXRvclwiXG5cbmV4cG9ydCB0eXBlIEFwcGVuZGFibGVOb2RlID1cbiAgICB8IFBhdHRlcm5cbiAgICB8IEFsdGVybmF0aXZlXG4gICAgfCBHcm91cFxuICAgIHwgQ2FwdHVyaW5nR3JvdXBcbiAgICB8IENoYXJhY3RlckNsYXNzXG4gICAgfCBMb29rYXJvdW5kQXNzZXJ0aW9uXG5cbmNvbnN0IER1bW15UGF0dGVybiA9IHt9IGFzIFBhdHRlcm5cbmNvbnN0IER1bW15RmxhZ3MgPSB7fSBhcyBGbGFnc1xuY29uc3QgRHVtbXlDYXB0dXJpbmdHcm91cCA9IHt9IGFzIENhcHR1cmluZ0dyb3VwXG5cbmNsYXNzIFJlZ0V4cFBhcnNlclN0YXRlIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgc3RyaWN0OiBib29sZWFuXG4gICAgcHVibGljIHJlYWRvbmx5IGVjbWFWZXJzaW9uOiA1IHwgMjAxNSB8IDIwMTYgfCAyMDE3IHwgMjAxOFxuXG4gICAgcmVhZG9ubHkgZGlzYWJsZUNoa0NoYXJhY3RlckNsYXNzUmFuZ2U6IGJvb2xlYW5cblxuICAgIHByaXZhdGUgX25vZGU6IEFwcGVuZGFibGVOb2RlID0gRHVtbXlQYXR0ZXJuXG4gICAgcHJpdmF0ZSBfZmxhZ3M6IEZsYWdzID0gRHVtbXlGbGFnc1xuICAgIHByaXZhdGUgX2JhY2tyZWZlcmVuY2VzOiBCYWNrcmVmZXJlbmNlW10gPSBbXVxuICAgIHByaXZhdGUgX2NhcHR1cmluZ0dyb3VwczogQ2FwdHVyaW5nR3JvdXBbXSA9IFtdXG5cbiAgICBwdWJsaWMgc291cmNlID0gXCJcIlxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBSZWdFeHBQYXJzZXIuT3B0aW9ucykge1xuICAgICAgICB0aGlzLnN0cmljdCA9IEJvb2xlYW4ob3B0aW9ucyAmJiBvcHRpb25zLnN0cmljdClcbiAgICAgICAgdGhpcy5lY21hVmVyc2lvbiA9IChvcHRpb25zICYmIG9wdGlvbnMuZWNtYVZlcnNpb24pIHx8IDIwMThcbiAgICAgICAgdGhpcy5kaXNhYmxlQ2hrQ2hhcmFjdGVyQ2xhc3NSYW5nZSA9IEJvb2xlYW4ob3B0aW9ucyAmJiBvcHRpb25zLmRpc2FibGVDaGtDaGFyYWN0ZXJDbGFzc1JhbmdlKVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgcGF0dGVybigpOiBQYXR0ZXJuIHtcbiAgICAgICAgaWYgKHRoaXMuX25vZGUudHlwZSAhPT0gXCJQYXR0ZXJuXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd25FcnJvclwiKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBmbGFncygpOiBGbGFncyB7XG4gICAgICAgIGlmICh0aGlzLl9mbGFncy50eXBlICE9PSBcIkZsYWdzXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd25FcnJvclwiKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9mbGFnc1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkZsYWdzKFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgZ2xvYmFsOiBib29sZWFuLFxuICAgICAgICBpZ25vcmVDYXNlOiBib29sZWFuLFxuICAgICAgICBtdWx0aWxpbmU6IGJvb2xlYW4sXG4gICAgICAgIHVuaWNvZGU6IGJvb2xlYW4sXG4gICAgICAgIHN0aWNreTogYm9vbGVhbixcbiAgICAgICAgZG90QWxsOiBib29sZWFuLFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLl9mbGFncyA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiRmxhZ3NcIixcbiAgICAgICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgZW5kLFxuICAgICAgICAgICAgcmF3OiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgZW5kKSxcbiAgICAgICAgICAgIGdsb2JhbCxcbiAgICAgICAgICAgIGlnbm9yZUNhc2UsXG4gICAgICAgICAgICBtdWx0aWxpbmUsXG4gICAgICAgICAgICB1bmljb2RlLFxuICAgICAgICAgICAgc3RpY2t5LFxuICAgICAgICAgICAgZG90QWxsLFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9uUGF0dGVybkVudGVyKHN0YXJ0OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiUGF0dGVyblwiLFxuICAgICAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IHN0YXJ0LFxuICAgICAgICAgICAgcmF3OiBcIlwiLFxuICAgICAgICAgICAgYWx0ZXJuYXRpdmVzOiBbXSxcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9iYWNrcmVmZXJlbmNlcy5sZW5ndGggPSAwXG4gICAgICAgIHRoaXMuX2NhcHR1cmluZ0dyb3Vwcy5sZW5ndGggPSAwXG4gICAgfVxuXG4gICAgcHVibGljIG9uUGF0dGVybkxlYXZlKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX25vZGUuZW5kID0gZW5kXG4gICAgICAgIHRoaXMuX25vZGUucmF3ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZClcblxuICAgICAgICBmb3IgKGNvbnN0IHJlZmVyZW5jZSBvZiB0aGlzLl9iYWNrcmVmZXJlbmNlcykge1xuICAgICAgICAgICAgY29uc3QgcmVmID0gcmVmZXJlbmNlLnJlZlxuICAgICAgICAgICAgY29uc3QgZ3JvdXAgPVxuICAgICAgICAgICAgICAgIHR5cGVvZiByZWYgPT09IFwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLl9jYXB0dXJpbmdHcm91cHNbcmVmIC0gMV1cbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLl9jYXB0dXJpbmdHcm91cHMuZmluZChnID0+IGcubmFtZSA9PT0gcmVmKSFcbiAgICAgICAgICAgIHJlZmVyZW5jZS5yZXNvbHZlZCA9IGdyb3VwXG4gICAgICAgICAgICBncm91cC5yZWZlcmVuY2VzLnB1c2gocmVmZXJlbmNlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9uQWx0ZXJuYXRpdmVFbnRlcihzdGFydDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX25vZGVcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcGFyZW50LnR5cGUgIT09IFwiQXNzZXJ0aW9uXCIgJiZcbiAgICAgICAgICAgIHBhcmVudC50eXBlICE9PSBcIkNhcHR1cmluZ0dyb3VwXCIgJiZcbiAgICAgICAgICAgIHBhcmVudC50eXBlICE9PSBcIkdyb3VwXCIgJiZcbiAgICAgICAgICAgIHBhcmVudC50eXBlICE9PSBcIlBhdHRlcm5cIlxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd25FcnJvclwiKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiQWx0ZXJuYXRpdmVcIixcbiAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBzdGFydCxcbiAgICAgICAgICAgIHJhdzogXCJcIixcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbXSxcbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQuYWx0ZXJuYXRpdmVzLnB1c2godGhpcy5fbm9kZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgb25BbHRlcm5hdGl2ZUxlYXZlKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLl9ub2RlXG4gICAgICAgIGlmIChub2RlLnR5cGUgIT09IFwiQWx0ZXJuYXRpdmVcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93bkVycm9yXCIpXG4gICAgICAgIH1cblxuICAgICAgICBub2RlLmVuZCA9IGVuZFxuICAgICAgICBub2RlLnJhdyA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpXG4gICAgICAgIHRoaXMuX25vZGUgPSBub2RlLnBhcmVudFxuICAgIH1cblxuICAgIHB1YmxpYyBvbkdyb3VwRW50ZXIoc3RhcnQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9ub2RlXG4gICAgICAgIGlmIChwYXJlbnQudHlwZSAhPT0gXCJBbHRlcm5hdGl2ZVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX25vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiBcIkdyb3VwXCIsXG4gICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICBzdGFydCxcbiAgICAgICAgICAgIGVuZDogc3RhcnQsXG4gICAgICAgICAgICByYXc6IFwiXCIsXG4gICAgICAgICAgICBhbHRlcm5hdGl2ZXM6IFtdLFxuICAgICAgICB9XG4gICAgICAgIHBhcmVudC5lbGVtZW50cy5wdXNoKHRoaXMuX25vZGUpXG4gICAgfVxuXG4gICAgcHVibGljIG9uR3JvdXBMZWF2ZShzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5fbm9kZVxuICAgICAgICBpZiAobm9kZS50eXBlICE9PSBcIkdyb3VwXCIgfHwgbm9kZS5wYXJlbnQudHlwZSAhPT0gXCJBbHRlcm5hdGl2ZVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuZW5kID0gZW5kXG4gICAgICAgIG5vZGUucmF3ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICAgICAgdGhpcy5fbm9kZSA9IG5vZGUucGFyZW50XG4gICAgfVxuXG4gICAgcHVibGljIG9uQ2FwdHVyaW5nR3JvdXBFbnRlcihzdGFydDogbnVtYmVyLCBuYW1lOiBzdHJpbmcgfCBudWxsKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX25vZGVcbiAgICAgICAgaWYgKHBhcmVudC50eXBlICE9PSBcIkFsdGVybmF0aXZlXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd25FcnJvclwiKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiQ2FwdHVyaW5nR3JvdXBcIixcbiAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBzdGFydCxcbiAgICAgICAgICAgIHJhdzogXCJcIixcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBhbHRlcm5hdGl2ZXM6IFtdLFxuICAgICAgICAgICAgcmVmZXJlbmNlczogW10sXG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50LmVsZW1lbnRzLnB1c2godGhpcy5fbm9kZSlcbiAgICAgICAgdGhpcy5fY2FwdHVyaW5nR3JvdXBzLnB1c2godGhpcy5fbm9kZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgb25DYXB0dXJpbmdHcm91cExlYXZlKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLl9ub2RlXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIG5vZGUudHlwZSAhPT0gXCJDYXB0dXJpbmdHcm91cFwiIHx8XG4gICAgICAgICAgICBub2RlLnBhcmVudC50eXBlICE9PSBcIkFsdGVybmF0aXZlXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuZW5kID0gZW5kXG4gICAgICAgIG5vZGUucmF3ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICAgICAgdGhpcy5fbm9kZSA9IG5vZGUucGFyZW50XG4gICAgfVxuXG4gICAgcHVibGljIG9uUXVhbnRpZmllcihcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIG1pbjogbnVtYmVyLFxuICAgICAgICBtYXg6IG51bWJlcixcbiAgICAgICAgZ3JlZWR5OiBib29sZWFuLFxuICAgICk6IHZvaWQge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9ub2RlXG4gICAgICAgIGlmIChwYXJlbnQudHlwZSAhPT0gXCJBbHRlcm5hdGl2ZVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIGxhc3QgZWxlbWVudC5cbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHBhcmVudC5lbGVtZW50cy5wb3AoKVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBlbGVtZW50ID09IG51bGwgfHxcbiAgICAgICAgICAgIGVsZW1lbnQudHlwZSA9PT0gXCJRdWFudGlmaWVyXCIgfHxcbiAgICAgICAgICAgIChlbGVtZW50LnR5cGUgPT09IFwiQXNzZXJ0aW9uXCIgJiYgZWxlbWVudC5raW5kICE9PSBcImxvb2thaGVhZFwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd25FcnJvclwiKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgbm9kZTogUXVhbnRpZmllciA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiUXVhbnRpZmllclwiLFxuICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgc3RhcnQ6IGVsZW1lbnQuc3RhcnQsXG4gICAgICAgICAgICBlbmQsXG4gICAgICAgICAgICByYXc6IHRoaXMuc291cmNlLnNsaWNlKGVsZW1lbnQuc3RhcnQsIGVuZCksXG4gICAgICAgICAgICBtaW4sXG4gICAgICAgICAgICBtYXgsXG4gICAgICAgICAgICBncmVlZHksXG4gICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICB9XG4gICAgICAgIHBhcmVudC5lbGVtZW50cy5wdXNoKG5vZGUpXG4gICAgICAgIGVsZW1lbnQucGFyZW50ID0gbm9kZVxuICAgIH1cblxuICAgIHB1YmxpYyBvbkxvb2thcm91bmRBc3NlcnRpb25FbnRlcihcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAga2luZDogXCJsb29rYWhlYWRcIiB8IFwibG9va2JlaGluZFwiLFxuICAgICAgICBuZWdhdGU6IGJvb2xlYW4sXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX25vZGVcbiAgICAgICAgaWYgKHBhcmVudC50eXBlICE9PSBcIkFsdGVybmF0aXZlXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd25FcnJvclwiKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiQXNzZXJ0aW9uXCIsXG4gICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICBzdGFydCxcbiAgICAgICAgICAgIGVuZDogc3RhcnQsXG4gICAgICAgICAgICByYXc6IFwiXCIsXG4gICAgICAgICAgICBraW5kLFxuICAgICAgICAgICAgbmVnYXRlLFxuICAgICAgICAgICAgYWx0ZXJuYXRpdmVzOiBbXSxcbiAgICAgICAgfSBhcyBMb29rYXJvdW5kQXNzZXJ0aW9uXG4gICAgICAgIHBhcmVudC5lbGVtZW50cy5wdXNoKHRoaXMuX25vZGUpXG4gICAgfVxuXG4gICAgcHVibGljIG9uTG9va2Fyb3VuZEFzc2VydGlvbkxlYXZlKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLl9ub2RlXG4gICAgICAgIGlmIChub2RlLnR5cGUgIT09IFwiQXNzZXJ0aW9uXCIgfHwgbm9kZS5wYXJlbnQudHlwZSAhPT0gXCJBbHRlcm5hdGl2ZVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuZW5kID0gZW5kXG4gICAgICAgIG5vZGUucmF3ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICAgICAgdGhpcy5fbm9kZSA9IG5vZGUucGFyZW50XG4gICAgfVxuXG4gICAgcHVibGljIG9uRWRnZUFzc2VydGlvbihcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIGtpbmQ6IFwic3RhcnRcIiB8IFwiZW5kXCIsXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX25vZGVcbiAgICAgICAgaWYgKHBhcmVudC50eXBlICE9PSBcIkFsdGVybmF0aXZlXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd25FcnJvclwiKVxuICAgICAgICB9XG5cbiAgICAgICAgcGFyZW50LmVsZW1lbnRzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogXCJBc3NlcnRpb25cIixcbiAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgZW5kLFxuICAgICAgICAgICAgcmF3OiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgZW5kKSxcbiAgICAgICAgICAgIGtpbmQsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVibGljIG9uV29yZEJvdW5kYXJ5QXNzZXJ0aW9uKFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAga2luZDogXCJ3b3JkXCIsXG4gICAgICAgIG5lZ2F0ZTogYm9vbGVhbixcbiAgICApOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fbm9kZVxuICAgICAgICBpZiAocGFyZW50LnR5cGUgIT09IFwiQWx0ZXJuYXRpdmVcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93bkVycm9yXCIpXG4gICAgICAgIH1cblxuICAgICAgICBwYXJlbnQuZWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBcIkFzc2VydGlvblwiLFxuICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgICBlbmQsXG4gICAgICAgICAgICByYXc6IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLFxuICAgICAgICAgICAga2luZCxcbiAgICAgICAgICAgIG5lZ2F0ZSxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwdWJsaWMgb25BbnlDaGFyYWN0ZXJTZXQoc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGtpbmQ6IFwiYW55XCIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fbm9kZVxuICAgICAgICBpZiAocGFyZW50LnR5cGUgIT09IFwiQWx0ZXJuYXRpdmVcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93bkVycm9yXCIpXG4gICAgICAgIH1cblxuICAgICAgICBwYXJlbnQuZWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBcIkNoYXJhY3RlclNldFwiLFxuICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgICBlbmQsXG4gICAgICAgICAgICByYXc6IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLFxuICAgICAgICAgICAga2luZCxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Fc2NhcGVDaGFyYWN0ZXJTZXQoXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBraW5kOiBcImRpZ2l0XCIgfCBcInNwYWNlXCIgfCBcIndvcmRcIixcbiAgICAgICAgbmVnYXRlOiBib29sZWFuLFxuICAgICk6IHZvaWQge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9ub2RlXG4gICAgICAgIGlmIChwYXJlbnQudHlwZSAhPT0gXCJBbHRlcm5hdGl2ZVwiICYmIHBhcmVudC50eXBlICE9PSBcIkNoYXJhY3RlckNsYXNzXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd25FcnJvclwiKVxuICAgICAgICB9XG5cbiAgICAgICAgOyhwYXJlbnQuZWxlbWVudHMgYXMgQ2hhcmFjdGVyQ2xhc3NFbGVtZW50W10pLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogXCJDaGFyYWN0ZXJTZXRcIixcbiAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgZW5kLFxuICAgICAgICAgICAgcmF3OiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgZW5kKSxcbiAgICAgICAgICAgIGtpbmQsXG4gICAgICAgICAgICBuZWdhdGUsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVibGljIG9uVW5pY29kZVByb3BlcnR5Q2hhcmFjdGVyU2V0KFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAga2luZDogXCJwcm9wZXJ0eVwiLFxuICAgICAgICBrZXk6IHN0cmluZyxcbiAgICAgICAgdmFsdWU6IHN0cmluZyB8IG51bGwsXG4gICAgICAgIG5lZ2F0ZTogYm9vbGVhbixcbiAgICApOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fbm9kZVxuICAgICAgICBpZiAocGFyZW50LnR5cGUgIT09IFwiQWx0ZXJuYXRpdmVcIiAmJiBwYXJlbnQudHlwZSAhPT0gXCJDaGFyYWN0ZXJDbGFzc1wiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIDsocGFyZW50LmVsZW1lbnRzIGFzIENoYXJhY3RlckNsYXNzRWxlbWVudFtdKS5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IFwiQ2hhcmFjdGVyU2V0XCIsXG4gICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICBzdGFydCxcbiAgICAgICAgICAgIGVuZCxcbiAgICAgICAgICAgIHJhdzogdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCksXG4gICAgICAgICAgICBraW5kLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBuZWdhdGUsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVibGljIG9uQ2hhcmFjdGVyKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX25vZGVcbiAgICAgICAgaWYgKHBhcmVudC50eXBlICE9PSBcIkFsdGVybmF0aXZlXCIgJiYgcGFyZW50LnR5cGUgIT09IFwiQ2hhcmFjdGVyQ2xhc3NcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93bkVycm9yXCIpXG4gICAgICAgIH1cblxuICAgICAgICA7KHBhcmVudC5lbGVtZW50cyBhcyBDaGFyYWN0ZXJDbGFzc0VsZW1lbnRbXSkucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBcIkNoYXJhY3RlclwiLFxuICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgICBlbmQsXG4gICAgICAgICAgICByYXc6IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVibGljIG9uQmFja3JlZmVyZW5jZShcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHJlZjogbnVtYmVyIHwgc3RyaW5nLFxuICAgICk6IHZvaWQge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9ub2RlXG4gICAgICAgIGlmIChwYXJlbnQudHlwZSAhPT0gXCJBbHRlcm5hdGl2ZVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vZGU6IEJhY2tyZWZlcmVuY2UgPSB7XG4gICAgICAgICAgICB0eXBlOiBcIkJhY2tyZWZlcmVuY2VcIixcbiAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgZW5kLFxuICAgICAgICAgICAgcmF3OiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgZW5kKSxcbiAgICAgICAgICAgIHJlZixcbiAgICAgICAgICAgIHJlc29sdmVkOiBEdW1teUNhcHR1cmluZ0dyb3VwLFxuICAgICAgICB9XG4gICAgICAgIHBhcmVudC5lbGVtZW50cy5wdXNoKG5vZGUpXG4gICAgICAgIHRoaXMuX2JhY2tyZWZlcmVuY2VzLnB1c2gobm9kZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgb25DaGFyYWN0ZXJDbGFzc0VudGVyKHN0YXJ0OiBudW1iZXIsIG5lZ2F0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9ub2RlXG4gICAgICAgIGlmIChwYXJlbnQudHlwZSAhPT0gXCJBbHRlcm5hdGl2ZVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX25vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiBcIkNoYXJhY3RlckNsYXNzXCIsXG4gICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICBzdGFydCxcbiAgICAgICAgICAgIGVuZDogc3RhcnQsXG4gICAgICAgICAgICByYXc6IFwiXCIsXG4gICAgICAgICAgICBuZWdhdGUsXG4gICAgICAgICAgICBlbGVtZW50czogW10sXG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50LmVsZW1lbnRzLnB1c2godGhpcy5fbm9kZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgb25DaGFyYWN0ZXJDbGFzc0xlYXZlKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLl9ub2RlXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIG5vZGUudHlwZSAhPT0gXCJDaGFyYWN0ZXJDbGFzc1wiIHx8XG4gICAgICAgICAgICBub2RlLnBhcmVudC50eXBlICE9PSBcIkFsdGVybmF0aXZlXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuZW5kID0gZW5kXG4gICAgICAgIG5vZGUucmF3ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICAgICAgdGhpcy5fbm9kZSA9IG5vZGUucGFyZW50XG4gICAgfVxuXG4gICAgcHVibGljIG9uQ2hhcmFjdGVyQ2xhc3NSYW5nZShzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9ub2RlXG4gICAgICAgIGlmIChwYXJlbnQudHlwZSAhPT0gXCJDaGFyYWN0ZXJDbGFzc1wiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIGxhc3QgdGhyZWUgZWxlbWVudHMuXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LmVsZW1lbnRzXG4gICAgICAgIGNvbnN0IG1heCA9IGVsZW1lbnRzLnBvcCgpXG4gICAgICAgIGNvbnN0IGh5cGhlbiA9IGVsZW1lbnRzLnBvcCgpXG4gICAgICAgIGNvbnN0IG1pbiA9IGVsZW1lbnRzLnBvcCgpXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICFtaW4gfHxcbiAgICAgICAgICAgICFtYXggfHxcbiAgICAgICAgICAgICFoeXBoZW4gfHxcbiAgICAgICAgICAgIG1pbi50eXBlICE9PSBcIkNoYXJhY3RlclwiIHx8XG4gICAgICAgICAgICBtYXgudHlwZSAhPT0gXCJDaGFyYWN0ZXJcIiB8fFxuICAgICAgICAgICAgaHlwaGVuLnR5cGUgIT09IFwiQ2hhcmFjdGVyXCIgfHxcbiAgICAgICAgICAgIGh5cGhlbi52YWx1ZSAhPT0gSHlwaGVuTWludXNcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duRXJyb3JcIilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vZGU6IENoYXJhY3RlckNsYXNzUmFuZ2UgPSB7XG4gICAgICAgICAgICB0eXBlOiBcIkNoYXJhY3RlckNsYXNzUmFuZ2VcIixcbiAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgZW5kLFxuICAgICAgICAgICAgcmF3OiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgZW5kKSxcbiAgICAgICAgICAgIG1pbixcbiAgICAgICAgICAgIG1heCxcbiAgICAgICAgfVxuICAgICAgICBtaW4ucGFyZW50ID0gbm9kZVxuICAgICAgICBtYXgucGFyZW50ID0gbm9kZVxuICAgICAgICBlbGVtZW50cy5wdXNoKG5vZGUpXG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIFJlZ0V4cFBhcnNlciB7XG4gICAgLyoqXG4gICAgICogVGhlIG9wdGlvbnMgZm9yIFJlZ0V4cFBhcnNlciBjb25zdHJ1Y3Rpb24uXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBmbGFnIHRvIGRpc2FibGUgQW5uZXggQiBzeW50YXguIERlZmF1bHQgaXMgYGZhbHNlYC5cbiAgICAgICAgICovXG4gICAgICAgIHN0cmljdD86IGJvb2xlYW5cblxuICAgICAgICAvKipcbiAgICAgICAgICogRUNNQVNjcmlwdCB2ZXJzaW9uLiBEZWZhdWx0IGlzIGAyMDE4YC5cbiAgICAgICAgICogLSBgMjAxNWAgYWRkZWQgYHVgIGFuZCBgeWAgZmxhZ3MuXG4gICAgICAgICAqIC0gYDIwMThgIGFkZGVkIGBzYCBmbGFnLCBOYW1lZCBDYXB0dXJpbmcgR3JvdXAsIExvb2tiZWhpbmQgQXNzZXJ0aW9uLFxuICAgICAgICAgKiAgIGFuZCBVbmljb2RlIFByb3BlcnR5IEVzY2FwZS5cbiAgICAgICAgICovXG4gICAgICAgIGVjbWFWZXJzaW9uPzogNSB8IDIwMTUgfCAyMDE2IHwgMjAxNyB8IDIwMThcblxuICAgICAgICBkaXNhYmxlQ2hrQ2hhcmFjdGVyQ2xhc3NSYW5nZT86IGJvb2xlYW5cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWdFeHBQYXJzZXIge1xuICAgIHByaXZhdGUgX3N0YXRlOiBSZWdFeHBQYXJzZXJTdGF0ZVxuICAgIHByaXZhdGUgX3ZhbGlkYXRvcjogUmVnRXhwVmFsaWRhdG9yXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIHRoaXMgcGFyc2VyLlxuICAgICAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zIG9mIHBhcnNlci5cbiAgICAgKi9cbiAgICBwdWJsaWMgY29uc3RydWN0b3Iob3B0aW9ucz86IFJlZ0V4cFBhcnNlci5PcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gbmV3IFJlZ0V4cFBhcnNlclN0YXRlKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRvciA9IG5ldyBSZWdFeHBWYWxpZGF0b3IodGhpcy5fc3RhdGUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgYSByZWd1bGFyIGV4cHJlc3Npb24gbGl0ZXJhbC4gRS5nLiBcIi9hYmMvZ1wiXG4gICAgICogQHBhcmFtIHNvdXJjZSBUaGUgc291cmNlIGNvZGUgdG8gcGFyc2UuXG4gICAgICogQHBhcmFtIHN0YXJ0IFRoZSBzdGFydCBpbmRleCBpbiB0aGUgc291cmNlIGNvZGUuXG4gICAgICogQHBhcmFtIGVuZCBUaGUgZW5kIGluZGV4IGluIHRoZSBzb3VyY2UgY29kZS5cbiAgICAgKiBAcmV0dXJucyBUaGUgQVNUIG9mIHRoZSBnaXZlbiByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAgICovXG4gICAgcHVibGljIHBhcnNlTGl0ZXJhbChcbiAgICAgICAgc291cmNlOiBzdHJpbmcsXG4gICAgICAgIHN0YXJ0ID0gMCxcbiAgICAgICAgZW5kOiBudW1iZXIgPSBzb3VyY2UubGVuZ3RoLFxuICAgICk6IFJlZ0V4cExpdGVyYWwge1xuICAgICAgICB0aGlzLl9zdGF0ZS5zb3VyY2UgPSBzb3VyY2VcbiAgICAgICAgdGhpcy5fdmFsaWRhdG9yLnZhbGlkYXRlTGl0ZXJhbChzb3VyY2UsIHN0YXJ0LCBlbmQpXG4gICAgICAgIGNvbnN0IHBhdHRlcm4gPSB0aGlzLl9zdGF0ZS5wYXR0ZXJuXG4gICAgICAgIGNvbnN0IGZsYWdzID0gdGhpcy5fc3RhdGUuZmxhZ3NcbiAgICAgICAgY29uc3QgbGl0ZXJhbDogUmVnRXhwTGl0ZXJhbCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiUmVnRXhwTGl0ZXJhbFwiLFxuICAgICAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgICBlbmQsXG4gICAgICAgICAgICByYXc6IHNvdXJjZSxcbiAgICAgICAgICAgIHBhdHRlcm4sXG4gICAgICAgICAgICBmbGFncyxcbiAgICAgICAgfVxuICAgICAgICBwYXR0ZXJuLnBhcmVudCA9IGxpdGVyYWxcbiAgICAgICAgZmxhZ3MucGFyZW50ID0gbGl0ZXJhbFxuICAgICAgICByZXR1cm4gbGl0ZXJhbFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIGEgcmVndWxhciBleHByZXNzaW9uIGZsYWdzLiBFLmcuIFwiZ2ltXCJcbiAgICAgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2UgY29kZSB0byBwYXJzZS5cbiAgICAgKiBAcGFyYW0gc3RhcnQgVGhlIHN0YXJ0IGluZGV4IGluIHRoZSBzb3VyY2UgY29kZS5cbiAgICAgKiBAcGFyYW0gZW5kIFRoZSBlbmQgaW5kZXggaW4gdGhlIHNvdXJjZSBjb2RlLlxuICAgICAqIEByZXR1cm5zIFRoZSBBU1Qgb2YgdGhlIGdpdmVuIGZsYWdzLlxuICAgICAqL1xuICAgIHB1YmxpYyBwYXJzZUZsYWdzKFxuICAgICAgICBzb3VyY2U6IHN0cmluZyxcbiAgICAgICAgc3RhcnQgPSAwLFxuICAgICAgICBlbmQ6IG51bWJlciA9IHNvdXJjZS5sZW5ndGgsXG4gICAgKTogRmxhZ3Mge1xuICAgICAgICB0aGlzLl9zdGF0ZS5zb3VyY2UgPSBzb3VyY2VcbiAgICAgICAgdGhpcy5fdmFsaWRhdG9yLnZhbGlkYXRlRmxhZ3Moc291cmNlLCBzdGFydCwgZW5kKVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGUuZmxhZ3NcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBwYXR0ZXJuLiBFLmcuIFwiYWJjXCJcbiAgICAgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2UgY29kZSB0byBwYXJzZS5cbiAgICAgKiBAcGFyYW0gc3RhcnQgVGhlIHN0YXJ0IGluZGV4IGluIHRoZSBzb3VyY2UgY29kZS5cbiAgICAgKiBAcGFyYW0gZW5kIFRoZSBlbmQgaW5kZXggaW4gdGhlIHNvdXJjZSBjb2RlLlxuICAgICAqIEBwYXJhbSB1RmxhZyBUaGUgZmxhZyB0byBzZXQgdW5pY29kZSBtb2RlLlxuICAgICAqIEByZXR1cm5zIFRoZSBBU1Qgb2YgdGhlIGdpdmVuIHBhdHRlcm4uXG4gICAgICovXG4gICAgcHVibGljIHBhcnNlUGF0dGVybihcbiAgICAgICAgc291cmNlOiBzdHJpbmcsXG4gICAgICAgIHN0YXJ0ID0gMCxcbiAgICAgICAgZW5kOiBudW1iZXIgPSBzb3VyY2UubGVuZ3RoLFxuICAgICAgICB1RmxhZyA9IGZhbHNlLFxuICAgICk6IFBhdHRlcm4ge1xuICAgICAgICB0aGlzLl9zdGF0ZS5zb3VyY2UgPSBzb3VyY2VcbiAgICAgICAgdGhpcy5fdmFsaWRhdG9yLnZhbGlkYXRlUGF0dGVybihzb3VyY2UsIHN0YXJ0LCBlbmQsIHVGbGFnKVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGUucGF0dGVyblxuICAgIH1cbn1cbiJdfQ==