const { Offering } = require('../model/Offering');

class OfferingService {
  #offeringRepository;

  constructor(offeringRepository) {
    this.#offeringRepository = offeringRepository;
  }

  create = async (name, price) =>
    this.#offeringRepository.create(new Offering({ name, price }));

  retrieve = async (id) => this.#offeringRepository.retrieve(id);

  list = async () => this.#offeringRepository.list();

  update = async (id, name, price) =>
    this.#offeringRepository.update(new Offering({ id, name, price }));

  delete = async (id) => this.#offeringRepository.delete({ id });
}

module.exports = {
  OfferingService
};
