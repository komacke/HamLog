var LogFiler = function(filesystem, logTable, isSyncable) {
	this.filesystem = filesystem;
  	this.logTable = logTable;
  	this.isSyncable = isSyncable;

  	this.fetching = false;

	if (this.isSyncable) {
		if (chrome.syncFileSystem.onFileStatusChanged) {
			chrome.syncFileSystem.onFileStatusChanged.addListener(
				function(detail) {
					console.log(detail);
					if (detail.direction == 'remote_to_local') {
						info('File ' + detail.fileEntry.fullPath + ' is ' 
							+ detail.action + ' by background sync.');
						if (detail.action == 'deleted') {
							this.removeEntry(detail.fileEntry.fullPath);
						} else if (detail.action == 'updated') {
							this.updateEntry(detail.fileEntry.fullPath);
						} else {
						    this.list(this.filesystem.root);
						}
					}
					if (detail.direction == 'local_to_remote') {
						info('File ' + detail.fileEntry.fullPath + ' is ' 
							+ detail.action + ' to server by background sync.')
						if (detail.action == 'added')
							this.syncedEntry(detail.fileEntry.fullPath);
					}
			  	}.bind(this));
		}
		if (chrome.syncFileSystem.onServiceStatusChanged) {
			chrome.syncFileSystem.onServiceStatusChanged.addListener(
				function(detail) {
					log('Service state updated: ' + detail.state + ': '
				    	+ detail.description);
				}.bind(this));
		}
	}

	this.list(this.filesystem.root);

};

LogFiler.prototype = {

	list: function(dir, detail) {
		if (this.fetching)
    		return;
  		this.fetching = true;

    	var reader = dir.createReader();
		reader.readEntries(this.didReadEntries.bind(this, dir, reader), error);
	},

	didReadEntries: function(dir, reader, entries) {
  		if (!entries.length) {
    		this.fetching = false;
    		return;
  		}

		for (var i = 0; i < entries.length; ++i) {
			if (entries[i].isFile) {
				// Get File object so that we can show the file size.
			  	entries[i].file(
			  		this.open.bind(this, entries[i]),
			        error.bind(null, "Entry.file:", entries[i])
			    );
			} else {
				this.open(entries[i]);
			}
		}

		// Continue reading.
		reader.readEntries(this.didReadEntries.bind(this, dir, reader), error);
	},

	load: function(entry) {
		entry.file(function(file) {
			var reader = new FileReader();
			reader.readAsText(file, "utf-8");
			reader.onload = function(ev) {
				var entry = new Entry(ev.target.result);
				this.logTable.push(entry);
				this.logTable.refresh();
			}.bind(this);
		}.bind(this), error);
	},

	open: function(entry) {
		var fileUuid = entry.fullPath.match(/([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})/);

		var filtered = this.logTable.logEntries.filter(function(value) {
			if (fileUuid == null) 
				return false;
			return value.uuid == fileUuid[1];
		});

		if (filtered.length == 0)
			this.filesystem.root.getFile(
			  	entry.fullPath,
			  	{},
			  	this.load.bind(this, entry),
			  	error.bind(null, "getFile " + entry.fullPath)
			);
	},

	removeEntry: function(fullPath) {
		var fileUuid = fullPath.match(/([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})/);

		if (fileUuid == null) {
			log("Entry: " + fileUuid[1] +" removed on server but not file not found here.");
			return false;
		}

		var found = false;
		for (var i=0; i<this.logTable.logEntries.length; i++) {
			if (this.logTable.logEntries[i].uuid == fileUuid[1]) {
				this.logTable.logEntries[i].sync = 'deleted';
				found = true;
				break;
			}
		}

		if (found) {
			this.logTable.refresh();
			log("Removed entry: " + fileUuid[1]);
		} else {
			log("Entry: " + fileUuid[1] +" removed as file but no log entry found.");
		}

	},

	updateEntry: function(fullPath) {
		var fileUuid = fullPath.match(/([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})/);

		if (fileUuid == null) {
			log("Entry: " + fileUuid[1] +" changed on server but not file not found here.");
			return false;
		}

		var found = false;
		for (var i=0; i<this.logTable.logEntries.length; i++) {
			if (this.logTable.logEntries[i].uuid == fileUuid[1]) {
				this.logTable.logEntries.splice(i,1);
				found = true;
				break;
			}
		}

		if (found) {
			log("Changed entry: " + fileUuid[1]);
		    this.list(this.filesystem.root);
		} else {
			log("Entry: " + fileUuid[1] +" changed as file but no log entry found.");
		}
	},

	syncedEntry: function(fullPath) {
		var fileUuid = fullPath.match(/([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})/);

		if (fileUuid == null) {
			log("Entry: " + fileUuid[1] +" synced to server but not not found here.");
			return false;
		}

		var found = false;
		for (var i=0; i<this.logTable.logEntries.length; i++) {
			if (this.logTable.logEntries[i].uuid == fileUuid[1]) {
				this.logTable.logEntries[i].sync = 'synced';
				found = true;
				break;
			}
		}

		if (found) {
			this.logTable.refresh();
			log("Synced entry: " + fileUuid[1]);
		} else {
			log("Entry: " + fileUuid[1] +" synced as file but no log entry found.");
		}

	},

};