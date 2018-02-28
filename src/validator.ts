import { RegExpSyntaxError } from "./regexp-syntax-error"
import {
    Asterisk,
    Backspace,
    CarriageReturn,
    CharacterTabulation,
    CircumflexAccent,
    Colon,
    Comma,
    DigitNine,
    DigitOne,
    digitToInt,
    DigitZero,
    DollarSign,
    EqualsSign,
    ExclamationMark,
    FormFeed,
    FullStop,
    GreaterThanSign,
    HyphenMinus,
    isDecimalDigit,
    isHexDigit,
    isIdContinue,
    isIdStart,
    isLatinLetter,
    isLineTerminator,
    isOctalDigit,
    isValidUnicode,
    LatinCapitalLetterB,
    LatinCapitalLetterD,
    LatinCapitalLetterP,
    LatinCapitalLetterS,
    LatinCapitalLetterW,
    LatinSmallLetterB,
    LatinSmallLetterC,
    LatinSmallLetterD,
    LatinSmallLetterF,
    LatinSmallLetterG,
    LatinSmallLetterI,
    LatinSmallLetterK,
    LatinSmallLetterM,
    LatinSmallLetterN,
    LatinSmallLetterP,
    LatinSmallLetterR,
    LatinSmallLetterS,
    LatinSmallLetterT,
    LatinSmallLetterU,
    LatinSmallLetterV,
    LatinSmallLetterW,
    LatinSmallLetterX,
    LatinSmallLetterY,
    LeftCurlyBracket,
    LeftParenthesis,
    LeftSquareBracket,
    LessThanSign,
    LineFeed,
    LineTabulation,
    LowLine,
    PlusSign,
    PropertyData,
    QuestionMark,
    ReverseSolidus,
    RightCurlyBracket,
    RightParenthesis,
    RightSquareBracket,
    Solidus,
    VerticalLine,
    ZeroWidthJoiner,
    ZeroWidthNonJoiner,
} from "./unicode"

function toCodePointsLegacy(source: string): number[] {
    const codePoints = new Array<number>(source.length)
    for (let i = 0; i < source.length; ++i) {
        codePoints[i] = source.charCodeAt(i)
    }
    return codePoints
}

function toCodePoints(source: string): number[] {
    const codePoints = new Array<number>(source.length)
    let length = 0
    for (let i = 0, c = 0; i < source.length; i += c > 0xffff ? 2 : 1) {
        codePoints[length++] = c = source.codePointAt(i)!
    }
    codePoints.length = length
    return codePoints
}

function isSyntaxCharacter(code: number): boolean {
    return (
        code === CircumflexAccent ||
        code === DollarSign ||
        code === ReverseSolidus ||
        code === FullStop ||
        code === Asterisk ||
        code === PlusSign ||
        code === QuestionMark ||
        code === LeftParenthesis ||
        code === RightParenthesis ||
        code === LeftSquareBracket ||
        code === RightSquareBracket ||
        code === LeftCurlyBracket ||
        code === RightCurlyBracket ||
        code === VerticalLine
    )
}

function isRegExpIdentifierStart(code: number): boolean {
    return isIdStart(code) || code === DollarSign || code === LowLine
}

function isRegExpIdentifierPart(code: number): boolean {
    return (
        isIdContinue(code) ||
        code === DollarSign ||
        code === LowLine ||
        code === ZeroWidthNonJoiner ||
        code === ZeroWidthJoiner
    )
}

function isUnicodePropertyNameCharacter(code: number): boolean {
    return isLatinLetter(code) || code === LowLine
}

function isUnicodePropertyValueCharacter(code: number): boolean {
    return isUnicodePropertyNameCharacter(code) || isDecimalDigit(code)
}

function isValidUnicodePropertyNameAndValue(
    name: string,
    value: string,
): boolean {
    //eslint-disable-next-line no-prototype-builtins
    return PropertyData.hasOwnProperty(name) && PropertyData[name].has(value)
}

function isValidUnicodePropertyName(name: string): boolean {
    return PropertyData.$LONE.has(name)
}

export class RegExpValidator {
    readonly strict: boolean
    readonly ecmaVersion: 5 | 2015 | 2016 | 2017 | 2018
    private uFlag: boolean = false
    private nFlag: boolean = false
    private _s: ReadonlyArray<number> = []
    private _i: number = -1
    private curr: number = 0
    private next: number = 0
    private lastIntValue: number = 0
    private lastMinValue: number = 0
    private lastMaxValue: number = 0
    private lastStringValue: string = ""
    private lastKeyValue: string = ""
    private lastValValue: string = ""
    private lastAssertionIsQuantifiable: boolean = false
    private numCapturingParens: number = 0
    private maxBackreference: number = 0
    private groupNames: Set<string> = new Set<string>()
    private backreferenceNames: Set<string> = new Set<string>()

