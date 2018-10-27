import * as Knex from 'knex';
export const up = function(knex: Knex, Promise) {
  return knex.schema.createTable('queries', table => {
    table.increments('id').primary();
    table.string('queryId', 255).notNullable();
    table.text('sql').notNullable();
    table.integer('status').unsigned().notNullable();
    table.timestamp('received').defaultTo(knex.fn.now());
    table.timestamp('query_time').notNullable();
    table.timestamp('query_executed').nullable().defaultTo(null);
    table.text('message').nullable().defaultTo(null);
  }).createTable('cryptik', table => {
    table.increments('id').primary();
    table.string('primary').nullable();
    table.string('secondary').nullable();
    table.decimal('price', 15, 5).unsigned().nullable();
    table.decimal('marketcap', 20, 5).unsigned().nullable();
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    table.unique(['primary', 'secondary', 'timestamp']);
  });
};

export const down = function(knex, Promise) {
  return knex.schema.dropTable('queries').dropTable('cryptik');
};
