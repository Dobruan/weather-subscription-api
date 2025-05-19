import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastSentAtToSubscription1747590065990 implements MigrationInterface {
    name = 'AddLastSentAtToSubscription1747590065990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" ADD "lastSentAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "lastSentAt"`);
    }

}
