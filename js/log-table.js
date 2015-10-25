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
		console.log(ev);
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

