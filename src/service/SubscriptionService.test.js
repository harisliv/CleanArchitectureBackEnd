const { pool } = require('../repository/db/pgPool');
const { Offering } = require('../model/Offering');
const { SubscriptionService } = require('./SubscriptionService');
const {
  offeringRepository,
  bundleRepository,
  userSubscriptionRepository
} = require('../registry');
const { OfferingService } = require('./OfferingConfigurationService');
const { BundleService } = require('./BundleConfigurationService');
const { UserSubscription } = require('../model/UserSubscription');
const OfferingType = require('../model/OfferingType');

const offeringService = new OfferingService(offeringRepository);
const bundleService = new BundleService(bundleRepository, offeringRepository);

const subscriptionService = new SubscriptionService(
  offeringRepository,
  bundleRepository,
  userSubscriptionRepository
);

beforeAll(async () => {
  await pool.query('truncate table offering restart identity cascade');
  await pool.query('truncate table bundle_offering restart identity cascade');
  await pool.query('truncate table bundle restart identity cascade');

  await offeringService.create(`test offering 1`, 100);
  await offeringService.create(`test offering 2`, 100);
  await offeringService.create(`test offering 3`, 100);
  await offeringService.create(`test offering 4`, 100);

  await bundleService.create(`test bundle 1`, 100, [
    'test offering 1',
    'test offering 3'
  ]);
  await bundleService.create(`test bundle 2`, 100, [
    'test offering 2',
    'test offering 4'
  ]);
});

beforeEach(async () => {
  await pool.query('truncate table user_subscription restart identity cascade');
});

afterAll(() => {
  pool.end();
});

describe('Subscription Service', () => {
  it('subscribes a user to an offering to which the user is not subscribed', async () => {
    const userSubscription = await subscriptionService.subscribeUser(
      'user1',
      'test offering 1'
    );
    expect(userSubscription).toBeInstanceOf(UserSubscription);
    expect(userSubscription.id).toBe(1);

    const userSubscription2 = await subscriptionService.subscribeUser(
      'user1',
      'test offering 2'
    );
    expect(userSubscription2.id).toBe(2);
  });

  it('retrieves all the subscriptions of a user', async () => {
    const userSubscription1 = await subscriptionService.subscribeUser(
        'user1',
        'test offering 1'
      );
      const userSubscription2 = await subscriptionService.subscribeUser(
        'user1',
        'test bundle 1',
        OfferingType.BUNDLE
      );
    const retrievedSubscriptions = await subscriptionService.listByUserId('user1');
    console.log(retrievedSubscriptions);
    // TODO
  });
});
