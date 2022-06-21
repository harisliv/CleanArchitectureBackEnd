const { OfferingService } = require('./OfferingConfigurationService');
const { OfferingRepository } = require('../repository/db/OfferingRepository');
const { BundleService } = require('./BundleConfigurationService');
const { BundleRepository } = require('../repository/db/BundleRepository');
const { pool } = require('../repository/db/pgPool');
const { Bundle } = require('../model/Bundle');

const offeringRepository = new OfferingRepository();
const bundleRepository = new BundleRepository();
const offeringService = new OfferingService(offeringRepository);
const bundleService = new BundleService(bundleRepository, offeringRepository);

const bundleComparator = (a, b) => a.id - b.id;

beforeAll(async () => {
  await pool.query('truncate table offering restart identity cascade');
  await offeringService.create(`test offering 1`, 100);
  await offeringService.create(`test offering 2`, 100);
  await offeringService.create(`test offering 3`, 100);
  await offeringService.create(`test offering 4`, 100);
});

beforeEach(async () => {
  await pool.query('truncate table bundle_offering restart identity cascade');
  await pool.query('truncate table bundle restart identity cascade');
});

afterAll(() => {
  pool.end();
});

describe('Bundle Service', () => {
  it('generates a unique id when a bundle is created', async () => {
    const bundle1 = await bundleService.create('test bundle 1', 100, [
      'test offering 1'
    ]);
    expect(bundle1).toBeInstanceOf(Bundle);
    expect(bundle1.id).toBe(1);
    const offering2 = await bundleService.create('test bundle 2', 100, [
      'test offering 1'
    ]);
    expect(offering2.id).toBe(2);
  });

  it('retrieves the bundle by id after a bundle without any offerings is created', async () => {
    const bundle = await bundleService.create('test bundle 1', 100);
    const retrievedBundle = await bundleService.retrieve(bundle.id);
    expect(retrievedBundle).toBeInstanceOf(Bundle);
    expect(JSON.stringify(bundle)).toBe(JSON.stringify(retrievedBundle));
  });

  it('retrieves the bundle by id after a bundle with existing offerings is created', async () => {
    const bundle = await bundleService.create('test bundle 1', 100, [
      'test offering 1',
      'test offering 2'
    ]);
    const retrievedBundle = await bundleService.retrieve(bundle.id);
    expect(retrievedBundle).toBeInstanceOf(Bundle);
    expect(JSON.stringify(bundle)).toBe(JSON.stringify(retrievedBundle));
    expect(bundle.offerings).toStrictEqual([
      await offeringRepository.retrieveByName('test offering 1'),
      await offeringRepository.retrieveByName('test offering 2')
    ]);
  });

  it('throws an error when trying to create a bundle with non existent offerings', async () => {
    await expect(() =>
      bundleService.create('test bundle 1', 100, [
        'test offering 1',
        'test offering -2'
      ])
    ).rejects.toThrowError('Cannot find entity with name');
  });

  it('throws error when retrieving non existent bundle', async () => {
    await expect(() => bundleService.retrieve(-1)).rejects.toThrowError(
      'Cannot find entity with id'
    );
  });

  it('returns empty list when no entities exist', async () => {
    const list = await bundleService.list();
    expect(list).toEqual([]);
  });

  it('returns the list of all existing entities', async () => {
    const bundle1 = await bundleService.create('test bundle 1', 100);
    const bundle2 = await bundleService.create('test bundle 2', 100);
    const list = await bundleService.list();
    expect(JSON.stringify(list.sort(bundleComparator))).toBe(
      JSON.stringify([bundle1, bundle2])
    );
  });

  it('updates all fields of an existing entity by id', async () => {
    const bundle = await bundleService.create('test bundle 1', 100, [
      'test offering 1',
      'test offering 2',
      'test offering 3'
    ]);
    const updated = await bundleService.update(
      bundle.id,
      'test bundle 1 updated',
      110,
      ['test offering 1', 'test offering 4']
    );
    expect(updated).toBeInstanceOf(Bundle);
    const expected = new Bundle({
      id: bundle.id,
      name: 'test bundle 1 updated',
      price: 110,
      offerings: [
        await offeringRepository.retrieveByName('test offering 1'),
        await offeringRepository.retrieveByName('test offering 4')
      ]
    });
    expect(JSON.stringify(updated)).toBe(JSON.stringify(expected));
    const retrieved = await bundleService.retrieve(bundle.id);
    expect(JSON.stringify(retrieved)).toStrictEqual(JSON.stringify(expected));
  });

  it('updates a bundle by removing all offering', async () => {
    const bundle = await bundleService.create('test bundle 1', 100);
    const updated = await bundleService.update(bundle.id, 'test bundle 1', 110);
    expect(updated).toBeInstanceOf(Bundle);
    const expected = new Bundle({
      id: bundle.id,
      name: 'test bundle 1',
      price: 110
    });
    expect(JSON.stringify(updated)).toBe(JSON.stringify(expected));
    const retrieved = await bundleService.retrieve(bundle.id);
    expect(JSON.stringify(retrieved)).toStrictEqual(JSON.stringify(expected));
  });

  it('throws error when trying to update non existing entity', async () => {
    await expect(() => bundleService.update(-1, '', 0)).rejects.toThrowError(
      'Cannot find entity with id'
    );
  });

  it('deletes an existing entity by id', async () => {
    const bundle = await bundleService.create('test bundle 1', 100);
    await bundleService.retrieve(bundle.id);
    await bundleService.delete(bundle.id);
    await expect(() => bundleService.retrieve(-1)).rejects.toThrowError(
      'Cannot find entity with id'
    );
  });
});
