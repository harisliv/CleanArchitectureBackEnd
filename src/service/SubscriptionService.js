const { OfferingType, getByValue } = require('../model/OfferingType');
const { UserSubscription } = require('../model/UserSubscription');

class SubscriptionService {
  #offeringRepository;

  #bundleRepository;

  #userSubscriptionRespository;

  constructor(
    offeringRepository,
    bundleRepository,
    userSubscriptionRespository
  ) {
    this.#offeringRepository = offeringRepository;
    this.#bundleRepository = bundleRepository;
    this.#userSubscriptionRespository = userSubscriptionRespository;
  }

  listByUserId = async (userId) =>
    this.#userSubscriptionRespository.listByUserId(userId);

  subscribeUser = async (
    userId,
    offeringName,
    offeringType = OfferingType.OFFERING
  ) => {
    const userSubscriptions =
      await this.#userSubscriptionRespository.listByUserId(userId);
    if (
      userSubscriptions.some(
        (s) =>
          s.offering.name === offeringName && s.offering.type === offeringType
      )
    ) {
      throw new Error(`user already subscribed to ${offeringName}`);
    }

    let offering;
    switch (offeringType) {
      case OfferingType.OFFERING:
        offering = await this.#offeringRepository.retrieveByName(offeringName);
        break;
      case OfferingType.BUNDLE:
        offering = await this.#bundleRepository.retrieveByName(offeringName);
        break;
      default:
        throw new Error(`Unsupported offering type: ${offeringType}`);
    }

    if (!offering) {
      throw new Error(
        `could not find ${getByValue(offeringType)} ${offeringName}`
      );
    }

    return this.#userSubscriptionRespository.create(
      new UserSubscription({ userId, offering })
    );
  };

  unsubscribeUser = async (
    userId,
    offeringName,
    offeringType = OfferingType.OFFERING
  ) => {
    const userSubscriptions =
      await this.#userSubscriptionRespository.listByUserId(userId);
    const toDelete = userSubscriptions.find(
      (s) =>
        s.offering.name === offeringName && s.offering.type === offeringType
    );
    if (!toDelete) {
      throw new Error(`user not subscribed to ${offeringName}`);
    }

    return this.#userSubscriptionRespository.delete(toDelete);
  };
}

module.exports = {
  SubscriptionService
};
