export { isIdContinue, isIdStart } from "./ids";
export { PropertyData } from "./property-data";
export declare const Null = 0;
export declare const Backspace = 8;
export declare const CharacterTabulation = 9;
export declare const LineFeed = 10;
export declare const LineTabulation = 11;
export declare const FormFeed = 12;
export declare const CarriageReturn = 13;
export declare const ExclamationMark = 33;
export declare const DollarSign = 36;
export declare const LeftParenthesis = 40;
export declare const RightParenthesis = 41;
export declare const Asterisk = 42;
export declare const PlusSign = 43;
export declare const Comma = 44;
export declare const HyphenMinus = 45;
export declare const FullStop = 46;
export declare const Solidus = 47;
export declare const DigitZero = 48;
export declare const DigitOne = 49;
export declare const DigitSeven = 55;
export declare const DigitNine = 57;
export declare const Colon = 58;
export declare const LessThanSign = 60;
export declare const EqualsSign = 61;
export declare const GreaterThanSign = 62;
export declare const QuestionMark = 63;
export declare const LatinCapitalLetterA = 65;
export declare const LatinCapitalLetterB = 66;
export declare const LatinCapitalLetterD = 68;
export declare const LatinCapitalLetterF = 70;
export declare const LatinCapitalLetterP = 80;
export declare const LatinCapitalLetterS = 83;
export declare const LatinCapitalLetterW = 87;
export declare const LatinCapitalLetterZ = 90;
export declare const LowLine = 95;
export declare const LatinSmallLetterA = 97;
export declare const LatinSmallLetterB = 98;
export declare const LatinSmallLetterC = 99;
export declare const LatinSmallLetterD = 100;
export declare const LatinSmallLetterF = 102;
export declare const LatinSmallLetterG = 103;
export declare const LatinSmallLetterI = 105;
export declare const LatinSmallLetterK = 107;
export declare const LatinSmallLetterM = 109;
export declare const LatinSmallLetterN = 110;
export declare const LatinSmallLetterP = 112;
export declare const LatinSmallLetterR = 114;
export declare const LatinSmallLetterS = 115;
export declare const LatinSmallLetterT = 116;
export declare const LatinSmallLetterU = 117;
export declare const LatinSmallLetterV = 118;
export declare const LatinSmallLetterW = 119;
export declare const LatinSmallLetterX = 120;
export declare const LatinSmallLetterY = 121;
export declare const LatinSmallLetterZ = 122;
export declare const LeftSquareBracket = 91;
export declare const ReverseSolidus = 92;
export declare const RightSquareBracket = 93;
export declare const CircumflexAccent = 94;
export declare const LeftCurlyBracket = 123;
export declare const VerticalLine = 124;
export declare const RightCurlyBracket = 125;
export declare const ZeroWidthNonJoiner = 8204;
export declare const ZeroWidthJoiner = 8205;
export declare const LineSeparator = 8232;
export declare const ParagraphSeparator = 8233;
export declare const MinCodePoint = 0;
export declare const MaxCodePoint = 1114111;
export declare function isLatinLetter(code: number): boolean;
export declare function isDecimalDigit(code: number): boolean;
export declare function isOctalDigit(code: number): boolean;
export declare function isHexDigit(code: number): boolean;
export declare function isLineTerminator(code: number): boolean;
export declare function isValidUnicode(code: number): boolean;
export declare function digitToInt(code: number): number;
