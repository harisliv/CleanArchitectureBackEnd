const { BundleRepository } = require('./repository/db/BundleRepository');
const {
  OfferingRepository
} = require('./repository/db/OfferingRepository');
const {
  UserSubscriptionRepository
} = require('./repository/db/UserSubscriptionRepository');

const { BundleService } = require('./service/BundleConfigurationService');
const { OfferingService } = require('./service/OfferingConfigurationService');
const { SubscriptionService } = require('./service/SubscriptionService');

const offeringRepository = new OfferingRepository();
const bundleRepository = new BundleRepository();
const userSubscriptionRepository = new UserSubscriptionRepository();

const offeringService = new OfferingService(offeringRepository);
const bundleService = new BundleService(bundleRepository, offeringRepository);
const subscriptionService = new SubscriptionService(
  offeringRepository,
  bundleRepository,
  userSubscriptionRepository
);

module.exports = {
  offeringRepository,
  bundleRepository,
  userSubscriptionRepository,
  offeringService,
  bundleService,
  subscriptionService
};
