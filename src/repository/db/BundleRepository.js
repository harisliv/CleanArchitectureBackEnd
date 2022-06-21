/* eslint-disable no-param-reassign */
// const logger = require('../../logger');
const { pool: pgPool } = require('./pgPool');
const { Offering } = require('../../model/Offering');
const { Bundle } = require('../../model/Bundle');

class BundleRepository {
  constructor(pool = pgPool) {
    this.pool = pool;
  }

  create = async (entity) => {
    if (!entity) {
      throw new Error(`Entity must not be null or undefined: ${entity}`);
    }
    const result = await this.pool.query(
      'insert into bundle (name, price) values ($1, $2) returning id',
      [entity.name, entity.price]
    );
    entity.id = result.rows[0].id;
    await this.#insertBundleOfferings(entity);
    return entity;
  };

  #LIST_ALL_SQL = `select b.id b_id, 
          b.name b_name, 
          b.price b_price,
          o.id o_id,
          o.name o_name,
          o.price o_price
    from  bundle as b
    left join bundle_offering bo on bo.bundle_id = b.id
    left join offering o on bo.offering_id = o.id`;

  retrieve = async (id) => {
    const result = await this.pool.query(
      `${this.#LIST_ALL_SQL} where b.id = $1`,
      [id]
    );
    if (result.rows.length < 1) {
      throw new Error(`Cannot find entity with id ${id}`);
    }
    return BundleRepository.#rowsToEntities(result.rows)[0];
  };

  retrieveByName = async (name) => {
    const result = await this.pool.query(
      `${this.#LIST_ALL_SQL} where b.name = $1`,
      [name]
    );
    if (result.rows.length < 1) {
      throw new Error(`Cannot find entity with name ${name}`);
    }
    return BundleRepository.#rowsToEntities(result.rows)[0];
  };

  list = async () => {
    const result = await this.pool.query(this.#LIST_ALL_SQL);
    return BundleRepository.#rowsToEntities(result.rows);
  };

  update = async (entity) => {
    // TODO add transaction
    if (!entity || entity.id === null || entity.id === undefined) {
      throw new Error(`Entity is null or entity.id is null: ${JSON.stringify(entity)}`);
    }
    const result = await this.pool.query(
      'update bundle set name = $1, price = $2 where id = $3',
      [entity.name, entity.price, entity.id]
    );
    if (result.rowCount !== 1) {
      throw new Error(
        `Cannot find entity with id ${entity.id}, rowCount=${result.rowCount}`
      );
    }
    await this.#deleteBundleOfferings(entity);
    await this.#insertBundleOfferings(entity);
    return entity;
  };

  delete = async (entity) => {
    // TODO add transaction
    if (!entity || entity.id === null || entity.id === undefined) {
      throw new Error(`Entity is null or entity.id is null: ${entity}`);
    }
    await this.#deleteBundleOfferings(entity);
    const result = await this.pool.query('delete from bundle where id = $1', [
      entity.id
    ]);
    if (result.rowCount !== 1) {
      throw new Error(
        `Cannot find entity with id ${entity.id}, delete returned rowCount=${result.rowCount}`
      );
    }
  };

  #insertBundleOfferings = async (entity) =>
    Promise.all(
      entity.offerings.map((offering) =>
        this.pool.query(
          'insert into bundle_offering (bundle_id, offering_id) values ($1, $2)',
          [entity.id, offering.id]
        )
      )
    );

  #deleteBundleOfferings = async (entity) =>
    this.pool.query('delete from bundle_offering where bundle_id = $1', [
      entity.id
    ]);

  static #rowsToEntities = (rows) => {
    const bundles = new Map();
    rows.forEach((row) => {
      const bundle =
        bundles.get(row.b_id) ||
        new Bundle({
          id: row.b_id,
          name: row.b_name,
          price: parseInt(row.b_price, 10)
        });

      if (row.o_id !== null && row.o_id !== undefined) {
        bundle.addOfferings([
          new Offering({
            id: row.o_id,
            name: row.o_name,
            price: parseInt(row.o_price, 10)
          })
        ]);
      }

      bundles.set(row.b_id, bundle);
    });
    return [...bundles.values()];
  };
}

module.exports = {
  BundleRepository
};
