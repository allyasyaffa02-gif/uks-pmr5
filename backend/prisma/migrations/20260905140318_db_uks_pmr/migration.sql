-- CreateTable
CREATE TABLE `master_kategori` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pasien` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `kelas` VARCHAR(10) NOT NULL,
    `kategori_id` BIGINT NOT NULL,
    `date` DATE NOT NULL,
    `time` VARCHAR(10) NOT NULL,
    `keluhan` TEXT NOT NULL,
    `penanganan` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pasien` ADD CONSTRAINT `pasien_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `master_kategori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
