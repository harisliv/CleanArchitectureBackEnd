const { Offering } = require('./Offering');
const { OfferingType } = require('./OfferingType');

class Bundle extends Offering {
  constructor({ id, name, price, offerings = [] }) {
    super({ id, name, price });
    this.offerings = offerings;
    this.type = OfferingType.BUNDLE;
  }

  addOfferings = (offerings) => {
    this.offerings.push(...offerings);
  };
}

module.exports = {
  Bundle
};
