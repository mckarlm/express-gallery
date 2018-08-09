
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table=>{
    table.increments();
    table.string('username', 16).unique().notNullable();
    table.string('password', 16).notNullable();
    table.string('email', 48).unique();
    table.string('full_name', 48);
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
