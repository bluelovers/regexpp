import assert from "assert"
import fs from "fs"
import path from "path"
import { parseRegExpLiteral } from "../src/index"
import { cloneWithoutCircular } from "./tools/clone-without-circular"

describe("parseRegExpLiteral function", () => {
    const fixturesRoot = path.join(__dirname, "fixtures/parser/test262")
    for (const filename of fs.readdirSync(fixturesRoot)) {
        describe(filename, () => {
            const fixture = JSON.parse(
                fs.readFileSync(path.join(fixturesRoot, filename), "utf8"),
            )
            const options = fixture.options

            for (const source of Object.keys(fixture.patterns)) {
                const description = `${source} with ${JSON.stringify(options)}`
                const result = fixture.patterns[source]
                const verb = result.ast
                    ? "succeed to parse"
                    : "throw syntax error"

                it(`${description} should ${verb}.`, () => {
                    if (result.ast) {
                        const expected = result.ast
                        const actual = cloneWithoutCircular(
                            parseRegExpLiteral(source, options),
                        )
                        assert.deepStrictEqual(actual, expected)
                    } else {
                        const expected = result.error
                        try {
                            parseRegExpLiteral(source, options)
                        } catch (err) {
                            assert.strictEqual(err.message, expected.message)
                            assert.strictEqual(err.index, expected.index)
                            return
                        }
                        assert.fail("Should fail, but succeeded.")
                    }
                })
            }
        })
    }
})
