'use strict';

var supportsSyncFileSystem = chrome && chrome.syncFileSystem;

var currLogName = "Full Log";

document.addEventListener(
  'DOMContentLoaded',
  function() {
    if (supportsSyncFileSystem)
      openSyncableFileSystem();
    else
      openTemporaryFileSystem();
  }
);

function onFileSystemOpened(fs, isSyncable) {
  log('Got Syncable FileSystem.');
  console.log('Got FileSystem:' + fs.name);
  var editor = new Editor(fs, 'editor');
  var filer = new Filer(fs, 'filer', editor, isSyncable);
  editor.filer = filer;

  var logEntries = new LogEntries();
  var entryForm = new EntryForm(fs, 'entryFormContainer', filer, logEntries);
  showLog('currentLog');
}

function openTemporaryFileSystem() {
  $('#fs-temporary').classList.add('selected');
  $('#fs-syncable').classList.remove('selected');
  hide('#conflict-policy')
  webkitRequestFileSystem(TEMPORARY, 1024,
                          onFileSystemOpened,
                          error.bind(null, 'requestFileSystem'));
}

function showLog(container) {
  document.getElementById(container).innerHTML = "Current log: " + currLogName;
}

function openSyncableFileSystem() {
  if (!chrome || !chrome.syncFileSystem ||
      !chrome.syncFileSystem.requestFileSystem) {
    error('Syncable FileSystem is not supported in your environment.');
    return;
  }
  $('#fs-syncable').classList.add('selected');
  $('#fs-temporary').classList.remove('selected');
  if (chrome.syncFileSystem.setConflictResolutionPolicy) {
    chrome.syncFileSystem.setConflictResolutionPolicy('last_write_win');
    show('#conflict-policy')
  }
  log('Obtaining syncable FileSystem...');
  chrome.syncFileSystem.requestFileSystem(function (fs) {
    if (chrome.runtime.lastError) {
      error('requestFileSystem: ' + chrome.runtime.lastError.message);
      $('#fs-syncable').classList.remove('selected');
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
