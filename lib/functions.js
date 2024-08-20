// common shared functions

export function getNextValueFromArray(arr, value) {
    var index = arr.indexOf(value);
    if (index >= 0 && index < arr.length - 1)
        var nextItem = arr[index + 1];
    return nextItem;
}

export function removeAllMatchingItemsFromArray(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

export function getIndexThatIncludesFirstMatch(arr, value) {
    const index = arr.findIndex(
        function (str) {
            return str.includes(value);
        }
    );
    return index;
}

export function getIndexThatEqualsFirstMatch(arr, value) {
    const index = arr.findIndex(
        function (str) {
            return str == value;
        }
    );
    return index;
}