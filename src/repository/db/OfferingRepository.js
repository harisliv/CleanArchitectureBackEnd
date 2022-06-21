/* eslint-disable no-param-reassign */
const { pool: pgPool } = require('./pgPool');
const { Offering } = require('../../model/Offering');

class OfferingRepository {
  constructor(pool = pgPool) {
    this.pool = pool;
  }

  create = async (entity) => {
    if (!entity) {
      throw new Error(`Entity must not be null or undefined: ${entity}`);
    }
    const result = await this.pool.query(
      'insert into offering (name, price) values ($1, $2) returning id',
      [entity.name, entity.price]
    );
    entity.id = result.rows[0].id;
    return entity;
  };

  retrieve = async (id) => {
    const result = await this.pool.query(
      'select * from offering where id = $1',
      [id]
    );
    if (result.rows.length < 1) {
      throw new Error(
        `Cannot find entity with id ${id}`
      );
    }
    return OfferingRepository.#rowToEntity(result.rows[0]);
  };

  retrieveByName = async (name) => {
    const result = await this.pool.query(
      'select * from offering where name = $1',
      [name]
    );
    if (result.rows.length < 1) {
      throw new Error(`Cannot find entity with name ${name}`);
    }
    return OfferingRepository.#rowToEntity(result.rows[0]);
  };

  list = async () => {
    const result = await this.pool.query('select * from offering');
    return result.rows.map((row) => OfferingRepository.#rowToEntity(row));
  };

  update = async (entity) => {
    if (!entity || entity.id === null || entity.id === undefined) {
      throw new Error(`Entity is null or entity.id is null: ${entity}`);
    }
    const result = await this.pool.query(
      'update offering set name = $1, price = $2 where id = $3',
      [entity.name, entity.price, entity.id]
    );
    if (result.rowCount !== 1) {
      throw new Error(
        `Cannot find entity with id ${entity.id}, rowCount=${result.rowCount}`
      );
    }
    return entity;
  };

  delete = async (entity) => {
    if (!entity || entity.id === null || entity.id === undefined) {
      throw new Error(`Entity is null or entity.id is null: ${entity}`);
    }
    const result = await this.pool.query('delete from offering where id = $1', [
      entity.id
    ]);
    if (result.rowCount !== 1) {
      throw new Error(
        `Cannot find entity with id ${entity.id}, delete returned rowCount=${result.rowCount}`
      );
    }
  };

  static #rowToEntity = (row) =>
    new Offering({
      id: row.id,
      name: row.name,
      price: parseInt(row.price, 10)
    });
}

module.exports = {
  OfferingRepository
};
