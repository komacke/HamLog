'use strict';

var supportsSyncFileSystem = chrome && chrome.syncFileSystem;

document.addEventListener(
    'DOMContentLoaded',
        function() {
            if (supportsSyncFileSystem) {
                openSyncableFileSystem();
                window.onresize = function(event) { 
                  setLogListContainerHeight(); 
                  setHeaderWidth();
                };
            } else {
              //openTemporaryFileSystem();
                document.getElementById('fs-online').innerHTML = "No filesystem!";
            }
        }
);

function onFileSystemOpened(fs, isSyncable) {
  document.getElementById('fs-online').innerHTML = "On line";
  log('Got Syncable FileSystem.');
  console.log('Got FileSystem:' + fs.name);

  var logTable = new LogTable('logListContainer');
  var logFiler = new LogFiler(fs, logTable, isSyncable);
  var entryForm = new EntryForm(fs, 'entryFormContainer', logFiler, logTable);
  logTable.entryForm = entryForm;

  showLog('currentLog', entryForm);
  setLogListContainerHeight();
  setHeaderWidth();
}

function openTemporaryFileSystem() {
  $('#fs-temporary').classList.add('selected');
  //$('#fs-syncable').classList.remove('selected');
  hide('#conflict-policy')
  webkitRequestFileSystem(TEMPORARY, 1024,
                          onFileSystemOpened,
                          error.bind(null, 'requestFileSystem'));
}

function showLog(container, entryForm) {
  document.getElementById(container).innerHTML = "Current log: " + entryForm.currLogName + "; Station Call: " + entryForm.currMyCall;
}

function setLogListContainerHeight() {
  var otherHeight = jQuery('#header').outerHeight(true) + jQuery('#footer').outerHeight(true);
  var chromeAppTweak = 7 + 8;
  document.getElementById('logListContainer').style.height = (window.innerHeight - otherHeight) - chromeAppTweak + 'px';
}

function setHeaderWidth() {
  var chromeAppTweak = 16;
  document.getElementById('entryFormContainer').style.width = window.innerWidth - chromeAppTweak + 'px';
}

function openSyncableFileSystem() {
  if (!chrome || !chrome.syncFileSystem ||
      !chrome.syncFileSystem.requestFileSystem) {
    error('Syncable FileSystem is not supported in your environment.');
    return;
  }
  //$('#fs-syncable').classList.add('selected');
  //$('#fs-temporary').classList.remove('selected');
  if (chrome.syncFileSystem.setConflictResolutionPolicy) {
    chrome.syncFileSystem.setConflictResolutionPolicy('last_write_win');
    show('#conflict-policy')
  }
  log('Obtaining syncable FileSystem...');
  chrome.syncFileSystem.requestFileSystem(function (fs) {
    if (chrome.runtime.lastError) {
      error('requestFileSystem: ' + chrome.runtime.lastError.message);
      //$('#fs-syncable').classList.remove('selected');
      hide('#conflict-policy')
      return;
    }
    onFileSystemOpened(fs, true);
  });
}

$('#conflict-policy').addEventListener('click', function() {
  if ($('#auto-conflict-resolve').checked)
    policy = 'last_write_win';
  else
    policy = 'manual';
  chrome.syncFileSystem.setConflictResolutionPolicy(policy);
  log('Changed conflict resolution policy to: ' + policy);
});
