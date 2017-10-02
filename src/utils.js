function compareString( a, b ){
    if( a > b ){
        return 1;
    } else if( a === b ){
        return 0;
    } else {
        return -1;
    }
}

function flatten( result, target ){
    result = result || [];
    if( Array.isArray(target)){
        return target.reduce(flatten,result);
    } else {
        result.push(target);
        return result;
    }
}

function countEntities(map, token){
    map = map || {};
    if(token){
        var tokenCount = map[token] || 0;
        map[token] = ++tokenCount;
    }
    return map;
}

module.exports = {
    flatten : flatten,
    countEntities : countEntities,
    compareString : compareString
};