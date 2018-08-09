
exports.up = function(knex, Promise) {
  return knex.schema.table('users', table=>{
    table.string('password', 64).notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', table=>{
    table.dropColumn('password');
  })
};
