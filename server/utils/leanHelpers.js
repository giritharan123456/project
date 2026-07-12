const MAP_FIELDS = ['competitors', 'demandScores', 'marketGapScores', 'searchTrends'];

/**
 * Safely convert a Map or plain object to a plain object.
 * Handles: Map instances, plain objects, null/undefined.
 */
function safeToObj(val) {
  if (!val) return {};
  if (val instanceof Map) return Object.fromEntries(val);
  if (typeof val === 'object') return val;
  return {};
}

/**
 * Convert Map fields to plain objects after .lean() queries.
 * In Mongoose 9, .lean() returns Map instances that serialize as {} via JSON.stringify.
 * This helper converts them to plain objects for proper serialization.
 */
function convertMapFields(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const result = { ...doc };
  for (const field of MAP_FIELDS) {
    if (result[field] instanceof Map) {
      result[field] = Object.fromEntries(result[field]);
    }
  }
  return result;
}

/**
 * Convert an array of lean documents.
 */
function convertMapFieldsArray(docs) {
  if (!Array.isArray(docs)) return docs;
  return docs.map(convertMapFields);
}

module.exports = { convertMapFields, convertMapFieldsArray, safeToObj };
