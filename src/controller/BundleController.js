const router = require('express').Router();
const asyncErrorHandler = require('../utils/asyncErrorHandler');

module.exports = (bundleService) => {
  router.get(
    '/list',
    asyncErrorHandler(async (req, res) => {
      res.json(await bundleService.list());
    })
  );

  router.post(
    '/add',
    asyncErrorHandler(async (req, res) => {
      res.json(
        await bundleService.create(
          req.body.name,
          req.body.price,
          req.body.offerings
        )
      );
    })
  );

  router.post(
    '/update',
    asyncErrorHandler(async (req, res) => {
      res.json(
        await bundleService.update(
          req.body.id,
          req.body.name,
          req.body.price,
          req.body.offerings
        )
      );
    })
  );

  router.post(
    '/remove',
    asyncErrorHandler(async (req, res) => {
      res.json(await bundleService.delete(req.body.id));
    })
  );

  return router;
};
