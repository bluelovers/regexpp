class State {
    uid: number = 0
    refs: Map<number, object> = new Map()
}

function processReference(this: State, key: string, value: any): any {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return value
    }
    if (this.refs.has(value)) {
        return this.refs.get(value)
    }

    const id = ++this.uid
    this.refs.set(value, { "@ref": id })
    return Object.assign({ "@id": id }, value)
}

export function stringify(x: any): string {
    return JSON.stringify(x, processReference.bind(new State()))
}
