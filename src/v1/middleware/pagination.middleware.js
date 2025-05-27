// @ts-nocheck
const { validateDateTime } = require('../validate/definition.validate');
const helpers = require('./../util/helper.util');

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 500;
        let comparator = req.query.comparator;
        let createdAt = req.query.createdAt;
        let updatedAt = req.query.updatedAt;
		const search = req.query.search;
        
        const isEmptyComparatorCreatedAtUpdateAt = (comparator == null || comparator == undefined) && 
            (createdAt == null || createdAt == undefined) && 
            (updatedAt == null || updatedAt == undefined);

        const pattern = /gt|lt|eq/i;
        // input validation
        comparator = typeof comparator == 'string' && comparator.match(pattern) != null ? comparator.trim() : false;
        createdAt = validateDateTime(createdAt);
        updatedAt = validateDateTime(updatedAt);

        if (!isEmptyComparatorCreatedAtUpdateAt && !(comparator || createdAt || updatedAt)) return res.status(400).json({ message: "Invalid input", status: 400 });
        
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const results = { info: {} };
        results.info.limit = limit;
        let numResults = await model.countDocuments(); // all documents in the db
        if (endIndex < numResults) {
            results.info.next = page + 1;
        } else {
            results.info.next = null;
        }
        
        if (startIndex > 0) {
            results.info.previous = page - 1;
        } else {
            results.info.previous = null;
        }

        // prepare condition
        const condition = {};
        const field = createdAt ? "createdAt": "updatedAt";
        const fieldValue = createdAt || updatedAt;
        if (comparator && fieldValue) {            
            comparator = "$".concat(comparator);
            condition[field] = { [comparator]: fieldValue };
        }

		// add search support
		if (search && typeof search === "string" && search.trim().length > 0) {
			const searchRegex = new RegExp(search.trim(), "i");
			condition.$or = [
				{ title: searchRegex }
			]
		}

        try {
            if (Object.keys(condition).length > 0) {
                numResults = await model.find(condition, null, null).countDocuments();
                if (numResults === 0) {
                    results.info.next = null;
                    results.info.previous = null;
                }
            }
            results.info.count = numResults;
            results.info.pages = Math.ceil(numResults/limit);
            results.results = await model.find(condition, null, { limit: limit, skip: startIndex });

            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message, status: 500 });
        }
    }
}

module.exports = {
    paginatedResults
}