class InMemoryStorage {
  #idGenerator = 0;

  entitiesPerId = {};

  // eslint-disable-next-line no-plusplus
  generateNewId = () => ++this.#idGenerator;
}

module.exports = {
  InMemoryStorage
};
