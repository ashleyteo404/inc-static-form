/*
  Warnings:

  - You are about to drop the column `value` on the `FormAnswer` table. All the data in the column will be lost.

*/
-- AlterSequence
ALTER SEQUENCE "FormSection_sectionOrder_seq" MAXVALUE 9223372036854775807;

-- AlterTable
ALTER TABLE "FormAnswer" DROP COLUMN "value";
ALTER TABLE "FormAnswer" ADD COLUMN     "answer" JSONB;
