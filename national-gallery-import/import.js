import { createReadStream } from "fs";
import { open } from "node:fs/promises";
import { parse } from 'csv-parse';
import { splittings } from './splittings.js';

async function firstAndRest(iterable) {
    const iterator = iterable[Symbol.asyncIterator]()
    const { value: first } = await iterator.next();
    return [first, iterator];
}

const wordFile = await open("words_alpha.txt")
const wordSet = new Set()

for await (const line of wordFile.readLines()) {
    const trimmedLine = line.trim();
    wordSet.add(trimmedLine);
}

function capitalize(word) {
    if (word === "") {
        return word;
    }
    const [firstLetter, ...rest] = word;
    return firstLetter.toUpperCase() + rest.join("");
}

function convertToCamelCaseHeuristic(words, identifier) {
    const allSplittings = splittings(identifier);

    let bestSplitting = null;
    let bestWordCount = 0;

    for (const splitting of allSplittings) {
        const wordCount = splitting.filter(part => words.has(part)).length;
        if (splitting.every(part => words.has(part))) {
            if (bestSplitting === null || splitting.length < bestSplitting.length || bestSplitting.length !== bestWordCount) {
                bestSplitting = splitting
                bestWordCount = splitting.length
            }
        } else if (bestSplitting === null) {
            bestSplitting = splitting
            bestWordCount = wordCount
        } else if ((splitting.length - wordCount) < (bestSplitting.length - bestWordCount)) {
            bestSplitting = splitting;
            bestWordCount = wordCount
        }
    }

    const [firstWord, ...restWords] = bestSplitting
    const camelCaseIdentifier = firstWord + restWords.map(word => capitalize(word)).join("");

    return camelCaseIdentifier
}

async function readCsv(filePath, fieldNameConverter, fieldNamesToIgnore) {
    const recordsIterable = createReadStream(filePath).pipe(parse({
        delimiter: ","
    }));
    
    const [headers, records] = await firstAndRest(recordsIterable);
    
    for (const index in headers) {
        headers[index] = fieldNameConverter(headers[index]);
    }

    const objects = [];

    for await (const record of records) {
        const object = {};
    
        for (const index in record) {
            let value = record[index].trim();
    
            if (Number.isFinite(Number(value))) {
                value = Number(value)
            }
    
            object[headers[index]] = value;
        }
    
        for (const fieldName of fieldNamesToIgnore) {
            delete object[fieldName];
        }

        objects.push(object);
    }

    return objects;
}

const artObjects = readCsv("../../../opendata/data/objects.csv", 
    fieldName => convertToCamelCaseHeuristic(wordSet, fieldName), 
    [ "provenanceText", "accessioned", "attributionInverted", "isVirtual", "lastDetectedModification", "locationId",
        "subclassification", "departmentAbbr", "accessionNum", "customPrintUrl", "portfolio", "volume", "watermarks",
        "series"])

const objectsFile = await open("../data/objects.json", "w");

await objectsFile.write(JSON.stringify(artObjects, null, "\t")); 