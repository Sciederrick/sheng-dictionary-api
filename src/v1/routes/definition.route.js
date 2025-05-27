const express = require("express");
const router = express.Router();

const { paginatedResults } = require("../middleware/pagination.middleware");
// const { authenticateApiKey } = require("../middleware/auth.middleware");

const Definition = require("./../../../mongo/models/definitions");

const {
  createDefinitions,
  getDefinitionById,
  getDefinitionByTitle,
  updateDefinition,
  deleteDefinition,
  deleteDefinitions,
} = require("./../../v1/controllers/definition.controller");

router
  .route("/")
  /**
   * @api {get} /definitions/ Get all definitions
   * @apiName GetDefinitions
   * @apiGroup Definitions
   * @apiPermission user
   *
   * @apiHeader {String} Authorization Developer's access token
   * @apiHeaderExample {json} Header-Example:
   * {
   *      "Authorization": Bearer Dfn.12345
   * }
   *
   * @apiQuery {Number} page=1 Page number.
   * @apiQuery {Number} limit=50 Page size.
   * @apiQuery {String} search=Biz Search term
   * @apiQuery {String} comparator=null Comparator for fetching definitions of a specified date range
   * @apiQuery {String} createdAt=null ISO 8601 DateTime String for fetching definitions of a specified range, definitions filtered according to `comparator` and `createdAt` queries
   * @apiQuery {String} updatedAt=null ISO 8601 DateTime String for fetching definitions of a specified range, definitions filtered according to `comparator` and `updatedAt` queries
   *
   * @apiSuccess {Object} info Information on paginated results (i.e., limit, next, previous, count, pages).
   * @apiSuccess {Number} info.limit=500 Page size
   * @apiSuccess {Number} info.next=null Identifier for subsequent page. Null if on the last page
   * @apiSuccess {Number} info.previous=null Identifier for previous page. Null if on the first page
   * @apiSuccess {Number} info.count=0 Total results found
   * @apiSuccess {Number} info.pages=0 Total number of pages
   *
   * @apiSuccess {Object[]} results List of definitions
   * @apiSuccess {String} results._id Unique Identifier
   * @apiSuccess {String} results.title Title of the definition (word or idiom)
   * @apiSuccess {String} results.definition Definition
   * @apiSuccess {String} results.category Category of the definition (word or idiom)
   * @apiSuccess {String} results.exampleUsage=null Example usage of a word or idiom
   * @apiSuccess {String} results.partOfSpeech=null Part of speech of a word definition (i.e., noun, verb, adjective, adverb). Null of its an idiom
   * @apiSuccess {String} results.rarity Rarity of the definition (i.e., common or rare)
   * @apiSuccess {String[]} results.spellingVariations=[] Spelling variations of the definition. Null if its an idiom
   * @apiSuccess {String[]} results.synonyms=[] Synonyms
   * @apiSuccess {Object} results.pronunciation Word and Audio of the pronunciation if any
   * @apiSuccess {String} results.pronunciation.word=null Word pronunciation
   * @apiSuccess {String} results.pronunciation.audio=null URL to the pronunciation audio clip
   * @apiSuccess {String} results.createdAt DateTime ISO 8601 String for database definition creation time
   * @apiSuccess {String} results.updatedAt DateTime ISO 8601 String for database definition update time
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *      "info": {
   *           "limit": 1,
   *           "next": 2,
   *           "previous": null,
   *           "count": 7,
   *           "pages": 7
   *      },
   *      "results": [
   *           {
   *                "_id": "63ee2b80f2c91c3089905cfb",
   *                "title": "M-Chwa / M-Sape",
   *                "definition": "M-pesa - A mobile money solution available in Kenya",
   *                "category": "word",
   *                "exampleUsage": "Nitumie ile doh kwa Msape - Send me the money you owe through Mpesa",
   *                "partOfSpeech": "noun",
   *                "pronunciation": {
   *                  "audio": "kiungo/hadi/sauti.mp3",
   *                  "word": "sa-u-ti"
   *                },
   *                "rarity": "common",
   *                "spellingVariations": [],
   *                "synonyms": [],
   *                "createdAt": "2023-02-16T13:11:28.568Z",
   *                "updatedAt": "2023-02-16T13:11:28.568Z",
   *                "__v": 0     *
   *           }
   *      ]
   * }
   *
   * @apiError Unauthorized-401 Invalid api key
   */
  .get(/*authenticateApiKey,*/ paginatedResults(Definition), (_, res, __) => {
    return res.json(res.paginatedResults);
  });

router
    .route("/")
    /**
     * @api {post} /definitions/ Create Definition
     * @apiName CreateDefinitions
     * @apiGroup Definitions
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Admin's access token
     * @apiHeaderExample {json} Header-Example:
     * {
     *      "Authorization": Bearer Adm.12345
     * }
     *
     * @apiBody {Object[]} definition List of definitions
     * @apiBody {String} definition.title Mandatory title
     * @apiBody {String} definition.definition Mandatory definition
     * @apiBody {String} definition.category Mandatory category (word or idiom),
     * @apiBody {String} definition.partOfSpeech Mandatory part of speech (noun, verb etc),
     * @apiBody {Object} definition.[pronunciation] Word and Audio of the pronunciation if any
     * @apiBody {String} definition.pronunciation.word=null Word pronunciation
     * @apiBody {String} definition.pronunciation.audio=null URL to the pronunciation audio clip
     * @apiBody {String} definition.exampleUsage Mandatory example usage,
     * @apiBody {String} definition.rarity Mandatory rarity (common, rare or unknown),
     * @apiBody {String[]} definition.[spellingVariations] Optional spelling variations
     * @apiBody {String[]} definition.[synonyms] Synonyms
     *
     * @apiSuccess {Object[]} definition List of definitions
     * @apiSuccess {String} definition.title Mandatory title
     * @apiSuccess {String} definition.definition Mandatory definition
     * @apiSuccess {String} definition.category Mandatory category (word or idiom),
     * @apiSuccess {String} definition.partOfSpeech Mandatory part of speech (noun, verb etc),
     * @apiSuccess {Object} definition.pronunciation Word and Audio of the pronunciation if any
     * @apiSuccess {String} definition.pronunciation.word=null Word pronunciation
     * @apiSuccess {String} definition.pronunciation.audio=null URL to the pronunciation audio clip
     * @apiSuccess {String} definition.exampleUsage Mandatory example usage,
     * @apiSuccess {String} definition.rarity Mandatory rarity (common, rare or unknown),
     * @apiSuccess {String[]} definition.spellingVariations=[] Optional spelling variations
     * @apiSuccess {String[]} definition.synonyms=[] Synonyms
     */
    .post(/*authenticateApiKey,*/ createDefinitions);

