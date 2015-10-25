var LogTable = function(container) {
	this.container = container;
	this.tableId = 'logList';
	var logEntries = new LogEntries;

	var div = document.getElementById(container);

	var table = createElement('table', {id: this.tableId});
	div.appendChild(table);

	var thead = createElement('thead');
	table.appendChild(thead);
	table.appendChild(createElement('tbody'));

	thead.appendChild(this.buildHeaders());

	jQuery('#'+this.tableId).dynatable({
		features: {pushState: false},
		dataset: {records: logEntries},
	});

	jQuery('#'+this.tableId).dynatable().on('click', 'tr', function(ev) {
		var evtUuid;
		for (var i=0 ; i<ev.currentTarget.childNodes.length; i++) {
			var testUuid = ev.currentTarget.childNodes[i].innerText.match(/([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})/);
			// do some error checking if not found?
			if (testUuid != null) {
				evtUuid = testUuid[1];
				break;
			}
		}

		var entry;
		for (var i=0; i<this.logEntries.length; i++) {
			if (this.logEntries[i].uuid == evtUuid) {
				entry = this.logEntries[i];
				break;
			}
		}

		// TODO: put this guy into the entry form for editing; don't forgot now editing needs save new, overwrite, maybe delete?
		console.log(entry);

	}.bind(this));


};

LogTable.prototype = {
	buildHeaders: function() {
		var header = createElement('tr');

		for (var key in Entry.prototype.structure) {
			header.appendChild(createElement('th', {
				"data-dynatable-column": key, 
				class: key,
				innerText: Entry.prototype.structure[key].niceName
			}));
		}

		return header;
	},

	refresh: function() {
		jQuery('#'+this.tableId).dynatable().data('dynatable').process();
	},

	push: function(entry) {
		if (entry instanceof Entry)
			this.logEntries.push(entry);
		else
			console.log("Uhhh, not an instance of Entry: " + entry);
	},

};

Object.defineProperties(LogTable.prototype, {

	logEntries: {
		get: function() {
			return jQuery('#'+this.tableId).dynatable().data('dynatable').settings.dataset.originalRecords;
		},
	},

});

