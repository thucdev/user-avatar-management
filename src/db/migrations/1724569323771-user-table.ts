import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1724569323771 implements MigrationInterface {
    name = 'UserTable1724569323771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-avatar"."user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "external_id" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_415c35b9b3b6fe45a3b065030f" ON "user-avatar"."user_entity" ("email") `);
        await queryRunner.query(`CREATE TABLE "user-avatar"."avatar_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "image_hash" character varying NOT NULL, "file_path" character varying NOT NULL, "user_id" uuid, CONSTRAINT "REL_642017bfef17085256e353b699" UNIQUE ("user_id"), CONSTRAINT "PK_b3ad7cac7c03911490f4ed9b587" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user-avatar"."avatar_entity" ADD CONSTRAINT "FK_642017bfef17085256e353b6998" FOREIGN KEY ("user_id") REFERENCES "user-avatar"."user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-avatar"."avatar_entity" DROP CONSTRAINT "FK_642017bfef17085256e353b6998"`);
        await queryRunner.query(`DROP TABLE "user-avatar"."avatar_entity"`);
        await queryRunner.query(`DROP INDEX "user-avatar"."IDX_415c35b9b3b6fe45a3b065030f"`);
        await queryRunner.query(`DROP TABLE "user-avatar"."user_entity"`);
    }

}