router
    .route("/:title")
    /**
     * @api {get} /definitions/:title Get definition by title
     * @apiName GetDefinitionByTitle
     * @apiGroup Definitions
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Admin's access token
     * @apiHeaderExample {json} Header-Example:
     * {
     *      "Authorization": Bearer Adm.12345
     * }
     *
     * @apiParam {String} title Mandatory title
     *
     * @apiSuccess {String} title Mandatory title
     * @apiSuccess {String} definition Mandatory definition
     * @apiSuccess {String} category Mandatory category (word or idiom),
     * @apiSuccess {String} partOfSpeech Mandatory part of speech (noun, verb etc),
     * @apiSuccess {Object} pronunciation Word and Audio of the pronunciation if any
     * @apiSuccess {String} pronunciation.word=null Word pronunciation
     * @apiSuccess {String} pronunciation.audio=null URL to the pronunciation audio clip
     * @apiSuccess {String} exampleUsage Mandatory example usage,
     * @apiSuccess {String} rarity Mandatory rarity (common, rare or unknown),
     * @apiSuccess {String[]} spellingVariations=[] Optional spelling variations
     * @apiSuccess {String[]} synonyms=[] Synonyms
     */
    .get(/*authenticateApiKey,*/ getDefinitionByTitle);

router
    .route("/:id")
    /**
     * @api {get} /definitions/:id Get definition by id
     * @apiName GetDefinitionById
     * @apiGroup Definitions
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Admin's access token
     * @apiHeaderExample {json} Header-Example:
     * {
     *      "Authorization": Bearer Adm.12345
     * }
     *
     * @apiParam {String} id Mandatory id
     *
     * @apiSuccess {String} title Mandatory title
     * @apiSuccess {String} definition Mandatory definition
     * @apiSuccess {String} category Mandatory category (word or idiom),
     * @apiSuccess {String} partOfSpeech Mandatory part of speech (noun, verb etc),
     * @apiSuccess {Object} pronunciation Word and Audio of the pronunciation if any
     * @apiSuccess {String} pronunciation.word=null Word pronunciation
     * @apiSuccess {String} pronunciation.audio=null URL to the pronunciation audio clip
     * @apiSuccess {String} exampleUsage Mandatory example usage,
     * @apiSuccess {String} rarity Mandatory rarity (common, rare or unknown),
     * @apiSuccess {String[]} spellingVariations Optional spelling variations
     * @apiSuccess {String[]} synonyms=[] Synonyms
     */
    .get(/*authenticateApiKey,*/ getDefinitionById);

router
    .route("/")
    /**
     * @api {put} /definitions/ Update definition
     * @apiName UpdateDefinition
     * @apiGroup Definitions
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Admin's access token
     * @apiHeaderExample {json} Header-Example:
     * {
     *      "Authorization": Bearer Adm.12345
     * }
     *
     * @apiBody {String} title Mandatory title
     * @apiBody {String} definition Mandatory definition
     * @apiBody {String} category Mandatory category (word or idiom),
     * @apiBody {String} partOfSpeech Mandatory part of speech (noun, verb etc),
     * @apiBody {Object} [pronunciation] Word and Audio of the pronunciation if any
     * @apiBody {String} pronunciation.word=null Word pronunciation
     * @apiBody {String} pronunciation.audio=null URL to the pronunciation audio clip
     * @apiBody {String} exampleUsage Mandatory example usage,
     * @apiBody {String} rarity Mandatory rarity (common, rare, unknown),
     * @apiBody {String[]} [spellingVariations=[]] Optional spelling variations
     * @apiBody {String[]} [synonyms=[]] Synonyms
     *
     */
    .put(/*authenticateApiKey,*/ updateDefinition);

router
  .route("/:id")
  /**
   * @api {delete} /definitions/:id Delete definition
   * @apiName DeleteDefinition
   * @apiGroup Definitions
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization Admin's access token
   * @apiHeaderExample {json} Header-Example:
   * {
   *      "Authorization": Bearer Adm.12345
   * }
   *
   * @apiParam {String} id Mandatory definition id
   */
  .delete(/*authenticateApiKey,*/ deleteDefinition);

router
    .route("/bulk/delete")
    /**
     * @api {delete} /definitions/bulk/delete Delete definitions
     * @apiName DeleteDefinitions
     * @apiGroup Definitions
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Admin's access token
     * @apiHeaderExample {json} Header-Example:
     * {
     *      "Authorization": Bearer Adm.12345
     * }
     *
     * @apiBody {String[]} ids Mandatory ids
     */
    .post(/*authenticateApiKey,*/ deleteDefinitions);

module.exports = router;
