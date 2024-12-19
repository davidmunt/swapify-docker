import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsToInventari1683456789012 implements MigrationInterface {
  name = 'AddColumnsToInventari1683456789012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`tokenExpiration\` DATETIME NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`token\` VARCHAR(64) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`password\` VARCHAR(40) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`token\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`tokenExpiration\``,
    );
  }
}
