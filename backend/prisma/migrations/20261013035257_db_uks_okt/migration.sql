/*
  Warnings:

  - You are about to drop the column `satuan` on the `obat` table. All the data in the column will be lost.
  - Added the required column `satuan_id` to the `obat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `obat` DROP COLUMN `satuan`,
    ADD COLUMN `satuan_id` BIGINT NOT NULL;

-- CreateTable
CREATE TABLE `master_satuan_obat` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `obat` ADD CONSTRAINT `obat_satuan_id_fkey` FOREIGN KEY (`satuan_id`) REFERENCES `master_satuan_obat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
