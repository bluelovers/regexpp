export class RegExpSyntaxError extends SyntaxError {
    public index: number
    constructor(source: string, index: number, message: string) {
        if (source[0] !== "/") {
            //eslint-disable-next-line no-param-reassign
            source = `/${source}/`
        }
        super(`Invalid regular expression: ${source}: ${message}`)
        this.index = index
    }
}
