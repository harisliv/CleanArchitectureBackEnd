const seeder = (subscriptionService, offeringService, bundleService) => ({
  run: async () => {
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
    await Promise.all([
      offeringService.create('nova', 300),
      offeringService.create('forthnet', 250)
    ]);
    await bundleService.create('superpack', 500, ['nova', 'forthnet']);
    await subscriptionService.subscribeUser('user1', 'nova');
  }
});

module.exports = {
  seeder
};
