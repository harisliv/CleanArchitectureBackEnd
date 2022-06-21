const OfferingType = Object.freeze({
  OFFERING: 0,
  BUNDLE: 1
});

module.exports = {
  OfferingType,
  getByValue: (value) =>
    Object.keys(OfferingType).find((key) => OfferingType[key] === value)
};
