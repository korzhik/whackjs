


// COMPILATION FLAGS
// ------------------------------------------------------------------------------------------------

// Debug information
// error detection
// formatted template sources etc.
/** @define {boolean} */	var DEBUG = true;

// Global variable name
/** @define {string} */		var ZIPPR_NAME = "Zippr";

// 
/** @define {boolean} */	var AUTOCOMPILE = true;

// 
/** @define {boolean} */	var IGNORE_NULLS = true;


// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ****************************************** NERD MODE *******************************************
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


// SYNTAX OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var USE_WITH = false;
/** @define {string} */		var OPEN_TAG = "{{";
/** @define {string} */		var CLOSE_TAG = "}}";
/** @define {string} */		var OPERATOR_ECHO = "=";
/** @define {string} */		var OPERATOR_ESCAPED_ECHO = "-";
/** @define {string} */		var OPERATOR_COMMENT = "#";
/** @define {string} */		var OPERATOR_FILTER = "|";
/** @define {string} */		var OUTPUT_VAR = "_o";
/** @define {string} */		var INPUT_VAR = "data";

// SUPPORT OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var SUPPORT_OLD_BROWSERS = false;
/** @define {boolean} */	var SUPPORT_SHORTCODES = true;
/** @define {boolean} */	var SUPPORT_EXTENDS = true;
/** @define {boolean} */	var SUPPORT_PARTIALS = true;
/** @define {boolean} */	var SUPPORT_FILTERS = true;

// 
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var SUPPORT_EXPERIMENTAL = false;


+function(root){

	var server = (typeof exports !== 'undefined');

	// Simple increment ID for for tpl/patrial etc.
	var UID = 0;

	if( DEBUG ) {
		var TUID = 0;
	}

	// regexp.test is the fastest way
	// E.g. var x = /(\w+)/.test( string ) && RegExp.$1
	// http://jsperf.com/js-exec-vs-match/2
	var _RegExp = server ? RegExp : root['RegExp'];

	// Operators codes
	var KEY_JS = 1,
		KEY_FOR = 2,
		KEY_BLOCK = 3,
		KEY_FILTER = 4,
		KEY_ECHO = 5,
		KEY_ESCAPE = 6;

	// Cache indexes
	var 
		_cacheCompiled = {},
		_cacheCompiledByTpl = {},
		_cachePartials = {},
		_cacheParsing = {},
		_cachePartialsIndex = {};

	// First and last lines of compiled tpl
	var 
		CODE_FIRST, 
		CODE_LAST = "return " + OUTPUT_VAR;


	// It is possible to use Zippr in Underscore's style
	// E.g.  {someProp: 2} => someProp
	// It is not recommended to use this setting
	// http://www.2ality.com/2011/06/with-statement.html
	if( USE_WITH ) {

		// @todo Try to replace "With" with real(?) local vars
		CODE_FIRST = 
			(IGNORE_NULLS ? "var _v=" + ZIPPR_NAME + ".v," : "var")
			+ OUTPUT_VAR + "=" + (DEBUG ? "[]" : "''")
			+ ";with(" + INPUT_VAR + "){";

		CODE_LAST  = "} " + CODE_LAST;

	} else {

		CODE_FIRST = 
			(IGNORE_NULLS ? "var _v=" + ZIPPR_NAME + ".v," : "var")
			+ OUTPUT_VAR + "=" + (DEBUG ? "[]" : "''");
	}


	// 
	if( DEBUG ) {
		// CODE_FIRST = "try{" + CODE_FIRST;
		// CODE_LAST = (USE_WITH ? "}" : "") + "}catch(e){console.error(e.message);};" + "return " + OUTPUT_VAR + (DEBUG ? ".join('')" : "");
		CODE_FIRST += ",_d=" + ZIPPR_NAME + ".debug";
		CODE_LAST = (USE_WITH ? "}" : "") + "return " + OUTPUT_VAR + (DEBUG ? ".join('')" : "");
	}



	//= "_oldbrowsers.js"
	//= "_utils.js"
	//= "_parser.js"
	//= "_compiler.js"
	

	//
	//
	//
	function Zippr(templateString, templateID, isPartial ){

		if(templateString.charAt(0) === "#"){
			templateID = templateString;
			if( DEBUG ) {
				var element = document.getElementById(templateString.substr(1));
				if( !element ) {
					console.error("The is no element with ID ", templateString);
				}

				templateString = element.innerHTML;

			} else {
				templateString = document.getElementById(templateString.substr(1)).innerHTML;
			}
		}

		!templateID && (templateID = ("t" + UID++));

		// if(templateID && _cacheCompiled[templateID])
		// 	return _cacheCompiled[templateID];

		if(_cacheCompiledByTpl[templateString])
			return _cacheCompiledByTpl[templateString];

		if( DEBUG ) {
			console.group( "tpl: " + templateID );
		}

		var compiled = compileTemplateString(templateString, templateID, isPartial);

		if( DEBUG ) {
			console.groupEnd("tpl: " + templateID);
		}

		var fn = new Function(INPUT_VAR, compiled);

		_cacheCompiledByTpl[templateString] = fn;

		if(templateID && !_cacheCompiled[templateID]){
			// _cacheCompiled[templateID] = fn;
			_cacheCompiled[templateID] = compiled;
		}

		return fn;
    }


    // "_experimental.js"

    
    if( DEBUG ) {

    	//= "_debug.js"
    }


    root[ZIPPR_NAME] = Zippr;
    
    // For tests usage only
    root[ZIPPR_NAME]['_name'] = ZIPPR_NAME;

    if( typeof exports !== 'undefined' ) {
    	module['exports'] = Zippr;
    } else {
    	root[ZIPPR_NAME] = Zippr;
    }

}( this );