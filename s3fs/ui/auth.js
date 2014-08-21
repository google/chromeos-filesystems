var AWSValidator = require('./awsvalidator');
var validator = new AWSValidator();

var keys = ['bucket', 'region', 'access', 'secret'];

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

  document.getElementById('toast-mount-attempt').show();

  var request = {
    type: 'mount'
  };

  for (var key in fields) {
    var value = fields[key].value;

    if (!validator[key](value)) {
      document.getElementById('toast-invalid-' + key).show();
      return;
    }

    request[key] = value;
  }

  button.setAttribute('disabled', 'true');

  chrome.runtime.sendMessage(request, function(response) {
    if (response.success) {
      document.getElementById('toast-mount-success').show();

      window.setTimeout(function() {
        window.close();
      }, 2000);
    } else {
      document.getElementById('toast-mount-fail').show();
      button.removeAttribute('disabled');
    }
  });
});
