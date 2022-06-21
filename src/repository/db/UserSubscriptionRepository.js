/* eslint-disable no-param-reassign */
// const logger = require('../../logger');
const { pool: pgPool } = require('./pgPool');
const { Offering } = require('../../model/Offering');
const { Bundle } = require('../../model/Bundle');
const { UserSubscription } = require('../../model/UserSubscription');

class UserSubscriptionRepository {
  constructor(pool = pgPool) {
    this.pool = pool;
  }

  create = async (entity) => {
    if (!entity) {
      throw new Error(`Entity must not be null or undefined: ${entity}`);
    }
    const result = await this.pool.query(
      'insert into user_subscription (user_id, bundle_id, offering_id) values ($1, $2, $3) returning id',
      [
        entity.userId,
        entity.offering instanceof Bundle ? entity.offering.id : null,
        !(entity.offering instanceof Bundle) ? entity.offering.id : null
      ]
    );
    entity.id = result.rows[0].id;
    return entity;
  };

  #LIST_ALL_SQL = `select us.id, 
          us.user_id,
          b.id b_id, 
          b.name b_name, 
          b.price b_price,
          o.id o_id,
          o.name o_name,
          o.price o_price,
          o2.id o2_id,
          o2.name o2_name,
          o2.price o2_price
    from  user_subscription as us
    left join bundle b on us.bundle_id = b.id
    left join bundle_offering bo on bo.bundle_id = b.id
    left join offering o on bo.offering_id = o.id
    left join offering o2 on us.offering_id = o2.id`;

  retrieve = async (id) => {
    const result = await this.pool.query(
      `${this.#LIST_ALL_SQL} where us.id = $1`,
      [id]
    );
    if (result.rows.length < 1) {
      throw new Error(`Cannot find entity with id ${id}`);
    }
    return UserSubscriptionRepository.#rowsToEntities(result.rows)[0];
  };

  listByUserId = async (userId) => {
    const result = await this.pool.query(
      `${this.#LIST_ALL_SQL} where us.user_id = $1`,
      [userId]
    );
    return UserSubscriptionRepository.#rowsToEntities(result.rows);
  };

  list = async () => {
    const result = await this.pool.query(this.#LIST_ALL_SQL);
    return UserSubscriptionRepository.#rowsToEntities(result.rows);
  };

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  update = async (entity) => {
    throw new Error(
      `Unsupported operation, cannot update UserSubscription entity`
    );
  };

  delete = async (entity) => {
    // TODO add transaction
    if (!entity || entity.id === null || entity.id === undefined) {
      throw new Error(`Entity is null or entity.id is null: ${entity}`);
    }
    const result = await this.pool.query(
      'delete from user_subscription where id = $1',
      [entity.id]
    );
    if (result.rowCount !== 1) {
      throw new Error(
        `Cannot find entity with id ${entity.id}, delete returned rowCount=${result.rowCount}`
      );
    }
  };

  static #rowsToEntities = (rows) => {
    const userSubscriptions = new Map();
    rows.forEach((row) => {
      if (row.o2_id !== null && row.o2_id !== undefined) {
        const userSubscription = new UserSubscription({
          id: row.id,
          userId: row.user_id,
          offering: new Offering({
            id: row.o2_id,
            name: row.o2_name,
            price: parseInt(row.o2_price, 10)
          })
        });
        userSubscriptions.set(`_offering_${row.o2_id}`, userSubscription);
      } else {
        const userSubscription =
          userSubscriptions.get(`_bundle_${row.b_id}`) ||
          new UserSubscription({
            id: row.id,
            userId: row.user_id,
            offering: new Bundle({
              id: row.b_id,
              name: row.b_name,
              price: parseInt(row.b_price, 10)
            })
          });

        if (row.o_id !== null && row.o_id !== undefined) {
          userSubscription.offering.addOfferings([
            new Offering({
              id: row.o_id,
              name: row.o_name,
              price: parseInt(row.o_price, 10)
            })
          ]);
        }

        userSubscriptions.set(`_bundle_${row.b_id}`, userSubscription);
      }
    });
    return [...userSubscriptions.values()];
  };
}

module.exports = {
  UserSubscriptionRepository
};
