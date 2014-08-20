var keys = ['bucket', 'region', 'access', 'secret'];

var ToastManager = require('../../third_party/toastmanager/toastmanager');

var tm = new ToastManager({
  names: [
    'mount-success', 'mount-fail', 'mount-attempt'
  ]
});

tm.build();

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

  button.setAttribute('disabled', 'true');

  tm.show('mountAttempt');

  var request = {
    type: 'mount'
  };

  for (var key in fields) {
    request[key] = fields[key].value;
  }

  chrome.runtime.sendMessage(request, function(response) {
    if (response.success) {
      tm.show('mountedSuccessfully');
      window.setTimeout(function() {
        window.close();
      }, 2000);
    } else {
      tm.show('mountFailed');
      button.removeAttribute('disabled');
    }
  });
});
