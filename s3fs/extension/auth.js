var fields = {};

['bucket', 'region', 'key', 'secret'].forEach(function(name) {
  fields[name] = document.getElementById(name);
});

var button = document.getElementById('mount');

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
      alert('Mounted successfully');
    } else {
      console.error(error);
      alert('Failed to mount with given credentials');
    }
  });
});
