var LogEntries = function(entries) {
	var logEntries = Object.create(Array.prototype);

	logEntries = (Array.apply( logEntries, arguments ) || logEntries);

    // Add all the class methods to the collection.
    LogEntries.injectClassMethods( logEntries );

    // Return the new collection object.
    return logEntries ;
}

// Define the static methods.
LogEntries.injectClassMethods = function( logEntries ) {

    // Loop over all the prototype methods and add them
    // to the new collection.
    for (var method in LogEntries.prototype){

        // Make sure this is a local method.
        if (LogEntries.prototype.hasOwnProperty( method )){

            // Add the method to the collection.
            logEntries[ method ] = LogEntries.prototype[ method ];

        }

    }

    // Return the updated collection.
    return logEntries ;

};

LogEntries.prototype = {
	toString: function() {
		return JSON.stringify(this);
	},

};
