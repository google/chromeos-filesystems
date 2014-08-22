chrome = chrome || {};

if (!chrome.i18n) {
  chrome.i18n = {
    getMessage: function(name) {
      return name;
    }
  };
}

var keys = ['bucket', 'region', 'access', 'secret'];

var fields = {};

keys.forEach(function(name) {
  fields[name] = document.getElementById(name);
});

var button = document.getElementById('mount');

var restoreCredentials = function() {
  if (!chrome.storage) { return; }
  chrome.storage.sync.get(keys, function(items) {
    for (var key in items) {
      var value = items[key];

      if (value) {
        fields[key].value = value;
      }
    }
  });
};

chrome.i18n = {
  getMessage: function() {
    return 'Dummy';
  }
};

var internationalise = function() {
  var selector = 'data-message';
  var elements = document.querySelectorAll('[' + selector + ']');

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    var messageID = element.getAttribute(selector);
    var messageText = chrome.i18n.getMessage(messageID);

    switch(element.tagName.toLowerCase()) {
      case 'input':
        element.setAttribute('placeholder', messageText);
        break;
      case 'paper-input':
      case 'paper-button':
        element.setAttribute('label', messageText);
        break;
      case 'paper-toast':
        element.setAttribute('text', messageText);
        break;
      case 'h1':
      case 'button':
      case 'title':
        element.innerText = messageText;
        break;
    }
  }
};

restoreCredentials();
internationalise();

button.addEventListener('click', function(event) {
  event.preventDefault();

  button.setAttribute('disabled', 'true');

  document.getElementById('toast-mount-attempt').show();

  var request = {
    type: 'mount'
  };

  for (var key in fields) {
    request[key] = fields[key].value;
  }

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