    constructor(options?: RegExpValidator.Options) {
        this.strict = Boolean(options && options.strict)
        this.ecmaVersion = (options && options.ecmaVersion) || 2018
    }

    /**
     * Validate a RegExp literal. E.g. "/abc/g"
     * @param source The source code of RegExp literal to validate.
     */
    validateLiteral(source: string): void {
        this.uFlag = false
        this.reset(source)
        if (this.eat1(Solidus) && this.eatRegExpBody() && this.eat1(Solidus)) {
            const pattern = source.slice(1, this._i - 1)
            const flags = source.slice(this._i)

            this.validateFlags(flags)
            this.validatePattern(pattern, flags.indexOf("u") !== -1)
        } else {
            const c = String.fromCodePoint(this.curr)
            this.raise(`Unexpected character '${c}'`)
        }
    }

    validateFlags(source: string): void {
        const existingFlags = new Set<number>()
        for (let i = 0; i < source.length; ++i) {
            const flag = source.charCodeAt(i)

            if (existingFlags.has(flag)) {
                this.raise(`Duplicated flag '${source[i]}'`)
            }
            existingFlags.add(flag)

            if (
                (flag !== LatinSmallLetterS || this.ecmaVersion >= 2018) &&
                (flag !== LatinSmallLetterU || this.ecmaVersion >= 2015) &&
                (flag !== LatinSmallLetterY || this.ecmaVersion >= 2015) &&
                flag !== LatinSmallLetterG &&
                flag !== LatinSmallLetterI &&
                flag !== LatinSmallLetterM
            ) {
                this.raise(`Invalid flag '${source[i]}'`)
            }
        }
    }

    validatePattern(source: string, uFlag: boolean): void {
        this.uFlag = this.nFlag = uFlag
        this.reset(source)
        this.onPattern()

        if (!this.nFlag && this.ecmaVersion >= 9 && this.groupNames.size > 0) {
            this.rewind(0)
            this.nFlag = true
            this.onPattern()
        }
    }

    //--------------------------------------------------------------------------
    // Utils
    //--------------------------------------------------------------------------

    protected get source(): ReadonlyArray<number> {
        return this._s
    }

    protected get index(): number {
        return this._i
    }

    private reset(source: string): void {
        this._s = (this.uFlag ? toCodePoints : toCodePointsLegacy)(source)
        this.rewind(0)
    }

    private rewind(index: number): void {
        this._i = index
        this.curr = this.at(index)
        this.next = this.at(index + 1)
    }

    private at(index: number): number {
        return index < this._s.length ? this._s[index] : -1
    }

    private advance(): void {
        if (this.curr !== -1) {
            this._i += 1
            this.curr = this.next
            this.next = this.at(this._i + 1)
        }
    }

    private eat1(code: number): boolean {
        if (this.curr === code) {
            this.advance()
            return true
        }
        return false
    }

    private eat2(code1: number, code2: number): boolean {
        if (this.curr === code1 && this.next === code2) {
            this.advance()
            this.advance()
            return true
        }
        return false
    }

    private raise(message: string): never {
        throw new RegExpSyntaxError(
            String.fromCodePoint(...this._s),
            this._i,
            message,
        )
    }

    //--------------------------------------------------------------------------
    // Hooks
    //--------------------------------------------------------------------------

    protected onPattern(): void {
        this.numCapturingParens = 0
        this.maxBackreference = 0
        this.groupNames.clear()
        this.backreferenceNames.clear()

        this.disjunction()

        const code = this.curr
        if (this.curr !== -1) {
            if (code === RightParenthesis) {
                this.raise("Unmatched ')'")
            }
            if (code === RightSquareBracket || code === RightCurlyBracket) {
                this.raise("Lone quantifier brackets")
            }
            const c = String.fromCodePoint(this.curr)
            this.raise(`Unexpected character '${c}'`)
        }
        if (this.maxBackreference > this.numCapturingParens) {
            this.raise("Invalid escape")
        }
        for (const name of this.backreferenceNames) {
            if (!this.groupNames.has(name)) {
                this.raise("Invalid named capture referenced")
            }
        }
    }

    protected onAlternative(index: number): void {
        this.alternative()
    }

