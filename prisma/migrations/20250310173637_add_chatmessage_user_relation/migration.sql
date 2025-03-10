-- AlterTable
ALTER TABLE "ChatMessage" ALTER COLUMN "userId" SET DEFAULT 'user-001';

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
