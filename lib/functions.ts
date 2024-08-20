// common shared functions

export function getNextValueFromArray<T>(arr: T[], value: T): T | undefined {
    const index = arr.indexOf(value);
    if (index >= 0 && index < arr.length - 1) {
        const nextItem = arr[index + 1];
        return nextItem;
    }
    return undefined;
}


export function removeAllMatchingItemsFromArray<T>(arr: T[], value: T): T[] {
    let i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

export function getIndexThatIncludesFirstMatch(arr: string[], value: string): number {
    const index: number = arr.findIndex(
        (str: string) => str.includes(value)
    );
    return index;
}


export function getIndexThatEqualsFirstMatch(arr: string[], value: string): number {
    const index: number = arr.findIndex(
        function (str: string) {
            return str == value;
        }
    );
    return index;
}