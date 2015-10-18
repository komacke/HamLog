var Entry = function(entry) {
	this.setEntry(entry);
};

Entry.prototype = {
	timeDateFormat: "yyyy-MM-dd HH:mm",

	niceNames: {
		myCall: 'My Call',
		contactCall: 'Contact Call',
		startTime: 'Start Time',
		endTime: 'End Time',
	},

	toString: function() {
		return JSON.stringify(this);
	},

	setEntry: function(e) {
		var eo;

		if (typeof e === "string")
			eo = JSON.parse(e);
		else if (e instanceof Entry)
			eo = e;
		
		for (var key in eo) {
			if (e.hasOwnProperty(key))
				this[key] = eo[key];
		}
	},

	timeToDateTime: function(t) {
		var dt = new Date(t);
		return dt; //debug
		if (t < new Date(1900)) {
			dt = new Date();
			dt.setHours(t.getHours());
			dt.setMinutes(t.getMinutes());
		}
		return dt;
	},

	makeFilename: function() {
		return this.logName + ":" + this.contactCall + ":" + this.startTime;
	}

}

Object.defineProperties(Entry.prototype, {

		myCall: {
			set: function(c) { this._myCall = c.trim().toUpperCase(); },
			get: function() { return this._myCall; },
		},

		contactCall: {
			set: function(c) { this._contactCall = c.trim().toUpperCase(); },
			get: function() { return this._contactCall; },
		},

		startTime: {
			set: function(t) {
				if (t.trim().toUpperCase() == 'QSO')
					this._startTime = new Date();
				else
					this._startTime = this.timeToDateTime(t);
			},
			get: function() { return this._startTime; },
		},

		endTime: {
			set: function(t) {
				if (t.trim().toUpperCase() == 'QRT')
					this._endTime = new Date();
				else
					this._endTime = new Date(t);
			},
			get: function() { return this._endTime; },
		},

		logName: {
			set: function(ln) { this._logName = ln.trim(); },
			get: function() { return this._logName; },
		},

});

