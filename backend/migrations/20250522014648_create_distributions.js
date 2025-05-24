/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("distributions", function (table) {
    table.increments("id").primary();
    table.string("kode");
    table.string("penerima");
    table.string("tipe");
    table.text("link");
    table.text("isi");
    table.string("token").unique();
    table.string("status");
    table.timestamp("tanggal_terima");
    table.string("pdf_path");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("distributions");
};
