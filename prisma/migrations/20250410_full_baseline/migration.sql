-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "BlogAuthor" DROP CONSTRAINT "User_BlogAuthor";

-- DropForeignKey
ALTER TABLE "BlogComment" DROP CONSTRAINT "BlogComment_postId_fkey";

-- DropForeignKey
ALTER TABLE "BlogComment" DROP CONSTRAINT "BlogComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "BlogRating" DROP CONSTRAINT "BlogRating_postId_fkey";

-- DropForeignKey
ALTER TABLE "BlogRating" DROP CONSTRAINT "BlogRating_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "ClassComment" DROP CONSTRAINT "ClassComment_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassComment" DROP CONSTRAINT "ClassComment_parentCommentId_fkey";

-- DropForeignKey
ALTER TABLE "ClassComment" DROP CONSTRAINT "ClassComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClassProgress" DROP CONSTRAINT "ClassProgress_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassProgress" DROP CONSTRAINT "ClassProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClassResource" DROP CONSTRAINT "ClassResource_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassroomEnrollment" DROP CONSTRAINT "ClassroomEnrollment_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "ClassroomEnrollment" DROP CONSTRAINT "ClassroomEnrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Empresa" DROP CONSTRAINT "Empresa_userId_fkey";

-- DropForeignKey
ALTER TABLE "EmpresaSubscription" DROP CONSTRAINT "EmpresaSubscription_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "EmpresaSubscription" DROP CONSTRAINT "EmpresaSubscription_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_leadingCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "EventBrand" DROP CONSTRAINT "EventBrand_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventEnrollment" DROP CONSTRAINT "EventEnrollment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventEnrollment" DROP CONSTRAINT "EventEnrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventOrganizer" DROP CONSTRAINT "EventOrganizer_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventStream" DROP CONSTRAINT "EventStream_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventStreamEnrollment" DROP CONSTRAINT "EventStreamEnrollment_eventStreamId_fkey";

-- DropForeignKey
ALTER TABLE "EventStreamEnrollment" DROP CONSTRAINT "EventStreamEnrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Instructor" DROP CONSTRAINT "Instructor_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Instructor" DROP CONSTRAINT "Instructor_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Instructor" DROP CONSTRAINT "Instructor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Medico" DROP CONSTRAINT "Medico_userId_fkey";

-- DropForeignKey
ALTER TABLE "Minisite" DROP CONSTRAINT "Minisite_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "MinisiteBenefit" DROP CONSTRAINT "MinisiteBenefit_minisiteId_fkey";

-- DropForeignKey
ALTER TABLE "MinisiteFeaturedProduct" DROP CONSTRAINT "MinisiteFeaturedProduct_minisiteId_fkey";

-- DropForeignKey
ALTER TABLE "MinisiteFeaturedProduct" DROP CONSTRAINT "MinisiteFeaturedProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "MinisiteHighlightProduct" DROP CONSTRAINT "MinisiteHighlightProduct_minisiteId_fkey";

-- DropForeignKey
ALTER TABLE "MinisiteHighlightProduct" DROP CONSTRAINT "MinisiteHighlightProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "MinisiteOffer" DROP CONSTRAINT "MinisiteOffer_minisiteId_fkey";

-- DropForeignKey
ALTER TABLE "MinisiteOfferProduct" DROP CONSTRAINT "MinisiteOfferProduct_offerId_fkey";

-- DropForeignKey
ALTER TABLE "MinisiteSlide" DROP CONSTRAINT "MinisiteSlide_minisiteId_fkey";

-- DropForeignKey
ALTER TABLE "MinisiteSpeciality" DROP CONSTRAINT "MinisiteSpeciality_minisiteId_fkey";

-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Presentation" DROP CONSTRAINT "Presentation_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCompanyCategory" DROP CONSTRAINT "ProductCompanyCategory_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Workshop" DROP CONSTRAINT "Workshop_eventId_fkey";

-- DropForeignKey
ALTER TABLE "WorkshopEnrollment" DROP CONSTRAINT "WorkshopEnrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkshopEnrollment" DROP CONSTRAINT "WorkshopEnrollment_workshopId_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostCategories" DROP CONSTRAINT "_BlogPostCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostCategories" DROP CONSTRAINT "_BlogPostCategories_B_fkey";

-- DropForeignKey
ALTER TABLE "_ClassroomAttendees" DROP CONSTRAINT "_ClassroomAttendees_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassroomAttendees" DROP CONSTRAINT "_ClassroomAttendees_B_fkey";

