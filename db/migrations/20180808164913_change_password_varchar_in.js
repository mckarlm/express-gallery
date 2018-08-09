
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('password');
    table.string('password', 64).notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('password');
    table.string('password', 16).notNullable();
  })
};
