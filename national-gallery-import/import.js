import { createReadStream } from "fs";
import { open } from "node:fs/promises";
import { parse } from 'csv-parse';

async function firstAndRest(iterable) {
    const iterator = iterable[Symbol.asyncIterator]()
    const { value: first } = await iterator.next();
    return [first, iterator];
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

const fieldNamesByInputFieldNames = {
    "objectid": "objectId",
    "mediaid": "mediaId",
    "displaydate": "displayDate",
    "beginyear": "beginYear",
    "visualbrowsertimespan": "visualBrowserTimeSpan",
    "creditLine": "creditLine",
    "visualbrowserclassification": "visualBrowserClassification",
    "parentid": "parentId",
    "wikidataid": "wikiDataId",
    "relatedid": "relatedId",
    "relatedentity": "relatedEntity",
    "mediatype": "mediaType",
    "language": "language",
    "thumbnailurl": "thumbnailUrl",
    "playurl": "playUrl",
    "downloadurl": "downloadUrl",
    "imageurl": "imageUrl",
    "presentationurl": "presentationUrl",
    "releasedate": "releaseDate",
    "presentationDate": "presentationDate",
    "lastmodified": "lastModified",
    "viewtype": "viewType",
    "maxPixels": "maxPixels",
    "depictstmsobjectid": "depictsObjectId",
    "assistivetext": "assistiveText"
};

const artObjects = await readCsv("../../../opendata/data/objects.csv", 
    fieldName => fieldNamesByInputFieldNames[fieldName] ?? fieldName, 
    [ "provenancetext", "accessioned", "attributioninverted", "isvirtual", "lastdetectedmodification", "locationid",
        "subclassification", "departmentabbr", "accessionnum", "customprinturl", "portfolio", "volume", "watermarks",
        "series"])

const mediaRelationShips = await readCsv("../../../opendata/data/media_relationships.csv", 
    fieldName => fieldNamesByInputFieldNames[fieldName] ?? fieldName, []);


const mediaItems = await readCsv("../../../opendata/data/media_items.csv", 
    fieldName => fieldNamesByInputFieldNames[fieldName] ?? fieldName, []);

const publishedImages = await readCsv("../../../opendata/data/published_images.csv", 
    fieldName => fieldNamesByInputFieldNames[fieldName] ?? fieldName, [])    

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
    const objectId = publishedImage.depictsObjectId

    if (objectId in artObjectsByIds) {

        const artObject = artObjectsByIds[objectId];
        
        if (!("images" in artObject)) {
            artObject.images = [];
        }

        artObject.images.push(publishedImage);
    }
}

const artObjectsWithMediaItems = artObjects.filter(artObject => ("images" in artObject) && ("mediaItems" in artObject));
console.log(`${artObjectsWithMediaItems.length} art objects imported.`)

const objectsFile = await open("../artObjects.js", "w");
await objectsFile.write(`export const artObjects = ${JSON.stringify(artObjectsWithMediaItems, null, "\t")}`, null, "utf-8"); 
objectsFile.close();
