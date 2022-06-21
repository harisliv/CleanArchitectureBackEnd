const { Entity } = require('./Entity');
const { OfferingType } = require('./OfferingType');

class Offering extends Entity {
  constructor({ id, name, price }) {
    super(id);
    this.name = name;
    this.price = price;
    this.type = OfferingType.OFFERING;
  }
}

module.exports = {
  Offering
};
