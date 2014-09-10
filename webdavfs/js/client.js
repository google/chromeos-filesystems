// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var getError = require('./errors');

if (!Number.isNaN) {
  Number.isNaN = function(obj) {
    return typeof obj === 'number' && obj !== +obj;
  };
}

/**
 * Class containing methods for communicating with a WebDAV server over XHR
 * and manipulating the responses.
 * @class
 */
var WebDAVClient = function() {};

/**
 * Convenience function for selecting the text content of nodes in an XML
 * document, using the DAV namespace.
 * @param {Node} element The XML Node to select from.
 * @param {string} selector The name of the tag to search select, excluding
 *     the namespace.
 * @return {string} The text content of the selected node.
 */
WebDAVClient.prototype.select = function(element, selector) {
  // TODO(lavelle): is this consistent for the WebDAV protocol, or an
  // implementation detail of the server?
  var namespace = 'DAV:';

  // Perform a query for the given selector, scoped by the DAV namespace.
  var elements = element.getElementsByTagNameNS(namespace, selector);

  // Return the text content of the first node in the returned collection, if
  // there are any.
  if (elements.length > 0) {
    return elements[0].textContent;
  } else {
    // Otherwise just return the empty string - no useful data here.
    return '';
  }
};

/**
 * Converts an XML Node in a WebDAV response object to an object representing
 * an entry in the ChromeOS File system.
 * @param {Node} node The XML Node to convert
 * @return {Object} A plain object representing the file or directory in the
 *     file system provider API.
 */
WebDAVClient.prototype.nodeToEntry = function(node) {
  // Extract the name of the file/directory from the href attribute.
  var name = this.select(node, 'href');

  if (name !== '/') {
    // Remove leading and trailing slashes from the name.
    name = name.replace(/^\/|\/$/g, '').split('/').pop();
  }

  // Extract the MIME type of the file from the getcontenttype attribute.
  var contentType = this.select(node, 'getcontenttype');

  // Determine whether an entry is a directory by the absence of a content type
  // attribute.
  var isDirectory = contentType === '';

  // Extract the modification time of the file from the  getlastmodified
  // attribute, and parse it into a Date object.
  var modificationTime = new Date(this.select(node, 'getlastmodified'));

  var size = parseInt(this.select(node, 'getcontentlength'), 10);

  if (Number.isNaN(size)) {
    size = 0;
  }

  // Construct the entry object to be returned to the file system provider.
  var entry = {
    name: name,
    modificationTime: modificationTime,
    size: size,
    isDirectory: isDirectory
  };

  // Only give files MIME types, not directories.
  if (!isDirectory) {
    entry.mimeType = contentType;
  }

  return entry;
};

/**
 * Make a HTTP GET request -- fetch an entry from the server.
 * @param {string} url The URL of the server.
 * @param {Object=} opt_headers Any HTTP headers to set on the request.
 * @param {Function} onSuccess Function to be called with the response data
 *     from the request if it was successful.
 * @param {Function} onError Function to be called with an error message
 *     if the request failed.
 */
WebDAVClient.prototype.get = function(url, opt_headers, onSuccess, onError) {
  var verb = 'GET';
  var headers = opt_headers || {};
  var data = null;
  var responseType = 'arraybuffer';

  this.request(verb, url, headers, data, responseType, onSuccess, onError);
};

/**
 * Make a HTTP PUT request -- write an entry to the server.
 * @param {string} url The URL of the server.
 * @param {Object} data The data to write.
 * @param {Object=} opt_headers Any HTTP headers to set on the request.
 * @param {Function} onSuccess Function to be called with the response data
 *     from the request if it was successful.
 * @param {Function} onError Function to be called with an error message
 *     if the request failed.
 */
WebDAVClient.prototype.put = function(url, data, opt_headers, onSuccess, onError) {
  var verb = 'PUT';
  var headers = opt_headers || {};
  var responseType = 'document';

  this.request(verb, url, headers, data, responseType, onSuccess, onError);
};

/**
 * Make a HTTP DELETE request -- remove an entry from the server.
 * @param {string} url The URL of the server.
 * @param {Object=} opt_headers Any HTTP headers to set on the request.
 * @param {Function} onSuccess Function to be called with the response data
 *     from the request if it was successful.
 * @param {Function} onError Function to be called with an error message
 *     if the request failed.
 */
