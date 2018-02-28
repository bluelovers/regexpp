import fs from "fs"
import path from "path"
import { parseRegExpLiteral } from "../../src/index"
import { stringify } from "../tools/safe-stringify"

const fixturesRoot = path.resolve(__dirname, "../fixtures/parser/test262")
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
            result.ast = JSON.parse(stringify(ast))
        } catch (err) {
            result.error = { message: err.message, index: err.index }
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(fixture, null, 2))
}
