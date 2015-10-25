var EntryForm = function(filesystem, container, logFiler, logTable) {
	this.currLogName = "Full Log";

	this.filesystem = filesystem;
	this.container = document.getElementById(container);
 	this.logFiler = logFiler;
	this.logTable = logTable;
	this.entry = new Entry;

	this.table = createElement('table', {class: 'entryForm'});
	this.table.appendChild(this.buildHeaders());
	this.inputRow = this.buildInput();
	this.table.appendChild(this.inputRow);

	var button = createElement('button', {id: 'saveEntry', innerText: "Save"});
	button.addEventListener('click', this.save.bind(this));

	this.container.appendChild(this.table);
	this.container.appendChild(button);

	this.setListeners();
}

EntryForm.prototype = {
	buildHeaders: function() {
		var header = createElement('tr');

		for (var key in Entry.prototype.structure) {
			if (Entry.prototype.structure[key].visible == true)
				header.appendChild(createElement('th', {innerText: Entry.prototype.structure[key].niceName}));
		}

		return header;
	},

	buildInput: function() {
		var row = createElement('tr');

		for (var key in Entry.prototype.structure) {
			if (Entry.prototype.structure[key].visible == true) {
				var input = createElement('input', {type: "text", id: key});
				row.appendChild(createElement('td')).appendChild(input);
			}
		}

		return row;
	},

	setListeners: function() {
		for (var key in Entry.prototype.structure) {
			if (Entry.prototype.structure[key].visible == true) {
				document.getElementById(key).addEventListener('blur', function(key, ev) {
					this.entry[key] = ev.target.value;
					ev.target.value = this.entry[key];
		  		}.bind(this, key));
		  	}
		 }
		 return;
	},

	clearInput: function() {
		for (var key in Entry.prototype.structure) {
			if (Entry.prototype.structure[key].visible == true)
				document.getElementById(key).value = '';
		}

		this.entry = new Entry;

	},

	getEntry: function() {
		return this.entry;

		currEntry = new Entry();

		var node = this.inputRow.firstChild;
		while (node) {
			currEntry[node.firstChild.id] = node.firstChild.value;
			node = node.nextSibling;
		}

		return currEntry;
	},

	onSave: function(entry, size, currEntry) {
		log('File saved: ' + size + ' bytes');
		currEntry.sync = 'pending';
		this.logTable.push(currEntry);
		this.logTable.refresh();
		this.clearInput();
	},

	save: function() {
//  for (var i=0; i<100; i++) {
    
		this.currEntry = this.getEntry();
//	this.currEntry.uuid = uuid.v4();
		this.currEntry.logName = this.currLogName;
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
		        writer.onwriteend = this.onSave.bind(this, entry, size, this.currEntry);
		      }.bind(this);
		    }.bind(this));
		  }.bind(this));
//  }
	},
}
