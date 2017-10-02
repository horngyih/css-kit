var cssParser = require("css");
var utils = require('./utils');

function parseAndOrder( cssContent ){
    if( typeof cssContent === "string" ){
        var cssAST = parseAsAST(cssContent);
        var cssRules = cssAST.stylesheet.rules.map(astToRuleObject).sort(compareSelectors);
        return cssRules;
    } else {
        return [];
    }
}

function parseAsAST( cssContent ){
    if( cssContent ){
        return cssParser.parse(cssContent);
    } else {
        return [];
    }
}

function astToRuleObject( rule ){
    if( rule && rule.type === 'rule' ){
        return {
            selector : rule.selectors.join(","),
            declarations : rule.declarations.map( mapDeclarations ).filter(function(item){return item;})
        }
    }
}

function stringifyRuleObject(rule){
    if( rule ){
        var ruleString = '';
        ruleString += stringifySelector(rule.selector)||'@no-selector';
        ruleString += "{\n    ";
        ruleString += (rule.declarations||[]).sort().join( ";\n    " );
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

function classifySelector( selector ){
    if( /^#/.exec(selector) ){
        return 1; //IDs second
    } else if( /^\./.exec(selector) ) {
        return 2; //Class third
    } else {
        return 0; //Element first
    }
}

function compareSelectors( a, b ){
    // Element, ID, class
    var aCat = classifySelector(a.selector);
    var bCat = classifySelector(b.selector);
    if( aCat === bCat ){
        return utils.compareString( a.selector.substring(1), b.selector.substring(1) );
    } else {
        return aCat - bCat;
    }
}

function mapDeclarations( declaration ){
    if( declaration.type === 'declaration' ){
        return declaration.property + " : " + declaration.value;
    }
}

module.exports = {
    parseAndOrder : parseAndOrder,
    parseAsAST : parseAsAST,
    astToRuleObject : astToRuleObject,
    stringifyRuleObject : stringifyRuleObject,
    classifySelector : classifySelector,
    compareSelectors : compareSelectors
};