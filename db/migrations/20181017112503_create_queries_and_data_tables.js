
exports.up = function(knex, Promise) {
  return knex.schema.createTable('queries', table => {
    table.increments('id').primary();
    table.string('queryId').notNullable();
    table.text('sql').notNullable();
    table.integer('status', 1).unsigned().notNullable();
    table.timestamp('received').defaultTo(knex.fn.now());
    table.timestamp('query_time').notNullable();
    table.timestamp('query_executed').nullable().defaultTo(null);
  }).createTable('cryptik', table => {
    table.increments('id').primary();
    table.string('primary').nullable();
    table.string('secondary').nullable();
    table.decimal('price', 10, 0).nullable();
    table.integer('marketcap', 3).unsigned().nullable();
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('queries').dropTable('cryptik');
};