WebDAVClient.prototype.delete = function(url, opt_headers, onSuccess, onError) {
  var verb = 'DELETE';
  var headers = opt_headers || {};
  var data = null;
  var responseType = 'document';

  this.request(verb, url, headers, data, responseType, onSuccess, onError);
};

/**
 * Make a HTTP COPY request -- copy an entry from one location to another.
 * @param {string} url The URL of the server.
 * @param {string} target The path to copy the file to.
 * @param {Function} onSuccess Function to be called with the response data
 *     from the request if it was successful.
 * @param {Function} onError Function to be called with an error message
 *     if the request failed.
 */
WebDAVClient.prototype.copy = function(source, target, onSuccess, onError) {
    var verb = 'COPY';
    var headers = {
      Destination: target,
      Overwrite: 'F'
    };
    var data = null;
    var responseType = 'document';

    this.request(verb, source, headers, data, responseType, onSuccess, onError);
};

/**
 * Make a HTTP MOVE request -- move an entry from one location to another.
 * @param {string} url The URL of the server.
 * @param {string} target The path to copy the file to.
 * @param {Function} onSuccess Function to be called with the response data
 *     from the request if it was successful.
 * @param {Function} onError Function to be called with an error message
 *     if the request failed.
 */
WebDAVClient.prototype.move = function(source, target, onSuccess, onError) {
    var verb = 'MOVE';
    var headers = {
      Destination: target,
      Overwrite: 'F'
    };
    var data = null;
    var responseType = 'document';

    this.request(verb, source, headers, data, responseType, onSuccess, onError);
};

/**
 * Make a HTTP PROPFIND request -- fetch the metadta for an entry from the
 * server.
 * @param {string} url The URL of the server.
 * @param {Function} onSuccess Function to be called with the response data
 *     from the request if it was successful.
 * @param {Function} onError Function to be called with an error message
 *     if the request failed.
 * @param {Number} depth Number of levels of the filesystem to hierarchy to
 *     return information for.
 */
WebDAVClient.prototype.propertyFind = function(url, onSuccess, onError, depth) {
  var verb = 'PROPFIND';
  var headers = {Depth: depth};
  var data = null;
  var responseType = 'document';

  this.request(verb, url, headers, data, responseType, onSuccess, onError);
};

/**
 * Low-level wrapper function for making HTTP requests.
 * @param {string} verb HTTP verb to use for the request.
 * @param {string} url URL to send the request to.
 * @param {Object} headers Any HTTP headers to attach to the request.
 * @param {Object} data Data to be sent in the request.
 * @param {string} responseType The type of data returned by the request.
 * @param {Function} onSuccess Function to be called with the response data
 *     from the request if it was successful.
 * @param {Function} onError Function to be called with an error message
 *     if the request failed.
 * @return {Element} The XML document response from the server.
 */
WebDAVClient.prototype.request = function(verb, url, headers, data, responseType,
  onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    var processBody = function() {
      var body = xhr.response;

      // If we're making a PROPFIND, remove the top level of the XML document
      // as it contains no useful information.
      if (verb === 'PROPFIND') {
        body = body.firstChild.nextSibling ? body.firstChild.nextSibling : body.firstChild;
      }

      return body;
    };

    // Register the callback to to be called when the request sucessfully
    // completes.
    xhr.onreadystatechange = function() {
      if(xhr.readyState !== 4) { return; }

      // Return an error for a non-2XX failure status code.
      if (xhr.status < 200 || xhr.status >= 300) {
        onError(getError(xhr.status));
        return;
      }

      var body = processBody();

      // Return an error if there was no response.
      if (!body) {
        onError('FAILED');
        return;
      }

      onSuccess(body);
    };

    // Always make asynchronous requests.
    var isAsynchronous = true;

    // Open the XHR connection.
    xhr.open(verb, url, isAsynchronous);

    // Set the expected data type of the server response.
    xhr.responseType = responseType;

    // If we're making a GET request, the request data is an XML document
    // so make sure to set this in the headers.
    if (verb === 'GET') {
      xhr.setRequestHeader('Content-Type', 'text/xml; charset=UTF-8');
    }

    // Set any other headers provided by the caller.
    for (var header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }

    // Send the data over the connection.
    xhr.send(data);
};

module.exports = WebDAVClient;
