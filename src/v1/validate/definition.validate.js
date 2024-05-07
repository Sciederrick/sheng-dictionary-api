const validate = {};

validate.validateCreate = (doc) => {
    if (Object.keys(doc).length != 7) return false;
    let {
        title,
        definition,
        category,
        exampleUsage,
        partOfSpeech,
        rarity = "unknown",
        spellingVariations = [],
        synonyms = [],
        pronunciation = { word: null, audio: null },
    } = doc;
    title =
        typeof title == "string" && title.trim() != "" ? title.trim() : false;
    definition =
        typeof definition == "string" && definition.trim() != ""
            ? definition.trim()
            : false;
    category =
        typeof category == "string" && category.trim() != ""
            ? category.trim()
            : false;
    exampleUsage =
        typeof exampleUsage == "string" && exampleUsage.trim() != ""
            ? exampleUsage.trim()
            : false;
    partOfSpeech =
        typeof partOfSpeech == "string" && partOfSpeech.trim() != ""
            ? partOfSpeech.trim()
            : false;
    pronunciation =
        typeof pronunciation === "object" &&
        Object.keys(pronunciation).includes("word") &&
        Object.keys(pronunciation).includes("audio")
            ? pronunciation
            : false;
    rarity =
        typeof rarity == "string" && rarity.trim() != "" && ["common", "rare", "unknown"].includes(rarity.trim())
            ? rarity.trim()
            : false;
    spellingVariations =
        typeof spellingVariations == "object" && spellingVariations?.length > -1
            ? spellingVariations
            : false;
    synonyms =
        typeof synonyms == "object" && synonyms?.length > -1 ? synonyms : false;

    if (
        !(
            title &&
            definition &&
            category &&
            exampleUsage &&
            partOfSpeech &&
            rarity &&
            spellingVariations != false &&
            pronunciation != false &&
            synonyms != false
        )
    ) {
        return false;
    }
    return true;
};

validate.validateInsertMany = (docs) => {
    if (typeof(docs) != 'object' || !(docs?.length > -1)) return false;
    docs.forEach((doc) => {
        if (!validate.validateCreate(doc)) {
            return false;
        }
    });
    return true;
};

validate.validateGetByTitle = (params) => {
    let { title } = params;
    title =
        typeof title == "string" && title.trim() != "" ? title.trim() : false;
    if (!title) return false;
    return true;
};

validate.validateGetById = (params) => {
    let { id } = params;
    id = typeof id == "string" && id.trim() != "" ? id.trim() : false;
    if (!id) return false;
    return true;
};

module.exports = validate;
