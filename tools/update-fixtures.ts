import fs from "fs"
import path from "path"
import { parseRegExpLiteral } from "../src/index"
import { cloneWithoutCircular } from "./clone-without-circular"

const fixturesRoot = path.resolve(__dirname, "../test/fixtures/parser/literal")
for (const filename of fs.readdirSync(fixturesRoot)) {
    const filePath = path.join(fixturesRoot, filename)
    const fixture = JSON.parse(fs.readFileSync(filePath, "utf8"))
    const options = fixture.options

    for (const pattern of Object.keys(fixture.patterns)) {
        const description = `${pattern} with ${JSON.stringify(options)}`
        const result = fixture.patterns[pattern]
        delete result.ast
        delete result.error

        try {
            const ast = parseRegExpLiteral(pattern, options)
            result.ast = cloneWithoutCircular(ast)
        } catch (err) {
            result.error = { message: err.message, index: err.index }
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(fixture, null, 2))
}
