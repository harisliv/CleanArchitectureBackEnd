// const logger = require('../logger');
const { Bundle } = require('../model/Bundle');

class BundleService {
  #bundleRepository;

  #offeringRepository;

  constructor(bundleRepository, offeringRepository) {
    this.#bundleRepository = bundleRepository;
    this.#offeringRepository = offeringRepository;
  }

  create = async (name, price, offeringNames = []) => {
    const bundle = new Bundle({ name, price });
    bundle.addOfferings(
      await Promise.all(
        offeringNames.map(async (off) => {
          const offering = await this.#offeringRepository.retrieveByName(off);
          if (!offering) {
            throw new Error(`Cannot find offering ${off}`);
          }
          return offering;
        })
      )
    );
    return this.#bundleRepository.create(bundle);
  };

  retrieve = async (id) => this.#bundleRepository.retrieve(id);

  list = async () => this.#bundleRepository.list();

  update = async (id, name, price, offeringNames = []) => {
    const bundle = new Bundle({ id, name, price });
    bundle.addOfferings(
      await Promise.all(
        offeringNames.map((off) => this.#offeringRepository.retrieveByName(off))
      )
    );
    return this.#bundleRepository.update(bundle);
  };

  delete = async (id) => this.#bundleRepository.delete({ id });
}

module.exports = {
  BundleService
};
