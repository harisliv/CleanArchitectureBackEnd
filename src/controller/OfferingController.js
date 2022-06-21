const router = require('express').Router();
const asyncErrorHandler = require('../utils/asyncErrorHandler');

module.exports = (offeringService) => {
  router.get(
    '/list',
    asyncErrorHandler(async (req, res) => {
      res.json(await offeringService.list());
    })
  );

  router.post(
    '/add',
    asyncErrorHandler(async (req, res) => {
      res.json(await offeringService.create(req.body.name, req.body.price));
    })
  );

  router.post(
    '/update',
    asyncErrorHandler(async (req, res) => {
      res.json(
        await offeringService.update(req.body.id, req.body.name, req.body.price)
      );
    })
  );

  router.post(
    '/remove',
    asyncErrorHandler(async (req, res) => {
      res.json(await offeringService.delete(req.body.id));
    })
  );

  return router;
};