-- DropForeignKey
ALTER TABLE "_ClassroomInstructors" DROP CONSTRAINT "_ClassroomInstructors_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassroomInstructors" DROP CONSTRAINT "_ClassroomInstructors_B_fkey";

-- DropForeignKey
ALTER TABLE "_EventAttendees" DROP CONSTRAINT "_EventAttendees_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventAttendees" DROP CONSTRAINT "_EventAttendees_B_fkey";

-- DropForeignKey
ALTER TABLE "_EventStreamAttendees" DROP CONSTRAINT "_EventStreamAttendees_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventStreamAttendees" DROP CONSTRAINT "_EventStreamAttendees_B_fkey";

-- DropForeignKey
ALTER TABLE "_StreamOrators" DROP CONSTRAINT "_StreamOrators_A_fkey";

-- DropForeignKey
ALTER TABLE "_StreamOrators" DROP CONSTRAINT "_StreamOrators_B_fkey";

-- DropForeignKey
ALTER TABLE "_WorkshopAttendees" DROP CONSTRAINT "_WorkshopAttendees_A_fkey";

-- DropForeignKey
ALTER TABLE "_WorkshopAttendees" DROP CONSTRAINT "_WorkshopAttendees_B_fkey";

-- DropForeignKey
ALTER TABLE "_WorkshopInstructors" DROP CONSTRAINT "_WorkshopInstructors_A_fkey";

-- DropForeignKey
ALTER TABLE "_WorkshopInstructors" DROP CONSTRAINT "_WorkshopInstructors_B_fkey";

-- DropTable
DROP TABLE "Banner";

-- DropTable
DROP TABLE "BlogAuthor";

-- DropTable
DROP TABLE "BlogCategory";

-- DropTable
DROP TABLE "BlogComment";

-- DropTable
DROP TABLE "BlogPost";

-- DropTable
DROP TABLE "BlogRating";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "ChatRoom";

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "ClassComment";

-- DropTable
DROP TABLE "ClassProgress";

-- DropTable
DROP TABLE "ClassResource";

-- DropTable
DROP TABLE "Classroom";

-- DropTable
DROP TABLE "ClassroomEnrollment";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "CourseEnrollment";

-- DropTable
DROP TABLE "Empresa";

-- DropTable
DROP TABLE "EmpresaSubscription";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventBrand";

-- DropTable
DROP TABLE "EventEnrollment";

-- DropTable
DROP TABLE "EventOrganizer";

-- DropTable
DROP TABLE "EventStream";

-- DropTable
DROP TABLE "EventStreamEnrollment";

-- DropTable
DROP TABLE "Instructor";

-- DropTable
DROP TABLE "Medico";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Minisite";

-- DropTable
DROP TABLE "MinisiteBenefit";

-- DropTable
DROP TABLE "MinisiteFeaturedProduct";

-- DropTable
DROP TABLE "MinisiteHighlightProduct";

-- DropTable
DROP TABLE "MinisiteOffer";

-- DropTable
DROP TABLE "MinisiteOfferProduct";

-- DropTable
DROP TABLE "MinisiteSlide";

-- DropTable
DROP TABLE "MinisiteSpeciality";

-- DropTable
DROP TABLE "Module";

-- DropTable
DROP TABLE "PasswordReset";

-- DropTable
DROP TABLE "Presentation";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductCompanyCategory";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Workshop";

-- DropTable
DROP TABLE "WorkshopEnrollment";

-- DropTable
DROP TABLE "_BlogPostCategories";

-- DropTable
DROP TABLE "_ClassroomAttendees";

-- DropTable
DROP TABLE "_ClassroomInstructors";

-- DropTable
DROP TABLE "_EventAttendees";

-- DropTable
DROP TABLE "_EventStreamAttendees";

-- DropTable
DROP TABLE "_StreamOrators";

-- DropTable
DROP TABLE "_WorkshopAttendees";

-- DropTable
DROP TABLE "_WorkshopInstructors";

-- DropEnum
DROP TYPE "ChatEntityType";

-- DropEnum
DROP TYPE "CommentType";

-- DropEnum
DROP TYPE "EmpresaCategory";

-- DropEnum
DROP TYPE "Giro";

-- DropEnum
DROP TYPE "MessageType";

-- DropEnum
DROP TYPE "Profession";

-- DropEnum
DROP TYPE "ProfessionType";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "SubscriptionType";

-- DropEnum
DROP TYPE "Target";

-- DropEnum
DROP TYPE "Unit";

