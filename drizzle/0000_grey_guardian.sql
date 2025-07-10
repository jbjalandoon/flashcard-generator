CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `cards` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`flashcardId` bigint NOT NULL,
	`question` varchar(255) NOT NULL,
	`answer` varchar(255) NOT NULL,
	CONSTRAINT `cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flashcardSubjects` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`flashcardId` bigint NOT NULL,
	`subject` varchar(255) NOT NULL,
	CONSTRAINT `flashcardSubjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flashcards` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`createdBy` varchar(255) DEFAULT NULL,
	`createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `flashcards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT CURRENT_TIMESTAMP(3),
	`image` varchar(255),
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verification_token` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verification_token_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cards` ADD CONSTRAINT `cards_flashcardId_flashcards_id_fk` FOREIGN KEY (`flashcardId`) REFERENCES `flashcards`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `flashcardSubjects` ADD CONSTRAINT `flashcardSubjects_flashcardId_flashcards_id_fk` FOREIGN KEY (`flashcardId`) REFERENCES `flashcards`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `flashcards` ADD CONSTRAINT `flashcards_createdBy_user_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `card_flashcard_id_idx` ON `cards` (`flashcardId`);--> statement-breakpoint
CREATE INDEX `flashcard_subject_idx` ON `flashcardSubjects` (`flashcardId`,`subject`);--> statement-breakpoint
CREATE INDEX `flashcard_user_id_idx` ON `flashcards` (`createdBy`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`userId`);