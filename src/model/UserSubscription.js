const { Entity } = require('./Entity');

class UserSubscription extends Entity {
  constructor({ id, userId, offering }) {
    super(id);
    this.userId = userId;
    this.offering = offering;
  }
}

module.exports = {
  UserSubscription
};
