const { InMemoryStorage } = require('./InMemoryStorage');

/* eslint-disable no-param-reassign */
class InMemoryCrudRepository {
  constructor(storage = new InMemoryStorage()) {
    this.storage = storage;
  }

  create = async (entity) => {
    if (!entity) {
      throw new Error(`Entity must not be null or undefined: ${entity}`);
    }
    entity.id = this.storage.generateNewId();
    this.storage.entitiesPerId[entity.id] = entity;
    return entity;
  };

  retrieve = async (id) => this.storage.entitiesPerId[id];

  list = async () => Object.values(this.storage.entitiesPerId);

  update = async (entity) => {
    if (!entity || entity.id === null || entity.id === undefined) {
      throw new Error(`Entity is null or entity.id is null: ${entity}`);
    }
    if (!this.storage.entitiesPerId[entity.id]) {
      throw new Error(`Cannot find entity with id: ${entity.id}`);
    }
    this.storage.entitiesPerId[entity.id] = entity;
    return entity;
  };

  delete = async (entity) => {
    if (!entity || entity.id === null || entity.id === undefined) {
      throw new Error(`Entity is null or entity.id is null: ${entity}`);
    }
    if (!this.storage.entitiesPerId[entity.id]) {
      throw new Error(`Cannot find entity with id: ${entity.id}`);
    }
    delete this.storage.entitiesPerId[entity.id];
  };
}

module.exports = {
  InMemoryCrudRepository
};
