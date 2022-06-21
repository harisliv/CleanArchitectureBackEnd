const { pool } = require('./pgPool');
const { Offering } = require('../../model/Offering');
const {
  offeringRepository,
  bundleRepository,
  userSubscriptionRepository
} = require('../../registry');
const { Bundle } = require('../../model/Bundle');
const { UserSubscription } = require('../../model/UserSubscription');

beforeAll(async () => {
  await pool.query('truncate table offering restart identity cascade');
  await pool.query('truncate table bundle_offering restart identity cascade');
  await pool.query('truncate table bundle restart identity cascade');

  const offering1 = await offeringRepository.create(
    new Offering({ name: `test offering 1`, price: 100 })
  );
  const offering2 = await offeringRepository.create(
    new Offering({ name: `test offering 2`, price: 100 })
  );
  const offering3 = await offeringRepository.create(
    new Offering({ name: `test offering 3`, price: 100 })
  );
  const offering4 = await offeringRepository.create(
    new Offering({ name: `test offering 4`, price: 100 })
  );

  await bundleRepository.create(
    new Bundle({
      name: `test bundle 1`,
      price: 100,
      offerings: [offering1, offering3]
    })
  );
  await bundleRepository.create(
    new Bundle({
      name: `test bundle 2`,
      price: 100,
      offerings: [offering2, offering4]
    })
  );
});

beforeEach(async () => {
  await pool.query('truncate table user_subscription restart identity cascade');
});

afterAll(() => {
  pool.end();
});

describe('User Subscription Repository', () => {
  it('retrieves the entity by id after an entity is created', async () => {
    const userSubscription = await userSubscriptionRepository.create(
      new UserSubscription({
        userId: 'user1',
        offering: await offeringRepository.retrieveByName('test offering 1')
      })
    );
    const retrievedSubscription = await userSubscriptionRepository.retrieve(
      userSubscription.id
    );
    expect(retrievedSubscription).toBeInstanceOf(UserSubscription);
    expect(userSubscription).toStrictEqual(retrievedSubscription);
  });
});
