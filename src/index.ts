import * as AST from "./ast"
import { RegExpParser } from "./parser"
import { RegExpValidator } from "./validator"

export { AST, RegExpParser, RegExpValidator }

export interface ParserOptions extends RegExpParser.Options {
    uFlag?: boolean
}

export interface ValidatorOptions extends RegExpValidator.Options {
    uFlag?: boolean
}

export function parseRegExpLiteral(
    source: string,
    options?: RegExpParser.Options,
) {
    return new RegExpParser(options).parseLiteral(source)
}

export function parseRegExpPattern(source: string, options?: ParserOptions) {
    const uFlag = Boolean(options && options.uFlag)
    return new RegExpParser(options).parsePattern(source, uFlag)
}

export function validateRegExpLiteral(
    source: string,
    options?: RegExpValidator.Options,
) {
    return new RegExpValidator(options).validateLiteral(source)
}

export function validateRegExpPattern(
    source: string,
    options?: ValidatorOptions,
) {
    const uFlag = Boolean(options && options.uFlag)
    return new RegExpValidator(options).validatePattern(source, uFlag)
}
