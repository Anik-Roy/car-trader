export function getAsString(value: string|string[]|undefined): string | undefined {
    if(Array.isArray(value)) {
        return value[0];
    }

    if(value) {
        return value;
    } else {
        return undefined;
    }
}