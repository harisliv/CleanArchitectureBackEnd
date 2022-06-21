const express = require('express');
const logger = require('./logger');

const {
  subscriptionService,
  offeringService,
  bundleService
} = require('./registry');
const { seeder } = require('./seeders/offeringsAndSubscriptionsSeeder');

const app = express();
const port = 3000;

seeder(subscriptionService, offeringService, bundleService).run();

app.use(express.json());

app.use((req, res, next) => {
  next();
});

app.use(
  '/api/subscriptions',
  require('./controller/SubscriptionController')(subscriptionService)
);

app.use(
  '/api/offerings',
  require('./controller/OfferingController')(offeringService)
);

app.use(
  '/api/bundles',
  require('./controller/BundleController')(bundleService)
);

app.listen(port, () => {
  logger.info(`Application listening at port ${port}`);
});
