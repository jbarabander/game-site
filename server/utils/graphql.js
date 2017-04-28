function addToContext(results, context, info) {
  function recursiveAddToContext(path, resultsToAdd) {
    let objToUse;
    if (path.prev) {
      const prevObj = recursiveAddToContext(path.prev);
      objToUse = prevObj;
    } else {
      objToUse = context;
    }
    if (!objToUse[path.key]) {
      if (resultsToAdd) {
        objToUse[path.key] = resultsToAdd;
      } else {
        objToUse[path.key] = {};
      }
    }
    return objToUse[path.key];
  }
  return recursiveAddToContext(info.path, results);
}

function generateMongoHash(results) {
  if (!Array.isArray(results)) {
    return {};
  }
  return results.reduce((prev, curr) => {
    if (curr._id) {
      prev[curr._id.toString()] = curr;
    }
    return prev;
  }, {});
}

module.exports = {
  addToContext,
  generateMongoHash,
};