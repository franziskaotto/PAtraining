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

const recordsIterable = createReadStream("../../../opendata/data/objects.csv").pipe(parse({
    delimiter: ","
}));

const [headers, records] = await firstAndRest(recordsIterable);

for (const index in headers) {
    headers[index] = convertToCamelCaseHeuristic(wordSet, headers[index]);
}

const artObjects = [];

for await (const record of records) {
    const artObject = {};

    for (const index in record) {
        let value = record[index].trim();

        if (Number.isFinite(Number(value))) {
            value = Number(value)
        }

        artObject[headers[index]] = value;
    }

    delete artObject.provenanceText;
    delete artObject.accessioned;
    delete artObject.attributionInverted;
    delete artObject.isVirtual;
    delete artObject.lastDetectedModification;
    delete artObject.locationId;
    delete artObject.subclassification;
    delete artObject.departmentAbbr;
    delete artObject.accessionNum;
    delete artObject.customPrintUrl;
    delete artObject.portfolio;
    delete artObject.volume;
    delete artObject.watermarks;
    delete artObject.series;
    artObjects.push(artObject);
}

const objectsFile = await open("../data/objects.json", "w");

await objectsFile.write(JSON.stringify(artObjects, null, "\t"));