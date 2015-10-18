var EntryForm = function(filesystem, container, filer, logEntries) {
	this.filesystem = filesystem;
	this.container = document.getElementById(container);
 	this.filer = filer;
	this.logEntries = logEntries;

	this.table = createElement('table', {class: 'entryForm'});
	this.table.appendChild(this.buildHeaders());
	this.inputRow = this.buildInput();
	this.table.appendChild(this.inputRow);

	var button = createElement('button', {id: 'saveEntry', innerText: "Save"});
    this.saveEntry = function() {
    	console.log("save was clicked");
 	};
	button.addEventListener('click', this.save.bind(this));

	this.container.appendChild(this.table);
	this.container.appendChild(button);
}

EntryForm.prototype = {
	buildHeaders: function() {
		var header = createElement('tr');

		for (var key in Entry.prototype.niceNames) {
			header.appendChild(createElement('th', {innerText: Entry.prototype.niceNames[key]}));
		}

		return header;
	},

	buildInput: function() {
		var row = createElement('tr');

		for (var key in Entry.prototype.niceNames) {
			row.appendChild(createElement('td')).appendChild(createElement('input', {type: "text", id: key}));
		}

		return row;
	},

	buildRow: function(entry) {
		var row = createElement('tr');

		for (var key in Entry.prototype.niceNames) {
			row.appendChild(createElement('td')).appendChild(createElement('span', {id: key, innerText: entry[key]}));
		}

		return row;
	},

	getEntry: function() {
		currEntry = new Entry();

		var node = this.inputRow.firstChild;
		while (node) {
			currEntry[node.firstChild.id] = node.firstChild.value;
			node = node.nextSibling;
		}

		currEntry.logName = currLogName;

		console.log(currEntry);

		return currEntry;
	},

	onSave: function(entry, size) {
		log('File saved: ' + size + ' bytes');
		this.filer.reload();
	},

	save: function() {
		this.currEntry = this.getEntry();
		this.logEntries.push(this.currEntry);
		this.table.appendChild(this.buildRow(this.currEntry));

	  	var path = this.currEntry.makeFilename();
	  	log('Saving to:' + path);

		this.filesystem.root.getFile(
		  path, {create: true},
		  function(entry) {
		    entry.createWriter(function (writer) {
		      writer.truncate(0);
		      writer.onerror = error.bind(null, 'writer.truncate');
		      writer.onwriteend = function() {
		        var content = this.currEntry.toString();
		        var blob = new Blob([content]);
		        var size = content.length;
		        writer.write(blob);
		        writer.onerror = error;
		        writer.onwriteend = this.onSave.bind(this, entry, size);
		      }.bind(this);
		    }.bind(this));
		  }.bind(this));
	},
}
