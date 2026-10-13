-- CreateTable
CREATE TABLE `pasian_obat` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `pasien_id` BIGINT NOT NULL,
    `obat_id` BIGINT NOT NULL,
    `jumlah` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `obat` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `tanggalBeli` DATE NOT NULL,
    `tanggalKadaluara` DATE NOT NULL,
    `stok` BIGINT NOT NULL DEFAULT 0,
    `satuan` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pasian_obat` ADD CONSTRAINT `pasian_obat_pasien_id_fkey` FOREIGN KEY (`pasien_id`) REFERENCES `pasien`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pasian_obat` ADD CONSTRAINT `pasian_obat_obat_id_fkey` FOREIGN KEY (`obat_id`) REFERENCES `obat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
