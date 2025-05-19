import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscriptionTable1747338049631 implements MigrationInterface {
    name = 'CreateSubscriptionTable1747338049631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscription_frequency_enum" AS ENUM('hourly', 'daily')`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "city" character varying NOT NULL, "frequency" "public"."subscription_frequency_enum" NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "confirmationToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ba857f4e5d61b74f184c26de3c4" UNIQUE ("email"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_frequency_enum"`);
    }

}
