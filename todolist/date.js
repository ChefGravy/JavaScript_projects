// jshint esversion:6


// module.exports = exports
exports.getDate = () => {
  const today = new Date();
  const options = {
    weekday: `long`,
    day: `numeric`,
    month: `long`
  };

  const day = today.toLocaleDateString(`en-US`, options);

  return day;
};
//module.exports = getDate;
// instead of binding the entire module to module.exports, you call your specific function
//module.exports.getDate = getDate;
// or you can find a function to this module export
