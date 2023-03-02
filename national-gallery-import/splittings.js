function splittingIndices(string) {
    const splittingIndices = [];
    for (let splitIndex = 1; splitIndex < string.length; splitIndex = splitIndex + 1) {
        splittingIndices.push(splitIndex);
    }

    return splittingIndices;
}

function substrings(string, indices) {
    if (indices.length === 0) {
        return [string]
    }

    const parts = []
    const allIndices = [0, ...indices, string.length]

    for (let splitIndexIndex = 0; splitIndexIndex < allIndices.length - 1; splitIndexIndex = splitIndexIndex + 1) {
        parts.push(string.substring(allIndices[splitIndexIndex], allIndices[splitIndexIndex + 1]))
    }

    return parts;
}

export function* splittings(string) {
    for (const splitting of powerSet(splittingIndices(string))) {
        yield substrings(string, splitting)
    }
}

function* powerSet(set) {
    const stack = [[[], set]];
    yield [];

    while (stack.length > 0) {
        const [subset, rest] = stack.pop();
        let newRest = [...rest]
        while (newRest.length > 0) {
            let element;
            [element, ...newRest] = newRest;
            const newSubset = [...subset, element]
            yield newSubset;
            stack.push([newSubset, newRest])
        }
    }
}
