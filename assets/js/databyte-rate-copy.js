// assets/js/databyte-rate-copy.js
// Neutral test copy for the next scanner rate bridge.
(function () {
  window.vlClampNumber = function (value, min, max) {
    const numberValue = Number(value) || 0;
    return Math.max(min, Math.min(max, numberValue));
  };
})();
