var cssKitCore = require('./css-kit-core');

function parseAndOrder( cssContent ){
    if( typeof cssContent === "string" ){
        var cssAST = cssKitCore.parseAsAST(cssContent);
        var cssRules = cssAST.stylesheet.rules.map(cssKitCore.astToRuleObject).sort(cssKitCore.compareSelectors);
        return cssRules;
    } else {
        return "";
    }
}

module.exports = {
    parseAndOrder : parseAndOrder
}