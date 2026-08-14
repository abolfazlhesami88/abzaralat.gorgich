import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSearchVector1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

      CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING GIN(search_vector);

      CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          setweight(to_tsvector('simple', coalesce(NEW.sku, '')), 'A') ||
          setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') ||
          setweight(to_tsvector('simple', coalesce(NEW.short_description, '')), 'B') ||
          setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'C');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
      CREATE TRIGGER products_search_vector_trigger
        BEFORE INSERT OR UPDATE ON products
        FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

      -- Update existing records
      UPDATE products SET search_vector =
        setweight(to_tsvector('simple', coalesce(sku, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(short_description, '')), 'B') ||
        setweight(to_tsvector('simple', coalesce(description, '')), 'C');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS products_search_vector_trigger ON products`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS products_search_vector_update`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_products_search_vector`);
    await queryRunner.query(`ALTER TABLE products DROP COLUMN IF EXISTS search_vector`);
  }
}
