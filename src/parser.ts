import {
    Disjunction,
    AlternativeElement,
    AnyCharacterSet,
    Assertion,
    Backreference,
    CapturingGroup,
    Character,
    CharacterClass,
    CharacterClassRange,
    EdgeAssertion,
    Element,
    EscapeCharacterSet,
    Group,
    LookaroundAssertion,
    Pattern,
    QuantifiableElement,
    Quantifier,
    UnicodePropertyCharacterSet,
    WordBoundaryAssertion,
} from "./ast"
import { assert, last } from "./util"
import { RegExpValidator } from "./validator"

type AppendableNode =
    | Pattern
    | Disjunction
    | Group
    | CapturingGroup
    | CharacterClass
    | LookaroundAssertion

const DUMMY = {} as CapturingGroup

/**
 * Create an empty Pattern node.
 */
function newEmptyPattern(): Pattern {
    return {
        type: "Pattern",
        parent: null,
        start: 0,
        end: 0,
        elements: [],
    }
}

/**
 * Convert given elements to an alternative.
 * This doesn't clone the array, so the return value is `elements` itself.
 * @param elements Elements to convert.
 */
function elementsToAlternative(
    elements: Element[],
    parent: Disjunction,
): AlternativeElement[] {
    for (const element of elements) {
        assert(element.type !== "Disjunction")
        element.parent = parent
    }
    return elements as AlternativeElement[]
}

function addAlternativeElement(
    parent:
        | Pattern
        | Disjunction
        | Group
        | CapturingGroup
        | LookaroundAssertion,
    node:
        | Group
        | CapturingGroup
        | Quantifier
        | CharacterClass
        | Assertion
        | AnyCharacterSet
        | Backreference,
): void {
    if (parent.type === "Disjunction") {
        last(parent.alternatives)!.push(node)
    } else {
        parent.elements.push(node)
    }
}

function addCommonElement(
    parent: AppendableNode,
    node: EscapeCharacterSet | UnicodePropertyCharacterSet | Character,
): void {
    if (parent.type === "Disjunction") {
        last(parent.alternatives)!.push(node)
    } else if (parent.type === "CharacterClass") {
        parent.elements.push(node)
    } else {
        parent.elements.push(node)
    }
}

export class RegExpParser extends RegExpValidator {
    private node: AppendableNode = newEmptyPattern()
    private backreferences: Backreference[] = []
    private capturingGroups: CapturingGroup[] = []

    parseLiteral(source: string): Pattern {
        this.validateLiteral(source)
        if (this.node.type !== "Pattern") {
            throw new Error("UnknownError")
        }
        return this.node
    }

    parsePattern(source: string, uFlag: boolean): Pattern {
        this.validatePattern(source, uFlag)
        if (this.node.type !== "Pattern") {
            throw new Error("UnknownError")
        }
        return this.node
    }

    //--------------------------------------------------------------------------
    // Hooks
    //--------------------------------------------------------------------------

    /**
     * Initialize the state of this parser.
     * It connects capturing groups and backreferences after parsing.
     */
    protected onPattern(): void {
        this.node = newEmptyPattern()
        this.backreferences.length = 0
        this.capturingGroups.length = 0

        super.onPattern()
        this.node.end = this.index

        // Resolve references.
        for (const reference of this.backreferences) {
            const ref = reference.ref
            const group =
                typeof ref === "number"
                    ? this.capturingGroups[ref]
                    : this.capturingGroups.find(g => g.name === ref)!
            reference.resolved = group
            group.references.push(reference)
        }
    }

    protected onAlternative(index: number): void {
        if (index === 0) {
            super.onAlternative(index)
            return
        }

        const parentNode = this.node
        if (
            parentNode.type === "Disjunction" ||
            parentNode.type === "CharacterClass"
        ) {
            throw new Error("UnknownError")
        }

        // Push
        const prevNode = last(parentNode.elements)
        if (prevNode != null && prevNode.type === "Disjunction") {
            this.node = prevNode
            prevNode.alternatives.push([])
        } else {
            this.node = {
                type: "Disjunction",
                parent: parentNode,
                start: parentNode.start,
                end: this.index,
                alternatives: [],
            }
            const elements = elementsToAlternative(
                parentNode.elements,
                this.node,
            )
            this.node.alternatives.push(elements, [])
            parentNode.elements = [this.node]
        }

        // Handle children
        super.onAlternative(index)

        // Pop
        this.node.end = this.index
        this.node = this.node.parent
    }

    protected onGroup(start: number): void {
        const parentNode = this.node
        if (parentNode.type === "CharacterClass") {
            throw new Error("UnknownError")
        }

        // Push
        this.node = {
            type: "Group",
            parent: parentNode,
            start,
            end: this.index,
            elements: [],
        }
        addAlternativeElement(parentNode, this.node)

        // Handle children
        super.onGroup(start)

        // Pop
        this.node.end = this.index
        this.node = parentNode
    }

    protected onCapturingGroup(start: number, name: string | null): void {
        const parentNode = this.node
        if (parentNode.type === "CharacterClass") {
            throw new Error("UnknownError")
        }

        // Push
        this.node = {
            type: "CapturingGroup",
            parent: parentNode,
            start,
            end: this.index,
            name,
            elements: [],
            references: [],
        }
        addAlternativeElement(parentNode, this.node)
        this.capturingGroups.push(this.node)

        // Handle children
        super.onCapturingGroup(start, name)

        // Pop
        this.node.end = this.index
        this.node = parentNode
    }

