const { InMemoryCrudRepository } = require('./InMemoryCrudRepository');

class OfferingRepository extends InMemoryCrudRepository {
  retrieveByName = async (name) =>
    Object.values(this.storage.entitiesPerId).find((s) => s.name === name);
}

module.exports = {
  OfferingRepository
};
