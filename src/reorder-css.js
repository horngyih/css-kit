
var fs = require( 'fs' );
var path = require('path');
var readLine = require( 'readline' );

var cssKit = require("./css-kit-core");

var utils = require('./utils');

var args = process.argv.slice(2);

var targetFile = null;
var options = [];

if( args.length === 1 ){
    targetFile = args[0];
} else if( args.length > 1 ){
    targetFile = path.resolve(args[args.length-1]);
    options = args.slice(0, args.length-1);
}

if( targetFile ){
    console.log( "/* Tokenizing : ", targetFile, " */" );
    fs.readFile(targetFile, function(err, data){
        var orderedCSSRules = cssKit.parseAndOrder(data.toString());
        console.log( orderedCSSRules.map(cssKit.stringifyRuleObject).filter(function(rule){return rule}).join("\n"));
    });
} else {
    console.log( "Usage : css-parser [options] <source-file>" );
}

function compareSelector( a, b ){
    // Element, ID, class
    var aCat = classify(a.selector);
    var bCat = classify(b.selector);
    if( aCat === bCat ){
        return compareString( a.selector.substring(1), b.selector.substring(1) );
    } else {
        return aCat - bCat;
    }
}

function compareString( a, b ){
    if( a > b ){
        return 1;
    } else if( a === b ){
        return 0;
    } else {
        return -1;
    }
}

function classify(a){
    if( /^#/.exec(a) ){
        return 1; //IDs second
    } else if( /^\./.exec(a) ) {
        return 2; //Class third
    } else {
        return 0; //Element first
    }
}

function stringifyRule(rule){
    if( rule ){
        var ruleString = '';
        ruleString += stringifySelector(rule.selector);
        ruleString += "{\n    ";
        ruleString += rule.declarations.sort().join( ";\n    " );
        ruleString += ";";
        ruleString += "\n";
        ruleString += "}\n";
        return ruleString;
    }
}

function stringifySelector(selector){
    if( selector ){
        var selectors = selector.split(",");
        return selectors.join( ",\n");
    }
}

function collateSelectors(map, rule){
    map = map || {};
    if( rule ){
        var ruleMap = mapSelectors(rule.selector, map);
        if(ruleMap){
            map = Object.assign(map,ruleMap);
        }
    }
    return map;
}

function mapSelectors(ruleSelector, map){
    var ruleMap = {};
    if( ruleSelector ){
        var tokens = ruleSelector.split(",")
        .map(function(token){return token.split(" ")})
        .reduce(utils.flatten,[])
        // .map(function(token){return token.split(":")[0]})
        .filter(function(token){return /\./.exec(token) || /#/.exec(token) })
        .map(function(token){return token.substring(token.indexOf("."))})
        .map(function(token){return token.substring(token.indexOf("#"))});
        ruleMap =  tokens.reduce(utils.countEntities,ruleMap);
    }
    return ruleMap;
}

function mapRule( rule ){
    if( rule.type === 'rule' ){
        return {
            selector : rule.selectors.join(","),
            declarations : rule.declarations.map( mapDeclarations ).filter(function(item){return item;})
        }
    }
}

function mapDeclarations( declaration ){
    if( declaration.type === 'declaration' ){
        return declaration.property + " : " + declaration.value;
    }
}