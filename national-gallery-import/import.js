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

wordFile.close();

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
    const recordsStream = createReadStream(filePath, { encoding: "utf-8" }).pipe(parse({
        delimiter: ","
    }));
    
    const [headers, records] = await firstAndRest(recordsStream);
    
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

const artObjects = await readCsv("../../../opendata/data/objects.csv", 
    fieldName => convertToCamelCaseHeuristic(wordSet, fieldName), 
    [ "provenanceText", "accessioned", "attributionInverted", "isVirtual", "lastDetectedModification", "locationId",
        "subclassification", "departmentAbbr", "accessionNum", "customPrintUrl", "portfolio", "volume", "watermarks",
        "series"])

const fieldNamesByInputFieldNames = {
    "mediaid": "mediaId",
    "relatedid": "relatedId",
    "relatedentity": "relatedEntity"
};

const mediaRelationShips = await readCsv("../../../opendata/data/media_relationships.csv", 
    fieldName => fieldNamesByInputFieldNames[fieldName], []);

const mediaItems = await readCsv("../../../opendata/data/media_items.csv", 
    fieldName => convertToCamelCaseHeuristic(wordSet, fieldName), []);

const publishedImages = await readCsv("../../../opendata/data/published_images.csv", 
    fieldName => convertToCamelCaseHeuristic(wordSet, fieldName), [])    

const artObjectsByIds = {};

for(const object of artObjects) {
    artObjectsByIds[object.objectId] = object;
}

const mediaItemsById = {};

for (const mediaItem of mediaItems) {
    mediaItemsById[mediaItem.mediaId] = mediaItem
}

for (const { mediaId,  relatedId } of mediaRelationShips) {

    if (relatedId in artObjectsByIds) {
        const artObject = artObjectsByIds[relatedId]
    
        if (!("mediaItems" in artObject)) {
            artObject.mediaItems = [];
        }
    
        artObject.mediaItems.push(mediaItemsById[mediaId]);
    }
}

for (const publishedImage of publishedImages) {
    const objectId = publishedImage.depictsTmSObjectId

    if (objectId in artObjectsByIds) {

        const artObject = artObjectsByIds[objectId];
        
        if (!("images" in artObject)) {
            artObject.images = [];
        }

        artObject.images.push(publishedImage);
    }
}

const artObjectsWithMediaItems = artObjects.filter(artObject => ("mediaItems" in artObject) && ("images" in artObject));

const objectsFile = await open("../data/objects.json", "w");
await objectsFile.write(JSON.stringify(artObjectsWithMediaItems, null, "\t"), null, "utf-8"); 
objectsFile.close();
