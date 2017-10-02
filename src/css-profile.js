var utils = require( "./utils");
var cssKit = require('./css-kit-core');

function profile(cssContent){
    if( typeof cssContent === "string" ){
        cssContent =  cssKit.parseAndOrder(cssContent).filter(function(rule){return rule});
    }

    var selectors = cssContent
    .map(function(rule){return rule.selector})
    .map(function(selector){return selector.split(" ")})
    .reduce(utils.flatten)
    .map(function(selector){return selector.split(",")})
    .reduce(utils.flatten)
    .map(function(selector){return selector.substring(selector.indexOf("."))});;
    console.log( "Selectors : ", selectors );

    var ids = selectors.filter(function(selector){return /^#/.exec(selector)});
    var classes = selectors.filter(function(selector){return /^\./.exec(selector)});
    var others = selectors.filter(function(selector){ return !/^\./.exec(selector) && !/^#/.exec(selector)});
    
    console.log( "ID Count : ", ids.length );
    console.log( "Class Count : ", classes.length );
    console.log( "Other Count : ", others.length );
    console.log( "Total Selectors : ", selectors.length, "\n" );

    var idCount = ids.reduce(utils.countEntities,{});
    var uniqueIDs = Object.keys(idCount).sort();
    console.log( "Unique IDs : " );
    uniqueIDs.forEach(function(id){console.log("    ", id )});
    var idCheck = uniqueIDs.reduce(function(total,id){return total + (idCount[id]||0) },0);
    console.log( "Unique IDs : ", uniqueIDs.length, "( out of ", idCheck, "IDs )" );


    var classesCount = classes.reduce(utils.countEntities,{});
    var uniqueClasses = Object.keys(classesCount).sort();
    console.log( "Unique Classes : ");
    uniqueClasses.forEach(function(classname){console.log("    ", classname)});
    var classCheck = uniqueClasses.reduce(function(total,className){return total + (classesCount[className]||0)},0);
    console.log( "Unique Classes : ", uniqueClasses.length, "( out of ", classCheck, "classes )" );
}



module.exports = {
    profile : profile
}