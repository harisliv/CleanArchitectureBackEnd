const router = require('express').Router();
const asyncErrorHandler = require('../utils/asyncErrorHandler');

module.exports = (subscriptionService) => {
  router.get(
    '/:userId/list',
    asyncErrorHandler(async (req, res) => {
      // convert from domain model to custom JSON if needed
      res.json(await subscriptionService.listByUserId(req.params.userId));
    })
  );

  router.post(
    '/:userId/subscribe',
    asyncErrorHandler(async (req, res) => {
      res.json(
        await subscriptionService.subscribeUser(
          req.params.userId,
          req.body.offeringName,
          req.body.type
        )
      );
    })
  );

  router.post(
    '/:userId/unsubscribe',
    asyncErrorHandler(async (req, res) => {
      res.json(
        await subscriptionService.unsubscribeUser(
          req.params.userId,
          req.body.offeringName
        )
      );
    })
  );

  return router;
};
