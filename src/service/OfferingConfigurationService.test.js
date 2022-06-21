const { OfferingService } = require('./OfferingConfigurationService');
const { OfferingRepository } = require('../repository/db/OfferingRepository');
const { pool } = require('../repository/db/pgPool');
const { Offering } = require('../model/Offering');

const offeringService = new OfferingService(new OfferingRepository());

beforeEach(async () => {
  await pool.query('truncate table offering restart identity cascade');
});

afterAll(() => {
  pool.end();
});

describe('Offering Service', () => {
  it('generates a unique id when an entity is created', async () => {
    const offering1 = await offeringService.create('test offering 1', 100);
    expect(offering1).toBeInstanceOf(Offering);
    expect(offering1.id).toBe(1);
    const offering2 = await offeringService.create('test offering 2', 100);
    expect(offering2.id).toBe(2);
  });

  it('retrieves the entity by id after an entity is created', async () => {
    const offering = await offeringService.create('test offering 1', 100);
    const retrievedOffering = await offeringService.retrieve(offering.id);
    expect(retrievedOffering).toBeInstanceOf(Offering);
    expect(offering).toStrictEqual(retrievedOffering);
  });

  it('throws error when retrieving non existent entity', async () => {
    await expect(() => offeringService.retrieve(-1)).rejects.toThrowError(
      'Cannot find entity with id'
    );
  });

  it('returns empty list when no entities exist', async () => {
    const list = await offeringService.list();
    expect(list).toEqual([]);
  });

  it('returns the list of all existing entities', async () => {
    const offering1 = await offeringService.create('test offering 1', 100);
    const offering2 = await offeringService.create('test offering 2', 100);
    const list = await offeringService.list();
    expect(list.sort((a, b) => a.id - b.id)).toStrictEqual([
      offering1,
      offering2
    ]);
  });

  it('updates all fields of an existing entity by id', async () => {
    const offering = await offeringService.create('test offering 1', 100);
    const updated = await offeringService.update(
      offering.id,
      'test offering 1 updated',
      110
    );
    expect(updated).toBeInstanceOf(Offering);
    const expected = new Offering({
      id: offering.id,
      name: 'test offering 1 updated',
      price: 110
    });
    expect(updated).toStrictEqual(expected);
    const retrieved = await offeringService.retrieve(offering.id);
    expect(retrieved).toStrictEqual(expected);
  });

  it('throws error when trying to update non existing entity', async () => {
    await expect(() => offeringService.update(-1, '', 0)).rejects.toThrowError(
      'Cannot find entity with id'
    );
  });

  it('deletes an existing entity by id', async () => {
    const offering = await offeringService.create('test offering 1', 100);
    await offeringService.retrieve(offering.id);
    await offeringService.delete(offering.id);
    await expect(() => offeringService.retrieve(-1)).rejects.toThrowError(
      'Cannot find entity with id'
    );
  });
});
