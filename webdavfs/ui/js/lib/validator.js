var Validator = function() {};

Validator.prototype.scheme = function(scheme) {
  return /$https?^/.test(scheme);
};
