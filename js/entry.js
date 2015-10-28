var Entry = function(entry) {
	this.setEntry(entry);
};

Entry.prototype = {
	structure: {
		sync: {
			niceName: "Sync",
			visible: false,
			stringify: false,
		},
		logName: {
			niceName: "Log Name",
			visible: true,
			stringify: true,
		},
		myCall: {
			niceName: "My Call",
			visible: true,
			stringify: true,
		},
		contactCall: {
			niceName: "Contact Call",
			visible: true,
			stringify: true,
		},
		freq: {
			niceName: "Freq (MHz)",
			visible: true,
			stringify: true,
		},
		band: {
			niceName: "Band",
			visible: true,
			stringify: true,
		},
		mode: {
			niceName: "Mode",
			visible: true,
			stringify: true,
		},
		startTime: {
			niceName: "Start Time (UTC)",
			visible: true,
			stringify: true,
		},
		endTime: {
			niceName: "End Time (UTC)",
			visible: true,
			stringify: true,
		},
		uuid: {
			niceName: "UUID",
			visible: false,
			stringify: true,
		},
	},

	toString: function() {
		return JSON.stringify(this);
	},

	toJSON: function() {
		var myKeys = {};
		for (var key in this.structure)	{
			if (this.structure[key].stringify)
				myKeys[key] = this[key];
		};
		return myKeys;
	},

	setEntry: function(e) {
		var eo;

		if (typeof e === "string" && e.length > 0) {
			eo = JSON.parse(e);
			for (var key in eo) {
				if (eo.hasOwnProperty(key))
					this[key] = eo[key];
			}
		} else if (e instanceof Entry) {
			eo = e;
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

	formatDateTime: function(dt) {
		if (dt == null || dt == '') return '';

		var y = dt.getUTCFullYear();
		var m = dt.getUTCMonth() + 1;
		if (m < 10) m = "0"+m;
		var d = dt.getUTCDate();
		if (d<10) d = "0"+d;
		var h = dt.getUTCHours();
		if (h<10) h = "0"+h;
		var min = dt.getUTCMinutes();
		if (min<10) min = "0"+min;
		var s = dt.getUTCSeconds();
		if (s<10) s = "0"+s;

		return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s
	},

	makeFilename: function() {
		return this.logName + ":" + this.uuid + ".txt";
	},

};

Object.defineProperties(Entry.prototype, {

		sync: {
			set: function(syncState) {
				this._sync = syncState;
			},
			get: function() {
				var icon;
				switch (this._sync) {
					case 'synced':
						icon = 'img/icon-synced.png';
						break;
					case 'deleted':
					case 'conflicting':
						icon = 'img/icon-conflicting.png';
						break;
					case 'pending':
						icon = 'img/icon-pending.png';
						break;
					default:
						icon = 'img/filler.png';
						break;
				}
				var img = createElement('img', {
						src: icon,
					});
				return img.outerHTML;
			},
		},

		myCall: {
			set: function(c) { this._myCall = c.trim().toUpperCase(); },
			get: function() { return this._myCall || ''; },
		},

		contactCall: {
			set: function(c) { this._contactCall = c.trim().toUpperCase(); },
			get: function() { return this._contactCall || ''; },
		},

		freq: {
			set: function(f) { 
				this._freq = f; 
				var f = f * 1e6;
				for (var band in Lookup.freqBandMode) {
					for (var i in Lookup.freqBandMode[band]) {
						var lower = Lookup.freqBandMode[band][i].lower.replace(/\,/g,'');
						var upper = Lookup.freqBandMode[band][i].upper.replace(/\,/g,'');
						if (f >= lower && f < upper) {
							this.band = band;
							this.mode = Lookup.freqBandMode[band][i].mode;
						}
					}
				}
			},
			get: function() { return this._freq || ''; },
		},

		band: {
			set: function(b) { this._band = b; },
			get: function() { return this._band || ''; },
		},

		mode: {
			set: function(m) { this._mode = m; },
			get: function() { return this._mode || ''; },
		},

		startTime: {
			set: function(t) {
				if (t === null || t.length == 0) {
					this._startTime = '';
				} else if (t.trim().toUpperCase() == 'QSO' || t.trim().toUpperCase() == 'O') {
					this._startTime = new Date();
				} else {
					this._startTime = this.timeToDateTime(t);
					if (isNaN(this._startTime.getTime())) this._startTime = '';
				}
			},
			get: function() { 
				return this.formatDateTime(this._startTime);
			},
		},

		endTime: {
			set: function(t) {
				if (t === null || t.length == 0) {
					this._endTime = '';
				} else if (t.trim().toUpperCase() == 'QRT' || t.trim().toUpperCase() == 'T') {
					this._endTime = new Date();
				} else {
					this._endTime = new Date(t);
					if (isNaN(this._endTime.getTime())) this._endTime = '';
				}
			},
			get: function() { 
				return this.formatDateTime(this._endTime);
			},
		},

		logName: {
			set: function(ln) { this._logName = ln.trim(); },
			get: function() { return this._logName; },
		},

		uuid: {
			set: function(u) { 
				this._uuid = u.trim(); 
			},
			get: function() {
				if (this._uuid == undefined || this._uuid == '')
					this._uuid = uuid.v4();
				return this._uuid;
			},
		},

});

