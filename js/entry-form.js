var EntryForm = function(filesystem, container, logFiler, logTable) {
	this.currLogName = "Full Log";
	this.currMyCall = 'n9dk';

	this.filesystem = filesystem;
	this.container = document.getElementById(container);
 	this.logFiler = logFiler;
	this.logTable = logTable;

	this.table = createElement('table', {class: 'entryForm'});
	this.table.appendChild(this.buildHeaders());
	this.inputRow = this.buildInput();
	this.table.appendChild(this.inputRow);

	var dia = createElement('dialog', {id: 'new-save'});
	dia.appendChild(createElement('p', {innerText: "save as new or overwrite?"}));
	var newSaveNew = createElement('button', {id: 'new-save-new', innerText: "New"});
	newSaveNew.addEventListener('click', 
		function() {
			//reset uuid
			this.save();
			document.getElementById('new-save').close();
		}.bind(this)
	);
	var newSaveOverwrite = createElement('button', {id: 'new-save-overwrite', innerText: "Overwrite"});
	newSaveOverwrite.addEventListener('click',
		function() {
			this.save();
			document.getElementById('new-save').close();
		}.bind(this)
	);
	dia.appendChild(newSaveNew);
	dia.appendChild(newSaveOverwrite);


	var buttonSave = createElement('button', {id: 'saveEntry', innerText: "Save"});
	buttonSave.addEventListener('click', 
		function() {
			if(this.isNewEntry)
				this.save();
			else
				document.getElementById('new-save').showModal();
		}
	.bind(this));
	var buttonClear = createElement('button', {id: 'clearEntry', innerText: "Clear"});
	buttonClear.addEventListener('click', this.clearEntry.bind(this));

	this.container.appendChild(this.table);
	this.container.appendChild(buttonSave);
	this.container.appendChild(buttonClear);
	this.container.appendChild(dia);

	this.clearEntry();

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
				var el;
				switch (key) {
					case 'band':
						el = createElement('select', {id: key});
						el.appendChild(createElement('option', {value: '', innerText: ''}));
						for (var band in Lookup.freqBandMode) {
							el.appendChild(createElement('option', {value: band, innerText: band}));
						}
						break;
					case 'mode':
						el = createElement('select', {id: key});
						el.appendChild(createElement('option', {value: '', innerText: ''}));
						for (var i in Lookup.modes) {
							el.appendChild(createElement('option', {value: Lookup.modes[i], innerText: Lookup.modes[i]}));
						}
						break;
					default:
						el = createElement('input', {type: "text", id: key});
						break;
				}
				row.appendChild(createElement('td', {class: "entryFormHeader"})).appendChild(el);
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
					switch (key) {
						case 'freq':
							document.getElementById('band').value = this.entry.band;
							document.getElementById('mode').value = this.entry.mode;
							break;
						default:
							break;
					}
		  		}.bind(this, key));
		  	}
		 }
		 return;
	},

	clearEntry: function() {
		entry = new Entry;
		entry.logName = this.currLogName;
		entry.myCall = this.currMyCall;
		this.setEntry(entry);
		this.isNewEntry = true;
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

	setEntry: function(entry) {
		for (var key in Entry.prototype.structure) {
			if (Entry.prototype.structure[key].visible == true)
				document.getElementById(key).value = entry[key];
		}
		this.isNewEntry = false;
		this.entry = entry;
		document.getElementById('contactCall').focus();
	},

	onSave: function(entry, size, currEntry) {
		log('File saved: ' + size + ' bytes');
		currEntry.sync = 'pending';
		this.logTable.push(currEntry);
		this.logTable.refresh();
		this.clearEntry();
	},

	save: function() {
//  for (var i=0; i<100; i++) {
    
		this.currEntry = this.getEntry();
//	this.currEntry.uuid = uuid.v4();
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