    protected onGroup(start: number): void {
        this.disjunction()
        if (!this.eat1(RightParenthesis)) {
            this.raise("Unterminated group")
        }
    }

    protected onCapturingGroup(start: number, name: string | null): void {
        this.disjunction()
        if (!this.eat1(RightParenthesis)) {
            this.raise("Unterminated group")
        }
    }

    protected onLookaroundAssertion(
        start: number,
        kind: "lookahead" | "lookbehind",
        negate: boolean,
    ): void {
        this.disjunction()
        if (!this.eat1(RightParenthesis)) {
            this.raise("Unterminated group")
        }
    }

    protected onQuantifier(
        start: number,
        min: number,
        max: number,
        greedy: boolean,
    ): void {
        // Do nothing.
    }

    protected onCharacterClass(start: number, negate: boolean): void {
        this.classRanges()
        if (!this.eat1(RightSquareBracket)) {
            this.raise("Unterminated character class")
        }
    }

    protected onCharacterClassRange(
        start: number,
        min: number,
        max: number,
    ): void {
        // Do nothing.
    }

    protected onEdgeAssertion(start: number, kind: "start" | "end"): void {
        // Do nothing.
    }

    protected onWordBoundaryAssertion(
        start: number,
        kind: "word",
        negate: boolean,
    ): void {
        // Do nothing.
    }

    protected onAnyCharacterSet(start: number, kind: "any"): void {
        // Do nothing.
    }

    protected onEscapeCharacterSet(
        start: number,
        kind: "digit" | "space" | "word",
        negate: boolean,
    ): void {
        // Do nothing.
    }

    protected onUnicodePropertyCharacterSet(
        start: number,
        kind: "property",
        key: string,
        value: string | null,
        negate: boolean,
    ): void {
        // Do nothing.
    }

    protected onCharacter(start: number, value: number): void {
        // Do nothing.
    }

    protected onBackreference(start: number, ref: number | string): void {
        // Do nothing.
    }

    //--------------------------------------------------------------------------
    // Parser implementation
    //--------------------------------------------------------------------------

