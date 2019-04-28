export function arrayEquals(left: unknown[], right: unknown[]) {
    if (left.length !== right.length) {
        return false;
    }

    for (let i = 0; i < left.length; i ++) {
        if (left[i] !== right[i]) {
            return false;
        }
    }

    return true;
}