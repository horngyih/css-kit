function tokenize( lines ){
    if( Array.isArray(lines) ){
        return lines.reduce( tokenizeLine, [] );
    } else{
        return [];
    }
}

function tokenizeLine(prev, line){
    prev = prev || [];

    if( line ){
        line = line.trim();
        line = line.replace(/^\/\*/g, "/* " );
        line = line.replace( /\*\/$/g, " */" );
        line = line.replace(/{/, " { " );
        line = line.replace( /}/, " } " );
        line = line.replace( /;/, " ; " );
        line = line.replace( /:/, " : " );
        var lineTokens = line.split( " " );
        if( lineTokens ){
            prev = prev.concat( lineTokens.map( mapToEntities ) );
        }
    }

    return prev;
}

function mapToEntities(token){
    if( token ){
        switch( token ){
            case '{':
                return '@@BLOCK_START@@';
            case '}':
                return '@@BLOCK_END@@';
            case '::' :
                return '@@DOUBLE_COLON@@';
            case ':' :
                return '@@COLON@@';
            case ';' :
                return '@@SEMICOLON@@';
            case '//' :
                return '@@SINGLE_COMMENT@@';
            case '/*' :
                return '@@COMMENT_START@@';
            case '*/' :
                return '@@COMMENT_END@@';
            default:
                return token;
        }
    } else {
        return null;
    }
}

module.exports = tokenize;