    // https://www.ecma-international.org/ecma-262/8.0/#prod-RegularExpressionBody
    private eatRegExpBody(): boolean {
        const start = this._i
        let code = 0
        let inClass = false
        let escaped = false

        while ((code = this.curr) !== Solidus) {
            if (code === -1 || isLineTerminator(code)) {
                const kind = inClass ? "character class" : "regular expression"
                this.raise(`Unterminated ${kind}`)
            }
            if (escaped) {
                escaped = false
            } else if (code === ReverseSolidus) {
                escaped = true
            } else if (code === LeftSquareBracket) {
                inClass = true
            } else if (code === RightSquareBracket) {
                inClass = false
            } else if (code === Asterisk && this._i === start) {
                break
            }
            this.advance()
        }

        return this._i !== start
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-Disjunction
    private disjunction(): void {
        let i = 0
        this.onAlternative(i++)
        while (this.eat1(VerticalLine)) {
            this.onAlternative(i++)
        }

        if (this.eatQuantifier(true)) {
            this.raise("Nothing to repeat")
        }
        if (this.eat1(LeftCurlyBracket)) {
            this.raise("Lone quantifier brackets")
        }
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-Alternative
    private alternative(): void {
        while (this.curr !== -1 && this.eatTerm());
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-Term
    private eatTerm(): boolean {
        if (this.eatAssertion()) {
            // Handle `QuantifiableAssertion Quantifier` alternative.
            // `this.lastAssertionIsQuantifiable` is true if the last eaten
            // Assertion is a QuantifiableAssertion.
            return this.lastAssertionIsQuantifiable && this.eatQuantifier()
        }

        if (
            this.strict || this.uFlag ? this.eatAtom() : this.eatExtendedAtom()
        ) {
            this.eatQuantifier()
            return true
        }

        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-Assertion
    private eatAssertion(): boolean {
        const start = this._i
        this.lastAssertionIsQuantifiable = false

        // ^, $, \B \b
        if (this.eat1(CircumflexAccent)) {
            this.onEdgeAssertion(start, "start")
            return true
        }
        if (this.eat1(DollarSign)) {
            this.onEdgeAssertion(start, "end")
            return true
        }
        if (this.eat2(ReverseSolidus, LatinCapitalLetterB)) {
            this.onWordBoundaryAssertion(start, "word", true)
            return true
        }
        if (this.eat2(ReverseSolidus, LatinSmallLetterB)) {
            this.onWordBoundaryAssertion(start, "word", false)
            return true
        }

        // Lookahead / Lookbehind
        if (this.eat2(LeftParenthesis, QuestionMark)) {
            const lookbehind =
                this.ecmaVersion >= 2018 && this.eat1(LessThanSign)
            let negate = false
            if (
                this.eat1(EqualsSign) ||
                (negate = this.eat1(ExclamationMark))
            ) {
                this.onLookaroundAssertion(
                    start,
                    lookbehind ? "lookbehind" : "lookahead",
                    negate,
                )
                this.lastAssertionIsQuantifiable =
                    !lookbehind && !this.strict && !this.uFlag
                return true
            }
            this.rewind(start)
        }

        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-Quantifier
    // https://www.ecma-international.org/ecma-262/8.0/#prod-QuantifierPrefix
    private eatQuantifier(noError = false): boolean {
        const start = this._i
        let min = 0
        let max = 0
        let greedy = false

        if (this.eat1(Asterisk)) {
            min = 0
            max = Number.POSITIVE_INFINITY
        } else if (this.eat1(PlusSign)) {
            min = 1
            max = Number.POSITIVE_INFINITY
        } else if (this.eat1(QuestionMark)) {
            min = 0
            max = 1
        } else if (this.eatBracedQuantifier(noError)) {
            min = this.lastMinValue
            max = this.lastMaxValue
        } else {
            return false
        }
        greedy = !this.eat1(QuestionMark)

        this.onQuantifier(start, min, max, greedy)

        return true
    }

    private eatBracedQuantifier(noError: boolean): boolean {
        const start = this._i
        if (this.eat1(LeftCurlyBracket)) {
            this.lastMinValue = 0
            this.lastMaxValue = Number.POSITIVE_INFINITY
            if (this.eatDecimalDigits()) {
                this.lastMinValue = this.lastMaxValue = this.lastIntValue
                if (this.eat1(Comma)) {
                    this.lastMaxValue = this.eatDecimalDigits()
                        ? this.lastIntValue
                        : Number.POSITIVE_INFINITY
                }
                if (this.eat1(RightCurlyBracket)) {
                    // SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-term
                    if (!noError && this.lastMaxValue < this.lastMinValue) {
                        this.raise("numbers out of order in {} quantifier")
                    }
                    return true
                }
            }
            if (!noError && (this.strict || this.uFlag)) {
                this.raise("Incomplete quantifier")
            }
            this.rewind(start)
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-Atom
    private eatAtom(): boolean {
        return (
            this.eatPatternCharacter() ||
            this.eatDot() ||
            this.eatReverseSolidusAtomEscape() ||
            this.eatCharacterClass() ||
            this.eatUncapturingGroup() ||
            this.eatCapturingGroup()
        )
    }
    private eatDot(): boolean {
        if (this.eat1(FullStop)) {
            this.onAnyCharacterSet(this._i - 1, "any")
            return true
        }
        return false
    }
    private eatReverseSolidusAtomEscape(): boolean {
        const start = this._i
        if (this.eat1(ReverseSolidus)) {
            if (this.eatAtomEscape()) {
                return true
            }
            this.rewind(start)
        }
        return false
    }
    private eatUncapturingGroup(): boolean {
        const start = this._i
        if (this.eat1(LeftParenthesis)) {
            if (this.eat1(QuestionMark) && this.eat1(Colon)) {
                this.onGroup(start)
                return true
            }
            this.rewind(start)
        }
        return false
    }
    private eatCapturingGroup(): boolean {
        const start = this._i
        if (this.eat1(LeftParenthesis)) {
            if (this.ecmaVersion >= 9) {
                this.groupSpecifier()
            } else if (this.curr === QuestionMark) {
                this.raise("Invalid group")
            }
            this.onCapturingGroup(start, this.lastStringValue || null)
            this.numCapturingParens += 1
            return true
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-ExtendedAtom
    private eatExtendedAtom(): boolean {
        return (
            this.eatDot() ||
            this.eatReverseSolidusAtomEscape() ||
            this.eatCharacterClass() ||
            this.eatUncapturingGroup() ||
            this.eatCapturingGroup() ||
            this.eatInvalidBracedQuantifier() ||
            this.eatExtendedPatternCharacter()
        )
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-InvalidBracedQuantifier
    private eatInvalidBracedQuantifier(): boolean {
        if (this.eatBracedQuantifier(true)) {
            this.raise("Nothing to repeat")
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-SyntaxCharacter
    private eatSyntaxCharacter(): boolean {
        const code = this.curr
        if (isSyntaxCharacter(code)) {
            this.lastIntValue = code
            this.advance()
            return true
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-PatternCharacter
    private eatPatternCharacter(): boolean {
        const start = this._i
        const code = this.curr
        if (code !== -1 && !isSyntaxCharacter(code)) {
            this.advance()
            this.onCharacter(start, code)
            return true
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-ExtendedPatternCharacter
    private eatExtendedPatternCharacter(): boolean {
        const start = this._i
        const code = this.curr
        if (
            code !== -1 &&
            code !== CircumflexAccent &&
            code !== DollarSign &&
            code !== FullStop &&
            code !== Asterisk &&
            code !== PlusSign &&
            code !== QuestionMark &&
            code !== LeftParenthesis &&
            code !== RightParenthesis &&
            code !== LeftSquareBracket &&
            code !== VerticalLine
        ) {
            this.advance()
            this.onCharacter(start, code)
            return true
        }
        return false
    }

    // GroupSpecifier[U] ::
    //   [empty]
    //   `?` GroupName[?U]
    private groupSpecifier(): void {
        this.lastStringValue = ""
        if (this.eat1(QuestionMark)) {
            if (this.eatGroupName()) {
                if (!this.groupNames.has(this.lastStringValue)) {
                    this.groupNames.add(this.lastStringValue)
                    return
                }
                this.raise("Duplicate capture group name")
            }
            this.raise("Invalid group")
        }
    }

    // GroupName[U] ::
    //   `<` RegExpIdentifierName[?U] `>`
    private eatGroupName(): boolean {
        this.lastStringValue = ""
        if (this.eat1(LessThanSign)) {
            if (this.eatRegExpIdentifierName() && this.eat1(GreaterThanSign)) {
                return true
            }
            this.raise("Invalid capture group name")
        }
        return false
    }

    // RegExpIdentifierName[U] ::
    //   RegExpIdentifierStart[?U]
    //   RegExpIdentifierName[?U] RegExpIdentifierPart[?U]
    private eatRegExpIdentifierName(): boolean {
        this.lastStringValue = ""
        if (this.eatRegExpIdentifierStart()) {
            this.lastStringValue += String.fromCodePoint(this.lastIntValue)
            while (this.eatRegExpIdentifierPart()) {
                this.lastStringValue += String.fromCodePoint(this.lastIntValue)
            }
            return true
        }
        return false
    }

    // RegExpIdentifierStart[U] ::
    //   UnicodeIDStart
    //   `$`
    //   `_`
    //   `\` RegExpUnicodeEscapeSequence[?U]
    private eatRegExpIdentifierStart(): boolean {
        const start = this._i
        let code = this.curr
        this.advance()

        if (code === ReverseSolidus && this.eatRegExpUnicodeEscapeSequence()) {
            code = this.lastIntValue
        }
        if (isRegExpIdentifierStart(code)) {
            this.lastIntValue = code
            return true
        }

        if (this._i !== start) {
            this.rewind(start)
        }
        return false
    }

    // RegExpIdentifierPart[U] ::
    //   UnicodeIDContinue
    //   `$`
    //   `_`
    //   `\` RegExpUnicodeEscapeSequence[?U]
    //   <Zwnj>
    //   <Zwj>
    private eatRegExpIdentifierPart(): boolean {
        const start = this._i
        let code = this.curr
        this.advance()

        if (code === ReverseSolidus && this.eatRegExpUnicodeEscapeSequence()) {
            code = this.lastIntValue
        }
        if (isRegExpIdentifierPart(code)) {
            this.lastIntValue = code
            return true
        }

        if (this._i !== start) {
            this.rewind(start)
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-AtomEscape
    private eatAtomEscape(): boolean {
        if (
            this.eatBackreference() ||
            this.eatCharacterClassEscape() ||
            this.eatCharacterEscape() ||
            (this.nFlag && this.eatKGroupName())
        ) {
            return true
        }
        if (this.strict || this.uFlag) {
            this.raise("Invalid escape")
        }
        return false
    }

    private eatBackreference(): boolean {
        const start = this._i
        if (this.eatDecimalEscape()) {
            const n = this.lastIntValue
            if (this.strict || this.uFlag || n <= this.numCapturingParens) {
                if (n > this.maxBackreference) {
                    this.maxBackreference = n
                }
                this.onBackreference(start - 1, n)
                return true
            }
            this.rewind(start)
        }
        return false
    }

    private eatKGroupName(): boolean {
        const start = this._i
        if (this.eat1(LatinSmallLetterK)) {
            if (this.eatGroupName()) {
                const groupName = this.lastStringValue
                this.backreferenceNames.add(groupName)
                this.onBackreference(start - 1, groupName)
                return true
            }
            this.raise("Invalid named reference")
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-CharacterEscape
    private eatCharacterEscape(): boolean {
        const start = this._i
        if (
            this.eatControlEscape() ||
            this.eatCControlLetter() ||
            this.eatZero() ||
            this.eatHexEscapeSequence() ||
            this.eatRegExpUnicodeEscapeSequence() ||
            (!this.strict &&
                !this.uFlag &&
                this.eatLegacyOctalEscapeSequence()) ||
            this.eatIdentityEscape()
        ) {
            this.onCharacter(start - 1, this.lastIntValue)
            return true
        }
        return false
    }

    private eatCControlLetter(): boolean {
        const start = this._i
        if (this.eat1(LatinSmallLetterC)) {
            if (this.eatControlLetter()) {
                return true
            }
            this.rewind(start)
        }
        return false
    }

    private eatZero(): boolean {
        if (this.curr === DigitZero && !isDecimalDigit(this.next)) {
            this.lastIntValue = 0
            this.advance()
            return true
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-ControlEscape
    private eatControlEscape(): boolean {
        if (this.eat1(LatinSmallLetterT)) {
            this.lastIntValue = CharacterTabulation
            return true
        }
        if (this.eat1(LatinSmallLetterN)) {
            this.lastIntValue = LineFeed
            return true
        }
        if (this.eat1(LatinSmallLetterV)) {
            this.lastIntValue = LineTabulation
            return true
        }
        if (this.eat1(LatinSmallLetterF)) {
            this.lastIntValue = FormFeed
            return true
        }
        if (this.eat1(LatinSmallLetterR)) {
            this.lastIntValue = CarriageReturn
            return true
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-ControlLetter
    private eatControlLetter(): boolean {
        const code = this.curr
        if (isLatinLetter(code)) {
            this.advance()
            this.lastIntValue = code % 0x20
            return true
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-RegExpUnicodeEscapeSequence
    private eatRegExpUnicodeEscapeSequence(): boolean {
        const start = this._i

        if (this.eat1(LatinSmallLetterU)) {
            if (this.eatFixedHexDigits(4)) {
                const lead = this.lastIntValue
                if (this.uFlag && lead >= 0xd800 && lead <= 0xdbff) {
                    const leadSurrogateEnd = this._i
                    if (
                        this.eat1(ReverseSolidus) &&
                        this.eat1(LatinSmallLetterU) &&
                        this.eatFixedHexDigits(4)
                    ) {
                        const trail = this.lastIntValue
                        if (trail >= 0xdc00 && trail <= 0xdfff) {
                            this.lastIntValue =
                                (lead - 0xd800) * 0x400 +
                                (trail - 0xdc00) +
                                0x10000
                            return true
                        }
                    }
                    this.rewind(leadSurrogateEnd)
                    this.lastIntValue = lead
                }
                return true
            }
            if (
                this.uFlag &&
                this.eat1(LeftCurlyBracket) &&
                this.eatHexDigits() &&
                this.eat1(RightCurlyBracket) &&
                isValidUnicode(this.lastIntValue)
            ) {
                return true
            }
            if (this.strict || this.uFlag) {
                this.raise("Invalid unicode escape")
            }
            this.rewind(start)
        }

        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-IdentityEscape
    private eatIdentityEscape(): boolean {
        if (this.uFlag) {
            if (this.eatSyntaxCharacter()) {
                return true
            }
            if (this.eat1(Solidus)) {
                this.lastIntValue = Solidus
                return true
            }
            return false
        }

        if (this.isValidIdentityEscape(this.curr)) {
            this.advance()
            this.lastIntValue = this.curr
            return true
        }

        return false
    }
    private isValidIdentityEscape(code: number): boolean {
        if (this.strict) {
            return !isIdContinue(code)
        }
        return (
            code !== LatinSmallLetterC &&
            (!this.nFlag || code !== LatinSmallLetterK)
        )
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape
    private eatDecimalEscape(): boolean {
        this.lastIntValue = 0
        let code = this.curr
        if (code >= DigitOne && code <= DigitNine) {
            do {
                this.lastIntValue = 10 * this.lastIntValue + (code - DigitZero)
                this.advance()
            } while ((code = this.curr) >= DigitZero && code <= DigitNine)
            return true
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClassEscape
    private eatCharacterClassEscape(): boolean {
        const start = this._i

        if (this.eat1(LatinSmallLetterD)) {
            this.lastIntValue = -1
            this.onEscapeCharacterSet(start - 1, "digit", false)
            return true
        }
        if (this.eat1(LatinCapitalLetterD)) {
            this.lastIntValue = -1
            this.onEscapeCharacterSet(start - 1, "digit", true)
            return true
        }
        if (this.eat1(LatinSmallLetterS)) {
            this.lastIntValue = -1
            this.onEscapeCharacterSet(start - 1, "space", false)
            return true
        }
        if (this.eat1(LatinCapitalLetterS)) {
            this.lastIntValue = -1
            this.onEscapeCharacterSet(start - 1, "space", true)
            return true
        }
        if (this.eat1(LatinSmallLetterW)) {
            this.lastIntValue = -1
            this.onEscapeCharacterSet(start - 1, "word", false)
            return true
        }
        if (this.eat1(LatinCapitalLetterW)) {
            this.lastIntValue = -1
            this.onEscapeCharacterSet(start - 1, "word", true)
            return true
        }

        let negate = false
        if (
            this.uFlag &&
            this.ecmaVersion >= 9 &&
            (this.eat1(LatinSmallLetterP) ||
                (negate = this.eat1(LatinCapitalLetterP)))
        ) {
            this.lastIntValue = -1
            if (
                this.eat1(LeftCurlyBracket) &&
                this.eatUnicodePropertyValueExpression() &&
                this.eat1(RightCurlyBracket)
            ) {
                this.onUnicodePropertyCharacterSet(
                    start - 1,
                    "property",
                    this.lastKeyValue,
                    this.lastValValue || null,
                    negate,
                )
                return true
            }
            this.raise("Invalid property name")
        }

        return false
    }

    // UnicodePropertyValueExpression ::
    //   UnicodePropertyName `=` UnicodePropertyValue
    //   LoneUnicodePropertyNameOrValue
    private eatUnicodePropertyValueExpression(): boolean {
        const start = this._i

        // UnicodePropertyName `=` UnicodePropertyValue
        if (this.eatUnicodePropertyName() && this.eat1(EqualsSign)) {
            this.lastKeyValue = this.lastStringValue
            if (this.eatUnicodePropertyValue()) {
                this.lastValValue = this.lastStringValue
                if (
                    isValidUnicodePropertyNameAndValue(
                        this.lastKeyValue,
                        this.lastValValue,
                    )
                ) {
                    return true
                }
                this.raise("Invalid property name")
            }
        }
        this.rewind(start)

        // LoneUnicodePropertyNameOrValue
        if (this.eatLoneUnicodePropertyNameOrValue()) {
            const nameOrValue = this.lastStringValue
            if (
                isValidUnicodePropertyNameAndValue(
                    "General_Category",
                    nameOrValue,
                )
            ) {
                this.lastKeyValue = "General_Category"
                this.lastValValue = nameOrValue
                return true
            }
            if (isValidUnicodePropertyName(nameOrValue)) {
                this.lastKeyValue = nameOrValue
                this.lastValValue = ""
                return true
            }
            this.raise("Invalid property name")
        }
        return false
    }

    // UnicodePropertyName ::
    //   UnicodePropertyNameCharacters
    private eatUnicodePropertyName(): boolean {
        this.lastStringValue = ""
        while (isUnicodePropertyNameCharacter(this.curr)) {
            this.advance()
            this.lastStringValue += String.fromCodePoint(this.curr)
        }
        return this.lastStringValue !== ""
    }

    // UnicodePropertyValue ::
    //   UnicodePropertyValueCharacters
    private eatUnicodePropertyValue(): boolean {
        this.lastStringValue = ""
        while (isUnicodePropertyValueCharacter(this.curr)) {
            this.advance()
            this.lastStringValue += String.fromCodePoint(this.curr)
        }
        return this.lastStringValue !== ""
    }

    // LoneUnicodePropertyNameOrValue ::
    //   UnicodePropertyValueCharacters
    private eatLoneUnicodePropertyNameOrValue(): boolean {
        return this.eatUnicodePropertyValue()
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClass
    private eatCharacterClass(): boolean {
        const start = this._i
        if (this.eat1(LeftSquareBracket)) {
            const negate = this.eat1(CircumflexAccent)
            this.onCharacterClass(start, negate)
            return true
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassRanges
    // https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRanges
    // https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRangesNoDash
    private classRanges(): void {
        let start = this._i
        while (this.eatClassAtom()) {
            const left = this.lastIntValue
            const hyphenStart = this._i
            if (this.eat1(HyphenMinus)) {
                this.onCharacter(hyphenStart, HyphenMinus)

                if (this.eatClassAtom()) {
                    const right = this.lastIntValue

                    if (left === -1 || right === -1) {
                        if (this.strict || this.uFlag) {
                            this.raise("Invalid character class")
                        }
                    } else if (left > right) {
                        this.raise("Range out of order in character class")
                    } else {
                        this.onCharacterClassRange(start, left, right)
                    }
                }
            }

            start = this._i
        }
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtom
    // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtomNoDash
    private eatClassAtom(): boolean {
        const start = this._i

        if (this.eat1(ReverseSolidus)) {
            if (this.eatClassEscape()) {
                return true
            }
            if (this.uFlag) {
                this.raise("Invalid escape")
            }
            this.rewind(start)
        }

        const code = this.curr
        if (code !== RightSquareBracket) {
            this.advance()
            this.lastIntValue = code
            this.onCharacter(start, code)
            return true
        }

        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-ClassEscape
    private eatClassEscape(): boolean {
        const start = this._i

        if (this.eat1(LatinSmallLetterB)) {
            this.lastIntValue = Backspace
            this.onCharacter(start - 1, Backspace)
            return true
        }

        if (this.uFlag && this.eat1(HyphenMinus)) {
            this.lastIntValue = HyphenMinus
            this.onCharacter(start - 1, HyphenMinus)
            return true
        }

        if (!this.uFlag && this.eat1(LatinSmallLetterC)) {
            if (this.eatClassControlLetter()) {
                this.onCharacter(start - 1, this.lastIntValue)
                return true
            }
            this.rewind(start)
        }

        return this.eatCharacterClassEscape() || this.eatCharacterEscape()
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-ClassControlLetter
    private eatClassControlLetter(): boolean {
        const code = this.curr
        if (isDecimalDigit(code) || code === LowLine) {
            this.advance()
            this.lastIntValue = code % 0x20
            return true
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
    private eatHexEscapeSequence(): boolean {
        const start = this._i
        if (this.eat1(LatinSmallLetterX)) {
            if (this.eatFixedHexDigits(2)) {
                return true
            }
            if (this.uFlag) {
                this.raise("Invalid escape")
            }
            this.rewind(start)
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalDigits
    private eatDecimalDigits(): boolean {
        const start = this._i

        this.lastIntValue = 0
        while (isDecimalDigit(this.curr)) {
            this.lastIntValue = 10 * this.lastIntValue + digitToInt(this.curr)
            this.advance()
        }

        return this._i !== start
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigits
    private eatHexDigits(): boolean {
        const start = this._i
        this.lastIntValue = 0
        while (isHexDigit(this.curr)) {
            this.lastIntValue = 16 * this.lastIntValue + digitToInt(this.curr)
            this.advance()
        }
        return this._i !== start
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-strict-LegacyOctalEscapeSequence
    // Allows only 0-377(octal) i.e. 0-255(decimal).
    private eatLegacyOctalEscapeSequence(): boolean {
        if (this.eatOctalDigit()) {
            const n1 = this.lastIntValue
            if (this.eatOctalDigit()) {
                const n2 = this.lastIntValue
                if (n1 <= 3 && this.eatOctalDigit()) {
                    this.lastIntValue = n1 * 64 + n2 * 8 + this.lastIntValue
                } else {
                    this.lastIntValue = n1 * 8 + n2
                }
            } else {
                this.lastIntValue = n1
            }
            return true
        }
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-OctalDigit
    private eatOctalDigit(): boolean {
        const code = this.curr
        if (isOctalDigit(code)) {
            this.advance()
            this.lastIntValue = code - DigitZero
            return true
        }
        this.lastIntValue = 0
        return false
    }

    // https://www.ecma-international.org/ecma-262/8.0/#prod-Hex4Digits
    // https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigit
    // And HexDigit HexDigit in https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
    private eatFixedHexDigits(length: number): boolean {
        const start = this._i
        this.lastIntValue = 0
        for (let i = 0; i < length; ++i) {
            const code = this.curr
            if (!isHexDigit(code)) {
                this.rewind(start)
                return false
            }
            this.lastIntValue = 16 * this.lastIntValue + digitToInt(code)
            this.advance()
        }
        return true
    }
}

export namespace RegExpValidator {
    export interface Options {
        strict?: boolean
        ecmaVersion?: 2015 | 2016 | 2017 | 2018
    }
}
