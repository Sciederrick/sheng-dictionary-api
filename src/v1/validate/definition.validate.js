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
    pronunciation = validate.checkPronunciation(pronunciation);
    rarity =
        typeof rarity == "string" &&
        rarity.trim() != "" &&
        ["common", "rare", "unknown"].includes(rarity.trim())
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
    if (typeof docs != "object" || !(docs?.length > -1)) return false;
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

validate.validateDeleteDefinitions = (body) => {
    let { ids } = body;
    let validIds = [];
    for(const id of ids) {
        if (typeof id == "string" && id.trim() != "")
            validIds.push(id.trim())
    }
    return validIds;
};

validate.checkPronunciation = (pronunciation) => {
    if (typeof pronunciation === "object" && pronunciation !== null) {
        return Object.keys(pronunciation).includes("word") &&
            Object.keys(pronunciation).includes("audio")
            ? pronunciation
            : false;
    } else if (typeof pronunciation === null) {
        return null;
    } else {
        return false;
    }
};

validate.validateDateTime = (datetime) => {
  // Regular expression for basic ISO8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss[.sss][Z])
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[\+\-]\d{2}:\d{2})?)?$/;

  // Check if the string matches the basic format
  if (!iso8601Regex.test(datetime)) {
    console.log(`🚀 ~ iso8601Regex.test(datetime): ${datetime}`, iso8601Regex.test(datetime))
    
    return false;
  }

  // Additional check for valid date using Date object (handles leap years etc.)
  try {
    return new Date(datetime);
  } catch (error) {
    return false;
  }
};


module.exports = validate;