    protected onLookaroundAssertion(
        start: number,
        kind: "lookahead" | "lookbehind",
        negate: boolean,
    ): void {
        const parentNode = this.node
        if (parentNode.type === "CharacterClass") {
            throw new Error("UnknownError")
        }

        // Push
        this.node = {
            type: "Assertion",
            parent: parentNode,
            start,
            end: this.index,
            kind,
            negate,
            elements: [],
        } as LookaroundAssertion // TODO: why does `kind` mismatch?
        addAlternativeElement(parentNode, this.node)

        // Handle children
        super.onLookaroundAssertion(start, kind, negate)

        // Pop
        this.node.end = this.index
        this.node = parentNode
    }

    protected onQuantifier(
        start: number,
        min: number,
        max: number,
        greedy: boolean,
    ): void {
        const parentNode = this.node
        if (parentNode.type === "CharacterClass") {
            throw new Error("UnknownError")
        }

        // Replace the last element.
        const elements =
            parentNode.type === "Disjunction"
                ? last(parentNode.alternatives)!
                : parentNode.elements
        const prevNode = elements.pop()!
        const node: Quantifier = {
            type: "Quantifier",
            parent: parentNode,
            start,
            end: this.index,
            min,
            max,
            greedy,
            element: prevNode as QuantifiableElement,
        }
        elements.push(node)
        prevNode.parent = node

        super.onQuantifier(start, min, max, greedy)
    }

    protected onCharacterClass(start: number, negate: boolean): void {
        const parentNode = this.node
        if (parentNode.type === "CharacterClass") {
            throw new Error("UnknownError")
        }

        // Push
        this.node = {
            type: "CharacterClass",
            parent: parentNode,
            start,
            end: this.index,
            negate,
            elements: [],
        }
        addAlternativeElement(parentNode, this.node)

        // Handle children
        super.onCharacterClass(start, negate)

        // Pop
        this.node.end = this.index
        this.node = parentNode
    }

    protected onCharacterClassRange(
        start: number,
        min: number,
        max: number,
    ): void {
        const parentNode = this.node
        if (parentNode.type !== "CharacterClass") {
            throw new Error("UnknownError")
        }

        // Replace the last three elements.
        const elements = parentNode.elements
        const rightNode = elements.pop() as Character
        elements.pop() // hyphen
        const leftNode = elements.pop() as Character
        const node: CharacterClassRange = {
            type: "CharacterClassRange",
            parent: parentNode,
            start,
            end: this.index,
            min: leftNode,
            max: rightNode,
        }
        assert(leftNode != null && leftNode.type === "Character")
        assert(rightNode != null && rightNode.type === "Character")
        leftNode.parent = node
        rightNode.parent = node
        elements.push(node)

        super.onCharacterClassRange(start, min, max)
    }

    protected onEdgeAssertion(start: number, kind: "start" | "end"): void {
        const parentNode = this.node
        if (parentNode.type === "CharacterClass") {
            throw new Error("UnknownError")
        }

        // Add
        const node: EdgeAssertion = {
            type: "Assertion",
            parent: parentNode,
            start,
            end: this.index,
            kind,
        }
        addAlternativeElement(parentNode, node)

        super.onEdgeAssertion(start, kind)
    }

    protected onWordBoundaryAssertion(
        start: number,
        kind: "word",
        negate: boolean,
    ): void {
        const parentNode = this.node
        if (parentNode.type === "CharacterClass") {
            throw new Error("UnknownError")
        }

        // Add
        const node: WordBoundaryAssertion = {
            type: "Assertion",
            parent: parentNode,
            start,
            end: this.index,
            kind,
            negate,
        }
        addAlternativeElement(parentNode, node)

        super.onWordBoundaryAssertion(start, kind, negate)
    }

    protected onAnyCharacterSet(start: number, kind: "any"): void {
        const parentNode = this.node
        if (parentNode.type === "CharacterClass") {
            throw new Error("UnknownError")
        }

        // Add
        addAlternativeElement(parentNode, {
            type: "CharacterSet",
            parent: parentNode,
            start,
            end: this.index,
            kind,
        })

        super.onAnyCharacterSet(start, kind)
    }

    protected onEscapeCharacterSet(
        start: number,
        kind: "digit" | "space" | "word",
        negate: boolean,
    ): void {
        addCommonElement(this.node, {
            type: "CharacterSet",
            parent: this.node,
            start,
            end: this.index,
            kind,
            negate,
        })

        super.onEscapeCharacterSet(start, kind, negate)
    }

    protected onUnicodePropertyCharacterSet(
        start: number,
        kind: "property",
        key: string,
        value: string | null,
        negate: boolean,
    ): void {
        addCommonElement(this.node, {
            type: "CharacterSet",
            parent: this.node,
            start,
            end: this.index,
            kind,
            key,
            value,
            negate,
        })

        super.onUnicodePropertyCharacterSet(start, kind, key, value, negate)
    }

    protected onCharacter(start: number, value: number): void {
        addCommonElement(this.node, {
            type: "Character",
            parent: this.node,
            start,
            end: this.index,
            value,
        })

        super.onCharacter(start, value)
    }

    protected onBackreference(start: number, ref: number | string): void {
        const parentNode = this.node
        if (parentNode.type === "CharacterClass") {
            throw new Error("UnknownError")
        }

        // Add
        const node: Backreference = {
            type: "Backreference",
            parent: parentNode,
            start,
            end: this.index,
            ref,
            resolved: DUMMY,
        }
        addAlternativeElement(parentNode, node)
        this.backreferences.push(node)

        super.onBackreference(start, ref)
    }
}

export namespace RegExpParser {
    export type Options = RegExpValidator.Options
}
