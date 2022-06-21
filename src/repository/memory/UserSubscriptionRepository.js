const { InMemoryCrudRepository } = require('./InMemoryCrudRepository');

class UserSubscriptionRepository extends InMemoryCrudRepository {
  listByUserId = async (userId) =>
    Object.values(this.storage.entitiesPerId).filter(
      (s) => s.userId === userId
    );
}

module.exports = {
  UserSubscriptionRepository
};
