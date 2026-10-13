/*
  Warnings:

  - You are about to drop the column `tanggalKadaluara` on the `obat` table. All the data in the column will be lost.
  - Added the required column `tanggalKadaluarsa` to the `obat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `obat` DROP COLUMN `tanggalKadaluara`,
    ADD COLUMN `tanggalKadaluarsa` DATE NOT NULL;
