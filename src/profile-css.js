
var fs = require( 'fs' );
var path = require('path');
var readLine = require( 'readline' );

var utils = require('./utils');
var cssKit = require("./css-kit-core");
var cssProfiler = require("./css-profile");

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
    fs.readFile(targetFile,processData);
} else {
    console.log("Usage : analyze <target-css-file>");
}

function processData(err, data){
    if( err ){
        console.error( error );
        process.exit(-1);
    } else {
        cssProfiler.profile(data.toString());
    }
}