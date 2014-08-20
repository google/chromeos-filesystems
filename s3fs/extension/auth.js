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

mount.addEventListener('click', function(event) {
  event.preventDefault();

  var request = {
    type: 'mount'
  };

  for (var key in fields) {
    request[key] = fields[key].value;
  }

  console.log(request);

  chrome.runtime.sendMessage(request, function(response) {
    console.log(response);

    if (response.success) {
      // TODO(lavelle): show this to the user.
      // Options:
      //   - chrome.notifcations
      //   - Polymer toast
      console.log('Mounted successfully.');
    }
    else {
      console.error(error);
      console.log('Failed to mount with given credentials.');
    }
  });
});
