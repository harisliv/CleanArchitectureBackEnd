const logger = require('../logger');

const { OfferingType } = require('../model/OfferingType');
const {
  offeringService,
  bundleService,
  userSubscriptionRepository,
  subscriptionService,
  offeringRepository
} = require('../registry');

(async () => {

  await Promise.all(
    (
      await bundleService.list()
    ).map(async (offering) => bundleService.delete(offering.id))
  );

  await Promise.all(
    (
      await offeringService.list()
    ).map(async (offering) => offeringService.delete(offering.id))
  );

  await offeringService.create('nova', 300);
  logger.info('list', (await offeringService.list()));
  await offeringService.create('forthnet', 300);
  await bundleService.create('superpack', 500, ['nova', 'forthnet']);

  // const offeringsList = ;
  logger.info('offerings list', await offeringRepository.list());

  await subscriptionService.subscribeUser('user1', 'nova');
  await subscriptionService.subscribeUser('user1', 'forthnet');
  await subscriptionService.subscribeUser(
    'user1',
    'superpack',
    OfferingType.BUNDLE
  );
  logger.info('subscriptions list', await userSubscriptionRepository.list());

  await subscriptionService.unsubscribeUser('user1', 'nova');
  await subscriptionService.unsubscribeUser(
    'user1',
    'superpack',
    OfferingType.BUNDLE
  );

  try {
    await subscriptionService.subscribeUser(
      'user1',
      'superpakk',
      OfferingType.BUNDLE
    );
  } catch (e) {
    logger.info(e.message);
  }
})();
