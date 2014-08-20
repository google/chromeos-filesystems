var keys = ['bucket', 'region', 'access', 'secret'];

var ToastManager = require('../../third_party/toastmanager/toastmanager');

var tm = new ToastManager({
  names: [
    'mounted-successfully', 'mount-failed'
  ]
});

var fields = {};

keys.forEach(function(name) {
  fields[name] = document.getElementById(name);
});

var button = document.getElementById('mount');

// Restore any saved values when the page loads.
chrome.storage.sync.get(keys, function(items) {
  for (var key in items) {
    var value = items[key];

    if (value) {
      fields[key].value = value;
    }
  }
});

button.addEventListener('click', function(event) {
  event.preventDefault();

  var request = {
    type: 'mount'
  };

  for (var key in fields) {
    request[key] = fields[key].value;
  }

  chrome.runtime.sendMessage(request, function(response) {
    if (response.success) {
      tm.show('mountedSuccessfully');
    } else {
      tm.show('mountFailed');
    }
  });
});
