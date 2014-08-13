// Allows the UI to be tested in the browser without having to rebuild for
// Chrome OS each time.

if (!window.chrome) {
  window.chrome = {};
}

if (!window.chrome.storage) {
  window.chrome.storage = {
    sync: {
      set: function() {},
      get: function() {}
    }
  };
}
