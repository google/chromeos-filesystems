module.exports = function() {
  // Polyfill Function.prototype.bind because PhantomJS doesn't support it:
  // https://groups.google.com/forum/#!msg/phantomjs/r0hPOmnCUpc/uxusqsl2LNoJ
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oldThis) {
      if (typeof this !== 'function') {
        // Closest thing possible to the ECMAScript 5 internal IsCallable
        // function
        throw new TypeError('Attempt to bind non-function object.');
      }

      var argsArray = Array.prototype.slice.call(arguments, 1);

      var functionToBind = this;

      var NOP = function() {};

      var bound = function() {
        var thisVal = this instanceof NOP && oldThis ? this: oldThis;
        return functionToBind.apply(thisVal, argsArray.concat(Array.prototype.slice.call(arguments)));
      };

      NOP.prototype = this.prototype;
      bound.prototype = new NOP();

      return bound;
    };
  }
};
