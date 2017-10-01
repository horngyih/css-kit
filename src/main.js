var fs = require( 'fs' );
var path = require('path');
var readLine = require( 'readline' );

var css = require('css');
var cssTokenizer = require('./css-tokenizer');

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
        var ast = css.parse( data.toString() );
        console.log( "/* Source Rules : ", ast.stylesheet.rules.length, " */" );
        var mappedRules = ast.stylesheet.rules.map(mapRule).sort(compareSelector);
        console.log( "/* Mapped Rules : ", mappedRules.length, " */" );
        var stringifiedRules = mappedRules.map(stringifyRule);
        console.log( "/* Output Rules : ", stringifiedRules.length, " */\n" );        
        stringifiedRules.forEach(function(rule){ console.log(rule)});
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
        ruleString += "{\n";
        ruleString += rule.declarations.join( ";\n" );
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