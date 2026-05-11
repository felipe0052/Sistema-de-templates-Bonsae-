DROP TABLE IF EXISTS `able_edit_client_configs`;
CREATE TABLE `able_edit_client_configs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int NOT NULL,
  `able_edit` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `academic_classes`;
CREATE TABLE `academic_classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_period_id` int DEFAULT NULL,
  `name` text,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `course` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `is_exceptional` tinyint(1) DEFAULT '0',
  `period` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campus_id` int unsigned DEFAULT NULL,
  `integration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `academic_products`;
CREATE TABLE `academic_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `act_documents`;
CREATE TABLE `act_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `act_id` int unsigned NOT NULL,
  `team_id` int unsigned DEFAULT NULL,
  `correction_user_id` int DEFAULT NULL,
  `correction` tinyint(1) DEFAULT '0',
  `path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` text,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` text,
  `students_visibility` tinyint(1) NOT NULL DEFAULT '1',
  `is_academic` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `act_documents_user_id_index` (`user_id`),
  KEY `act_documents_act_id_index` (`act_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `act_extracts`;
CREATE TABLE `act_extracts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `act_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `correction` tinyint(1) DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `act_extracts_user_id_index` (`user_id`),
  KEY `act_extracts_act_id_index` (`act_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `act_feedback_documents`;
CREATE TABLE `act_feedback_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `act_feedback_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `creator_id` int unsigned DEFAULT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `act_feedback_documents_act_feedback_id_index` (`act_feedback_id`),
  KEY `act_feedback_documents_user_id_index` (`user_id`),
  KEY `act_feedback_documents_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `act_feedbacks`;
CREATE TABLE `act_feedbacks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `act_id` int DEFAULT NULL,
  `creator_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `feedback` longtext COLLATE utf8mb4_unicode_ci,
  `visualized_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `act_locals`;
CREATE TABLE `act_locals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `local` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `university` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `act_performed_acts`;
CREATE TABLE `act_performed_acts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `act_id` int unsigned NOT NULL,
  `performed_act_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `act_performed_acts_performed_act_id_index` (`performed_act_id`),
  KEY `act_performed_acts_act_id_index` (`act_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `act_responsibles`;
CREATE TABLE `act_responsibles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `act_id` int unsigned NOT NULL,
  `team_id` int DEFAULT NULL,
  `main_responsible` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `grade` double(8,2) DEFAULT NULL,
  `supervisor` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `act_responsibles_act_id_index` (`act_id`),
  KEY `act_responsibles_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `act_tasks`;
CREATE TABLE `act_tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `act_id` int unsigned NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `done` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `act_tasks_act_id_index` (`act_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `act_type_courses`;
CREATE TABLE `act_type_courses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `act_type_id` int unsigned DEFAULT NULL,
  `course_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `act_types`;
CREATE TABLE `act_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_old_bonsae` int DEFAULT NULL,
  `id_audora` int DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `act_first_lawsuit` tinyint(1) NOT NULL DEFAULT '0',
  `act_future_lawsuit` tinyint(1) NOT NULL DEFAULT '0',
  `appointment_type` tinyint(1) NOT NULL DEFAULT '0',
  `default_attendance_card` tinyint(1) NOT NULL DEFAULT '0',
  `default_return_card` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE `activity_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `log_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject_id` bigint unsigned DEFAULT NULL,
  `causer_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `causer_id` bigint unsigned DEFAULT NULL,
  `properties` json DEFAULT NULL,
  `batch_uuid` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subject` (`subject_type`,`subject_id`),
  KEY `causer` (`causer_type`,`causer_id`),
  KEY `activity_log_log_name_index` (`log_name`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `acts`;
CREATE TABLE `acts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_old_bonsae` int DEFAULT NULL,
  `id_audora` int DEFAULT NULL,
  `creator_id` int unsigned NOT NULL,
  `lawsuit_id` int unsigned NOT NULL,
  `event_id` int unsigned DEFAULT NULL,
  `act_type_id` int unsigned NOT NULL,
  `deadline_date` date DEFAULT NULL,
  `deadline_hour` time DEFAULT NULL,
  `description` longtext,
  `on_probation` tinyint(1) DEFAULT '0',
  `status` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'a cumprir, enviado ou concluido',
  `exclude_from_average` tinyint(1) NOT NULL DEFAULT '0',
  `conclusion_date` date DEFAULT NULL,
  `conclusion_hour` time DEFAULT NULL,
  `integration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_notifications` tinyint(1) NOT NULL DEFAULT '0',
  `videoconference` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `acts_lawsuit_id_index` (`lawsuit_id`),
  KEY `acts_creator_id_index` (`creator_id`),
  KEY `acts_act_type_id_index` (`act_type_id`),
  KEY `acts_event_id_index` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `client_id` int unsigned DEFAULT NULL,
  `opposing_party_id` int unsigned DEFAULT NULL,
  `event_id` int unsigned DEFAULT NULL,
  `practice_id` int unsigned DEFAULT NULL,
  `state_id` int unsigned DEFAULT NULL,
  `city_id` int unsigned DEFAULT NULL,
  `cep` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `neighborhood` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` decimal(10,7) DEFAULT NULL,
  `long` decimal(10,7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `addresses_user_id_index` (`user_id`),
  KEY `addresses_client_id_index` (`client_id`),
  KEY `addresses_opposing_party_id_index` (`opposing_party_id`),
  KEY `addresses_event_id_index` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `all_workloads`;
CREATE TABLE `all_workloads` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `school_period_id` int DEFAULT NULL,
  `curricular_unit_id` int unsigned DEFAULT NULL,
  `act_id` int DEFAULT NULL,
  `feedback` longtext COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_id` int DEFAULT NULL,
  `conclusion_status` tinyint(1) DEFAULT NULL,
  `practice_id` int DEFAULT NULL,
  `stage_id` int unsigned DEFAULT NULL,
  `session_id` int unsigned DEFAULT NULL,
  `shift_id` int DEFAULT NULL,
  `type` varchar(191) DEFAULT NULL,
  `workload` time DEFAULT NULL,
  `note` double(8,2) DEFAULT NULL,
  `concept` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `all_workloads_user_id_index` (`user_id`),
  KEY `all_workloads_school_period_id_index` (`school_period_id`),
  KEY `all_workloads_curricular_unit_id_index` (`curricular_unit_id`),
  KEY `all_workloads_act_id_index` (`act_id`),
  KEY `all_workloads_practice_id_index` (`practice_id`),
  KEY `all_workloads_stage_id_index` (`stage_id`),
  KEY `all_workloads_session_id_index` (`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `client_id` bigint unsigned NOT NULL,
  `lawsuit_id` int unsigned DEFAULT NULL,
  `creator_id` int DEFAULT NULL,
  `status` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` tinyint(1) DEFAULT '0',
  `return` tinyint(1) DEFAULT '0',
  `observations` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appointments_user_id_index` (`user_id`),
  KEY `appointments_client_id_index` (`client_id`),
  KEY `appointments_lawsuit_id_index` (`lawsuit_id`),
  KEY `appointments_creator_id_index` (`creator_id`),
  KEY `appointments_status_index` (`status`),
  CONSTRAINT `appointments_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `appointments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `attendances`;
CREATE TABLE `attendances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `act_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `protocol_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `calendar_type_permissions`;
CREATE TABLE `calendar_type_permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `calendar_type_id` int unsigned NOT NULL,
  `profile_id` int unsigned NOT NULL,
  `view` tinyint(1) NOT NULL DEFAULT '0',
  `create` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `calendar_types`;
CREATE TABLE `calendar_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_hour` int NOT NULL,
  `max_hour` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `campuses`;
CREATE TABLE `campuses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uf` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `certificate_feedbacks`;
CREATE TABLE `certificate_feedbacks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `certificate_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `feedback` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `certificate_users`;
CREATE TABLE `certificate_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_period_id` int unsigned DEFAULT NULL,
  `certificate_id` int unsigned NOT NULL,
  `has_type` tinyint(1) DEFAULT '1',
  `user_id` int unsigned NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Em análise',
  `workload` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `certificates`;
CREATE TABLE `certificates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type_document_id` int unsigned NOT NULL,
  `workload` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `cities`;
CREATE TABLE `cities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ibge_code` int DEFAULT NULL,
  `name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state_id` int DEFAULT NULL,
  `uf` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `longitude` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `client_documents`;
CREATE TABLE `client_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` text,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` text,
  `students_visibility` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_documents_client_id_index` (`client_id`),
  KEY `client_documents_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `client_lawsuit`;
CREATE TABLE `client_lawsuit` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lawsuit_id` int unsigned NOT NULL,
  `client_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_lawsuit_client_id_index` (`client_id`),
  KEY `client_lawsuit_lawsuit_id_index` (`lawsuit_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `client_opposing_representatives`;
CREATE TABLE `client_opposing_representatives` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lawsuit_id` int unsigned NOT NULL,
  `client_id` int unsigned DEFAULT NULL,
  `opposing_party_id` int unsigned DEFAULT NULL,
  `representative_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_opposing_representatives_client_id_index` (`client_id`),
  KEY `client_opposing_representatives_representative_id_index` (`representative_id`),
  KEY `client_opposing_representatives_lawsuit_id_index` (`lawsuit_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_number_internal` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_old_bonsae` int DEFAULT NULL,
  `id_audora` int DEFAULT NULL,
  `creator_id` int unsigned NOT NULL,
  `address_id` int unsigned DEFAULT NULL,
  `ethnicity_id` int DEFAULT NULL,
  `gender_id` int DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `social_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kind_of_person` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_under_age` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` tinyint(1) DEFAULT '0',
  `cpf` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cnpj` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_of_company` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state_subscription` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `local_subscription` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `voter_registration` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pis` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext,
  `rg` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issuing_body` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uf_issuing_body` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marital_status` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profession` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monthly_income` double(8,2) DEFAULT NULL,
  `dependents_number` int unsigned DEFAULT NULL,
  `nationality` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `naturalness` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone2` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_simulated` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `is_creation_finished` tinyint(1) DEFAULT '1',
  `original_lawsuit` int DEFAULT NULL,
  `integration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clients_creator_id_index` (`creator_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `competences`;
CREATE TABLE `competences` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uf` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `config_certificates`;
CREATE TABLE `config_certificates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `configs`;
CREATE TABLE `configs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `university` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instance` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instance_id` int DEFAULT NULL,
  `academic` tinyint(1) DEFAULT NULL,
  `attendance_folder` tinyint(1) DEFAULT NULL,
  `automate_card_event` tinyint(1) DEFAULT NULL,
  `double_deadline` tinyint(1) DEFAULT NULL,
  `students_access_restriction` tinyint(1) DEFAULT NULL,
  `students_access_school_period` tinyint(1) DEFAULT NULL,
  `students_access_time` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `configurations`;
CREATE TABLE `configurations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` int DEFAULT NULL,
  `url` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_profile` tinyint(1) NOT NULL DEFAULT '0',
  `profile` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `contract_universitys`;
CREATE TABLE `contract_universitys` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dado` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_group` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_university` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `contracts`;
CREATE TABLE `contracts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contract` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `polo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contract_file` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active_instance` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `court_oab`;
CREATE TABLE `court_oab` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `oab_id` bigint unsigned NOT NULL,
  `court_id` bigint unsigned NOT NULL,
  `court_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qrcode_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `court_oab_oab_id_foreign` (`oab_id`),
  KEY `court_oab_court_id_foreign` (`court_id`),
  CONSTRAINT `court_oab_court_id_foreign` FOREIGN KEY (`court_id`) REFERENCES `courts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `court_oab_oab_id_foreign` FOREIGN KEY (`oab_id`) REFERENCES `oabs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `courts`;
CREATE TABLE `courts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_produto` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `curricular_units`;
CREATE TABLE `curricular_units` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_period_id` int unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `integration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `customize_teams`;
CREATE TABLE `customize_teams` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `discipline_post_documents`;
CREATE TABLE `discipline_post_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `discipline_post_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` text,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `discipline_posts`;
CREATE TABLE `discipline_posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `discipline_id` int DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `discipline_teams`;
CREATE TABLE `discipline_teams` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `discipline_id` int DEFAULT NULL,
  `team_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `discipline_users`;
CREATE TABLE `discipline_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `discipline_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `team_id` int DEFAULT NULL,
  `temporary` tinyint(1) DEFAULT NULL,
  `professor` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `discipline_users_discipline_id_index` (`discipline_id`),
  KEY `discipline_users_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `disciplines`;
CREATE TABLE `disciplines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_period_id` int DEFAULT NULL,
  `academic_class_id` int DEFAULT NULL,
  `name` text,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shift` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `is_exceptional` tinyint(1) DEFAULT '0',
  `integration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `element_template_documents`;
CREATE TABLE `element_template_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_template_id` int unsigned DEFAULT NULL,
  `creator_id` int unsigned DEFAULT NULL,
  `filename` text,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_template_documents_element_template_id_index` (`element_template_id`),
  KEY `element_template_documents_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_template_links`;
CREATE TABLE `element_template_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_template_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `link` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_template_links_element_template_id_index` (`element_template_id`),
  KEY `element_template_links_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_template_type_form_options`;
CREATE TABLE `element_template_type_form_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_template_type_form_id` int unsigned NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `form_options_form_id_idx` (`element_template_type_form_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_template_type_forms`;
CREATE TABLE `element_template_type_forms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_template_id` int unsigned NOT NULL,
  `type_form_id` int unsigned NOT NULL,
  `title` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `order` int DEFAULT NULL,
  `is_mandatory` tinyint(1) DEFAULT NULL,
  `teacher_register` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `element_template_videos`;
CREATE TABLE `element_template_videos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_template_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `video` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_template_videos_element_template_id_index` (`element_template_id`),
  KEY `element_template_videos_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_templates`;
CREATE TABLE `element_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_type_id` int unsigned DEFAULT NULL,
  `academic_product_id` int unsigned DEFAULT NULL,
  `qualification_id` int unsigned DEFAULT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` text COLLATE utf8mb4_unicode_ci,
  `active` tinyint(1) DEFAULT '1',
  `has_stage` tinyint(1) DEFAULT '0',
  `location` longtext COLLATE utf8mb4_unicode_ci,
  `instructions` longtext COLLATE utf8mb4_unicode_ci,
  `grade` double(8,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `element_type_form_academic_products`;
CREATE TABLE `element_type_form_academic_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `academic_product_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_academic_products_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_academic_products_creator_id_index` (`creator_id`),
  KEY `element_type_form_academic_products_academic_product_id_index` (`academic_product_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_type_form_clients`;
CREATE TABLE `element_type_form_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int unsigned NOT NULL,
  `client_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `link` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_clients_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_clients_creator_id_index` (`creator_id`),
  KEY `element_type_form_clients_client_id_index` (`client_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_type_form_documents`;
CREATE TABLE `element_type_form_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int unsigned DEFAULT NULL,
  `creator_id` int unsigned DEFAULT NULL,
  `student_id` int unsigned DEFAULT NULL,
  `team_id` int unsigned DEFAULT NULL,
  `filename` text,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_documents_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_documents_creator_id_index` (`creator_id`),
  KEY `element_type_form_documents_student_id_index` (`student_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_type_form_feedback_documents`;
CREATE TABLE `element_type_form_feedback_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_feedback_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `creator_id` int unsigned DEFAULT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `etff_documents_feedback_id_index` (`element_type_form_feedback_id`),
  KEY `element_type_form_feedback_documents_user_id_index` (`user_id`),
  KEY `element_type_form_feedback_documents_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_type_form_feedbacks`;
CREATE TABLE `element_type_form_feedbacks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int DEFAULT NULL,
  `creator_id` int DEFAULT NULL,
  `student_id` int NOT NULL,
  `has_student` tinyint(1) DEFAULT NULL,
  `feedback` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_feedbacks_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_feedbacks_creator_id_index` (`creator_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `element_type_form_links`;
CREATE TABLE `element_type_form_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `link` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_links_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_links_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_type_form_ods`;
CREATE TABLE `element_type_form_ods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `ods_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_ods_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_ods_creator_id_index` (`creator_id`),
  KEY `element_type_form_ods_ods_id_index` (`ods_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `element_type_form_options`;
CREATE TABLE `element_type_form_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int unsigned NOT NULL,
  `creator_id` int DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `checked` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_options_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_options_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_type_form_skills`;
CREATE TABLE `element_type_form_skills` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `skill_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_skills_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_skills_creator_id_index` (`creator_id`),
  KEY `element_type_form_skills_skill_id_index` (`skill_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_type_form_texts`;
CREATE TABLE `element_type_form_texts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `text` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_texts_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_texts_creator_id_index` (`creator_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `element_type_form_thematic_areas`;
CREATE TABLE `element_type_form_thematic_areas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `thematic_area_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_thematic_areas_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_thematic_areas_creator_id_index` (`creator_id`),
  KEY `element_type_form_thematic_areas_thematic_area_id_index` (`thematic_area_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_type_form_videos`;
CREATE TABLE `element_type_form_videos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_type_form_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `video` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `element_type_form_videos_element_type_form_id_index` (`element_type_form_id`),
  KEY `element_type_form_videos_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `element_type_forms`;
CREATE TABLE `element_type_forms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `element_id` int unsigned NOT NULL,
  `type_form_id` int unsigned NOT NULL,
  `title` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_mandatory` tinyint(1) DEFAULT NULL,
  `teacher_register` tinyint(1) DEFAULT NULL,
  `has_response` tinyint(1) DEFAULT '0',
  `order` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `elements`;
CREATE TABLE `elements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned DEFAULT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `ethnicities`;
CREATE TABLE `ethnicities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `event_types`;
CREATE TABLE `event_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `client_id` int unsigned DEFAULT NULL,
  `lawsuit_id` int unsigned DEFAULT NULL,
  `practice_id` int unsigned DEFAULT NULL,
  `stage_id` int unsigned DEFAULT NULL,
  `attended_attended` tinyint(1) DEFAULT '0',
  `commitment_made` tinyint(1) DEFAULT '0',
  `event_type_id` int unsigned DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `hour` time DEFAULT '12:00:00',
  `notify` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'S',
  `observations` text COLLATE utf8mb4_unicode_ci,
  `shift_id` int unsigned DEFAULT NULL,
  `created_by_secretary` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `calendar_type_id` int DEFAULT NULL,
  `is_new` tinyint(1) DEFAULT '1',
  `send_notifications` tinyint(1) NOT NULL DEFAULT '0',
  `video_conference` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `events_user_id_index` (`user_id`),
  KEY `events_client_id_index` (`client_id`),
  KEY `events_lawsuit_id_index` (`lawsuit_id`),
  KEY `events_event_type_id_index` (`event_type_id`),
  KEY `events_date_index` (`date`),
  KEY `events_created_by_secretary_index` (`created_by_secretary`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `extension_program_practices`;
CREATE TABLE `extension_program_practices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `extension_program_id` int unsigned NOT NULL,
  `practice_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `extension_program_practices_extension_program_id_index` (`extension_program_id`),
  KEY `extension_program_practices_practice_id_index` (`practice_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `extension_programs`;
CREATE TABLE `extension_programs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `extracts`;
CREATE TABLE `extracts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int unsigned DEFAULT NULL,
  `lawsuit_id` int unsigned DEFAULT NULL,
  `act_id` int unsigned DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `filter_lists`;
CREATE TABLE `filter_lists` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filterSpecific` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `genders`;
CREATE TABLE `genders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `grafic_data_alls`;
CREATE TABLE `grafic_data_alls` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filterSpecific` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `grafic_specifics`;
CREATE TABLE `grafic_specifics` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_id` int unsigned DEFAULT NULL,
  `filterSpecific` json NOT NULL,
  `grafic` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_comparation` int DEFAULT NULL,
  `comparation` tinyint(1) DEFAULT '0',
  `ignore_creation_date` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `group_grafics`;
CREATE TABLE `group_grafics` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int unsigned NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `impersonate_access_controls`;
CREATE TABLE `impersonate_access_controls` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `impersonate_user_id` int NOT NULL,
  `access_started_at` timestamp NOT NULL,
  `access_ended_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `keywords`;
CREATE TABLE `keywords` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int unsigned NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `laws`;
CREATE TABLE `laws` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `lawsuit_acts`;
CREATE TABLE `lawsuit_acts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lawsuit_id` int unsigned DEFAULT NULL,
  `act_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `lawsuit_aux_ids`;
CREATE TABLE `lawsuit_aux_ids` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lawsuit_id` int unsigned NOT NULL,
  `auxiliary_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `lawsuit_classes`;
CREATE TABLE `lawsuit_classes` (
  `id` int unsigned NOT NULL,
  `parent_id` int unsigned DEFAULT NULL,
  `item_type` char(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`item_type`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `lawsuit_documents`;
CREATE TABLE `lawsuit_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lawsuit_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` longtext,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` longtext,
  `students_visibility` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `lawsuit_keywords`;
CREATE TABLE `lawsuit_keywords` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lawsuit_id` int unsigned NOT NULL,
  `keyword_id` int unsigned NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `lawsuit_opposing_party`;
CREATE TABLE `lawsuit_opposing_party` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lawsuit_id` int unsigned NOT NULL,
  `opposing_party_id` int unsigned NOT NULL,
  `opposing_lawyer_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opposing_lawyer_oab` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opposing_lawyer_oab_uf` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opposing_lawyer_telephone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opposing_lawyer_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `lawsuit_subjects`;
CREATE TABLE `lawsuit_subjects` (
  `id` int unsigned NOT NULL,
  `parent_id` int unsigned DEFAULT NULL,
  `item_type` char(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`item_type`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `lawsuit_types`;
CREATE TABLE `lawsuit_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `lawsuits`;
CREATE TABLE `lawsuits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_number_internal` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_old_bonsae` int DEFAULT NULL,
  `id_audora` int DEFAULT NULL,
  `audora_acts_transferred` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `secret` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `audora_acts_tranferred` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creator_id` int unsigned NOT NULL,
  `responsible_id` int unsigned DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `report_archive` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `situation` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_subpoena` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `process_fase` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lawsuit_subject_id` int unsigned DEFAULT NULL,
  `lawsuit_subject_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lawsuit_class_id` int unsigned DEFAULT NULL,
  `lawsuit_class_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unique_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vara` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `committee_id` int DEFAULT NULL,
  `cause_value` decimal(30,2) DEFAULT NULL,
  `judge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `main_client_id` int DEFAULT NULL,
  `description` longtext,
  `tribunal` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subarea` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_nature` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nature_lawsuit_id` int DEFAULT NULL,
  `lawsuit_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lawsuit_type_id` int DEFAULT NULL,
  `double_deadline` tinyint(1) DEFAULT NULL,
  `notify` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Y',
  `notify_in_days` int DEFAULT NULL,
  `send_bifrost` tinyint(1) DEFAULT '0',
  `inactive` tinyint(1) DEFAULT '0',
  `reactive_date` date DEFAULT NULL,
  `integration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_placeholder` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archive_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `legal_ground_students`;
CREATE TABLE `legal_ground_students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned NOT NULL,
  `petitioning_student_id` int unsigned DEFAULT NULL,
  `law_id` int unsigned DEFAULT NULL,
  `article` int DEFAULT NULL,
  `paragraph` int DEFAULT NULL,
  `line` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `point` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `legal_grounds`;
CREATE TABLE `legal_grounds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `petitioning_id` int unsigned NOT NULL,
  `law_id` int unsigned DEFAULT NULL,
  `article` int DEFAULT NULL,
  `paragraph` int DEFAULT NULL,
  `line` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `point` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `locals`;
CREATE TABLE `locals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `log_documents`;
CREATE TABLE `log_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `practice_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `meetings`;
CREATE TABLE `meetings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `act_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  `google_calendar_event_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_meet_link` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_calendar_html_link` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `meetings_google_calendar_event_id_unique` (`google_calendar_event_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint unsigned NOT NULL,
  `recipient_id` bigint unsigned NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_sender_id_index` (`sender_id`),
  KEY `messages_recipient_id_index` (`recipient_id`),
  CONSTRAINT `messages_recipient_id_foreign` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `model_has_permissions`;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `model_has_roles`;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `movements`;
CREATE TABLE `movements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lawsuit_id` int unsigned NOT NULL,
  `unique_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hash` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` date DEFAULT NULL,
  `hour` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_diary` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `localization` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext,
  `description` text COLLATE utf8mb4_unicode_ci,
  `diary_description` text COLLATE utf8mb4_unicode_ci,
  `read_bifrost` tinyint(1) DEFAULT '0',
  `created_by` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movements_lawsuit_id_index` (`lawsuit_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `nature_lawsuits`;
CREATE TABLE `nature_lawsuits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint unsigned NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `npj_class_posts`;
CREATE TABLE `npj_class_posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `npj_class_id` int unsigned NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `npj_class_statuses`;
CREATE TABLE `npj_class_statuses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `npj_class_students`;
CREATE TABLE `npj_class_students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `npj_class_id` int unsigned NOT NULL,
  `student_id` int unsigned NOT NULL,
  `temporary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `npj_class_students_npj_class_id_index` (`npj_class_id`),
  KEY `npj_class_students_student_id_index` (`student_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `npj_classes`;
CREATE TABLE `npj_classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_old_bonsae` int DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  `campus_id` int unsigned DEFAULT NULL,
  `npj_class_status_id` int unsigned NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_turn` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `period_id` int DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `oabs`;
CREATE TABLE `oabs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `oab_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `oab_uf` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `oab_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oabs_user_id_foreign` (`user_id`),
  CONSTRAINT `oabs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `ods`;
CREATE TABLE `ods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `opposing_parties`;
CREATE TABLE `opposing_parties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_old_bonsae` int DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpf` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cnpj` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_of_company` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state_subscription` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `local_subscription` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `voter_registration` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pis` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rg` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issuing_body` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uf_issuing_body` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marital_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profession` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monthly_income` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `naturalness` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `social_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kind_of_person` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_id` int DEFAULT NULL,
  `profile_pic` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `performed_act_act_types`;
CREATE TABLE `performed_act_act_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `act_type_id` int DEFAULT NULL,
  `performed_act_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `performed_acts`;
CREATE TABLE `performed_acts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `nota` double(8,2) DEFAULT NULL,
  `workload` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `periods`;
CREATE TABLE `periods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `petitionings`;
CREATE TABLE `petitionings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `competence_id` int DEFAULT NULL,
  `practice_id` int DEFAULT NULL,
  `lawsuit_subject_id` int DEFAULT NULL,
  `lawsuit_subject_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lawsuit_class_id` int DEFAULT NULL,
  `lawsuit_class_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opposing_party_id` int DEFAULT NULL,
  `opposing_party_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opposing_party_kind_of_person` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_secret` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fundamentation` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `petitionings_students`;
CREATE TABLE `petitionings_students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `competence_id` int DEFAULT NULL,
  `practice_id` int DEFAULT NULL,
  `petitioning_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `practice_student_id` int DEFAULT NULL,
  `lawsuit_subject_id` int DEFAULT NULL,
  `lawsuit_subject_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lawsuit_class_id` int DEFAULT NULL,
  `lawsuit_class_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opposing_party_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opposing_party_kind_of_person` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opposing_party_id` int DEFAULT NULL,
  `is_secret` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fundamentation` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `practice_acts`;
CREATE TABLE `practice_acts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `movement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_acts_practice_id_index` (`practice_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `practice_clients`;
CREATE TABLE `practice_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `client_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `practice_criterion`;
CREATE TABLE `practice_criterion` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_score` double(8,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `practice_documents`;
CREATE TABLE `practice_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `student_id` int unsigned DEFAULT NULL,
  `team_id` int unsigned DEFAULT NULL,
  `creator_id` int DEFAULT NULL,
  `is_correction` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_cover` tinyint(1) DEFAULT '0',
  `filename` text,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_documents_practice_id_index` (`practice_id`),
  KEY `practice_documents_creator_id_index` (`creator_id`),
  KEY `practice_documents_student_id_index` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `practice_feedback_documents`;
CREATE TABLE `practice_feedback_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_feedback_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `team_id` int unsigned DEFAULT NULL,
  `creator_id` int unsigned DEFAULT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_feedback_documents_practice_feedback_id_index` (`practice_feedback_id`),
  KEY `practice_feedback_documents_user_id_index` (`user_id`),
  KEY `practice_feedback_documents_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `practice_feedbacks`;
CREATE TABLE `practice_feedbacks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int DEFAULT NULL,
  `creator_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `feedback` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `practice_links`;
CREATE TABLE `practice_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `link` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `practice_project_terms`;
CREATE TABLE `practice_project_terms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `project_term_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `practice_skills`;
CREATE TABLE `practice_skills` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `skill_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_skills_practice_id_index` (`practice_id`),
  KEY `practice_skills_creator_id_index` (`creator_id`),
  KEY `practice_skills_skill_id_index` (`skill_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `practice_student_statuses`;
CREATE TABLE `practice_student_statuses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `practice_students`;
CREATE TABLE `practice_students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `student_id` int unsigned NOT NULL,
  `team_id` int DEFAULT NULL,
  `petitioning_id` int unsigned DEFAULT NULL,
  `practice_student_status_id` int unsigned DEFAULT '1',
  `workload` time DEFAULT NULL,
  `grade` double(8,2) DEFAULT NULL,
  `concept` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_file` tinyint(1) DEFAULT '0',
  `presence` tinyint(1) DEFAULT '0',
  `presence_source_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presence_source_practice_id` bigint unsigned DEFAULT NULL,
  `professor` tinyint(1) DEFAULT '0',
  `permission` tinyint(1) DEFAULT '0',
  `observations` longtext,
  `status_change_date` date DEFAULT NULL,
  `practice_returned` tinyint(1) DEFAULT '0',
  `date_practice_returned` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_students_practice_id_index` (`practice_id`),
  KEY `practice_students_student_id_index` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `practice_thematic_areas`;
CREATE TABLE `practice_thematic_areas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `thematic_area_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `practice_types`;
CREATE TABLE `practice_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `practice_videos`;
CREATE TABLE `practice_videos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `video` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_videos_practice_id_index` (`practice_id`),
  KEY `practice_videos_creator_id_index` (`creator_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `practices`;
CREATE TABLE `practices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `npj_class_id` int unsigned DEFAULT NULL,
  `discipline_id` int DEFAULT NULL,
  `curricular_unit_id` int unsigned DEFAULT NULL,
  `shift_id` int DEFAULT NULL,
  `responsible_id` int unsigned NOT NULL,
  `event_id` int unsigned DEFAULT NULL,
  `category_id` int unsigned DEFAULT NULL,
  `project_type_id` int unsigned DEFAULT NULL,
  `is_simulated` tinyint(1) DEFAULT NULL,
  `participant_limit` int unsigned DEFAULT NULL,
  `practice_type_id` int unsigned DEFAULT '1',
  `client_id` int unsigned DEFAULT NULL,
  `lawsuit_id` int unsigned DEFAULT NULL,
  `name` text NOT NULL,
  `themer` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `front_cover` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Y' COMMENT 'Y for active practices and (N or null) for not active practices',
  `exclude_from_average` tinyint(1) NOT NULL DEFAULT '0',
  `date_finished` datetime DEFAULT NULL,
  `is_duplicate` tinyint(1) NOT NULL DEFAULT '0',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_hour` time DEFAULT NULL,
  `end_hour` time DEFAULT NULL,
  `workload` time DEFAULT NULL,
  `favorite` tinyint(1) DEFAULT NULL,
  `hours` int unsigned DEFAULT NULL,
  `grade` double(8,2) DEFAULT NULL,
  `schedule` longtext,
  `is_secret` tinyint(1) DEFAULT NULL,
  `target_audience` longtext,
  `methodology` longtext,
  `justification` longtext,
  `reference` text COLLATE utf8mb4_unicode_ci,
  `academic_goals` longtext,
  `specific_goals` longtext COLLATE utf8mb4_unicode_ci,
  `condition_participation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expected_participants` int DEFAULT NULL,
  `location` longtext,
  `instructions` longtext,
  `academic_product_id` int unsigned DEFAULT NULL,
  `qualification_id` int unsigned DEFAULT NULL,
  `integration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `peer_to_peer` tinyint(1) DEFAULT NULL,
  `auto_evaluation` tinyint(1) DEFAULT NULL,
  `simple_evaluation` tinyint(1) DEFAULT NULL,
  `concept_evaluation` tinyint(1) DEFAULT NULL,
  `has_question` tinyint(1) DEFAULT NULL,
  `has_petitioning` tinyint(1) DEFAULT NULL,
  `professor_evaluation` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practices_npj_class_id_index` (`npj_class_id`),
  KEY `practices_discipline_id_index` (`discipline_id`),
  KEY `practices_responsible_id_index` (`responsible_id`),
  KEY `practices_practice_type_id_index` (`practice_type_id`),
  KEY `practices_event_id_index` (`event_id`),
  KEY `practices_client_id_index` (`client_id`),
  KEY `practices_lawsuit_id_index` (`lawsuit_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `process_documents`;
CREATE TABLE `process_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `movement_id` int DEFAULT NULL,
  `subpoena_id` int DEFAULT NULL,
  `filename` text COLLATE utf8mb4_unicode_ci,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `profile_configs`;
CREATE TABLE `profile_configs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int NOT NULL,
  `university_id` int DEFAULT NULL,
  `able_edit` tinyint(1) NOT NULL DEFAULT '0',
  `able_change_password` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `project_terms`;
CREATE TABLE `project_terms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL,
  `course_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `project_type_disciplines`;
CREATE TABLE `project_type_disciplines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_type_id` int unsigned DEFAULT NULL,
  `discipline_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `project_types`;
CREATE TABLE `project_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `workload` time DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `qualification_academic_products`;
CREATE TABLE `qualification_academic_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `qualification_id` int unsigned DEFAULT NULL,
  `academic_product_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `qualifications`;
CREATE TABLE `qualifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `course_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `question_feedbacks`;
CREATE TABLE `question_feedbacks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int DEFAULT NULL,
  `creator_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `feedback` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `question_images`;
CREATE TABLE `question_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `question_options`;
CREATE TABLE `question_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `position` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `question_users`;
CREATE TABLE `question_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `answer` longtext COLLATE utf8mb4_unicode_ci,
  `question_id` int NOT NULL,
  `option_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `is_objective` tinyint(1) NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` longtext COLLATE utf8mb4_unicode_ci,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `is_avaliation` tinyint(1) NOT NULL DEFAULT '0',
  `avaliation_time` time DEFAULT NULL,
  `position` int NOT NULL,
  `show_answer` tinyint(1) NOT NULL DEFAULT '0',
  `practice_id` int unsigned DEFAULT NULL,
  `stage_id` int unsigned DEFAULT NULL,
  `element_type_form_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `representatives`;
CREATE TABLE `representatives` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpf` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ethnicity_id` int DEFAULT NULL,
  `gender_id` int DEFAULT NULL,
  `birth_date` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rg` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `voter_registration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issuing_body` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uf_issuing_body` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marital_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profession` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pis` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monthly_income` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `naturalness` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `role_has_permissions`;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `school_period_users`;
CREATE TABLE `school_period_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_period_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `creator_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `school_periods`;
CREATE TABLE `school_periods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_period` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `final_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `screening_histories`;
CREATE TABLE `screening_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lawsuit_id` int unsigned NOT NULL,
  `lawsuit_type_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `session_documents`;
CREATE TABLE `session_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int unsigned DEFAULT NULL,
  `creator_id` int unsigned DEFAULT NULL,
  `student_id` int unsigned DEFAULT NULL,
  `team_id` int unsigned DEFAULT NULL,
  `is_correction` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` text,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_documents_session_id_index` (`session_id`),
  KEY `session_documents_creator_id_index` (`creator_id`),
  KEY `session_documents_student_id_index` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `session_feedback_documents`;
CREATE TABLE `session_feedback_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_feedback_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `creator_id` int unsigned DEFAULT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_feedback_documents_session_feedback_id_index` (`session_feedback_id`),
  KEY `session_feedback_documents_user_id_index` (`user_id`),
  KEY `session_feedback_documents_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `session_feedbacks`;
CREATE TABLE `session_feedbacks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int DEFAULT NULL,
  `creator_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `feedback` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `session_links`;
CREATE TABLE `session_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `link` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_links_session_id_index` (`session_id`),
  KEY `session_links_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `session_practices`;
CREATE TABLE `session_practices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int unsigned DEFAULT NULL,
  `practice_id` int unsigned DEFAULT NULL,
  `has_link_activity` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_practices_session_id_index` (`session_id`),
  KEY `session_practices_practice_id_index` (`practice_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `session_skills`;
CREATE TABLE `session_skills` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `skill_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_skills_session_id_index` (`session_id`),
  KEY `session_skills_creator_id_index` (`creator_id`),
  KEY `session_skills_skill_id_index` (`skill_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `session_users`;
CREATE TABLE `session_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int unsigned DEFAULT NULL,
  `practice_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `team_id` int DEFAULT NULL,
  `professor` tinyint(1) DEFAULT '0',
  `practice_student_status_id` int unsigned DEFAULT '1',
  `presence` tinyint(1) DEFAULT '0',
  `workload` time DEFAULT NULL,
  `grade` double(8,2) DEFAULT NULL,
  `concept` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_file` tinyint(1) DEFAULT '0',
  `observations` longtext COLLATE utf8mb4_unicode_ci,
  `status_change_date` date DEFAULT NULL,
  `practice_returned` tinyint(1) DEFAULT '0',
  `date_practice_returned` date DEFAULT NULL,
  `permission` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_users_session_id_index` (`session_id`),
  KEY `session_users_practice_id_index` (`practice_id`),
  KEY `session_users_user_id_index` (`user_id`),
  KEY `session_users_team_id_index` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `session_videos`;
CREATE TABLE `session_videos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `video` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_videos_session_id_index` (`session_id`),
  KEY `session_videos_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `discipline_id` int unsigned DEFAULT NULL,
  `school_period_id` int unsigned DEFAULT NULL,
  `curricular_unit_id` int unsigned DEFAULT NULL,
  `academic_product_id` int unsigned DEFAULT NULL,
  `category_id` int unsigned DEFAULT NULL,
  `name` text NOT NULL,
  `participant_limit` int unsigned DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_hour` time DEFAULT NULL,
  `end_hour` time DEFAULT NULL,
  `workload` time DEFAULT NULL,
  `grade` double(8,2) DEFAULT NULL,
  `concept` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `exclude_from_average` tinyint(1) NOT NULL DEFAULT '0',
  `expected_participants` int DEFAULT NULL,
  `condition_participation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` longtext COLLATE utf8mb4_unicode_ci,
  `instructions` longtext COLLATE utf8mb4_unicode_ci,
  `academic_goals` longtext COLLATE utf8mb4_unicode_ci,
  `specific_goals` longtext COLLATE utf8mb4_unicode_ci,
  `methodology` longtext COLLATE utf8mb4_unicode_ci,
  `justification` longtext COLLATE utf8mb4_unicode_ci,
  `schedule` longtext COLLATE utf8mb4_unicode_ci,
  `target_audience` longtext COLLATE utf8mb4_unicode_ci,
  `integration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `peer_to_peer` tinyint(1) DEFAULT NULL,
  `auto_evaluation` tinyint(1) DEFAULT NULL,
  `favorite` tinyint(1) DEFAULT NULL,
  `is_duplicate` tinyint(1) NOT NULL DEFAULT '0',
  `date_finished` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_school_period_id_index` (`school_period_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `shift_event`;
CREATE TABLE `shift_event` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `shift_students`;
CREATE TABLE `shift_students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_period_id` int unsigned DEFAULT NULL,
  `shift_id` int unsigned NOT NULL,
  `student_id` int unsigned NOT NULL,
  `team_id` int DEFAULT NULL,
  `presence` tinyint(1) DEFAULT '0',
  `presence_source_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presence_source_practice_id` bigint unsigned DEFAULT NULL,
  `shift_workload` time DEFAULT '00:00:00',
  `shift_grade` double(8,2) DEFAULT NULL,
  `shift_observations` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shift_justification` text COLLATE utf8mb4_unicode_ci,
  `start_hour` time DEFAULT NULL,
  `end_hour` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shift_students_school_period_id_index` (`school_period_id`),
  KEY `shift_students_shift_id_index` (`shift_id`),
  KEY `shift_students_student_id_index` (`student_id`),
  KEY `shift_students_presence_index` (`presence`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `shifts`;
CREATE TABLE `shifts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `npj_class_id` int DEFAULT NULL,
  `discipline_id` int DEFAULT NULL,
  `exclude_from_average` tinyint(1) NOT NULL DEFAULT '0',
  `local_id` bigint unsigned DEFAULT NULL,
  `date` date DEFAULT NULL,
  `start_hour` time DEFAULT NULL,
  `end_hour` time DEFAULT NULL,
  `slots` int DEFAULT NULL,
  `shift_grade` double(8,2) DEFAULT NULL,
  `workload` time DEFAULT NULL,
  `group` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shifts_npj_class_id_index` (`npj_class_id`),
  KEY `shifts_discipline_id_index` (`discipline_id`),
  KEY `shifts_date_index` (`date`),
  KEY `shifts_local_id_foreign` (`local_id`),
  CONSTRAINT `shifts_local_id_foreign` FOREIGN KEY (`local_id`) REFERENCES `locals` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `skills`;
CREATE TABLE `skills` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `specific_terms`;
CREATE TABLE `specific_terms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `council` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bi` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bis` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lawsuit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lawsuits` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lawsuit_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lawsuit_types` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nature_lawsuit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shift` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shifts` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clients` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `academic_practice` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `academic_practices` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aps` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apss` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `academic_event` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `academic_events` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `projects` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `act_card` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `act_cards` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `lawsuit_complement` varchar(191) DEFAULT NULL,
  `download_grades` varchar(191) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `enrollment` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enrollments` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enrolled` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enrolled_plural` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `stage_documents`;
CREATE TABLE `stage_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stage_id` int unsigned DEFAULT NULL,
  `creator_id` int unsigned DEFAULT NULL,
  `student_id` int unsigned DEFAULT NULL,
  `team_id` int unsigned DEFAULT NULL,
  `is_correction` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` text,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stage_documents_stage_id_index` (`stage_id`),
  KEY `stage_documents_creator_id_index` (`creator_id`),
  KEY `stage_documents_student_id_index` (`student_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `stage_feedback_documents`;
CREATE TABLE `stage_feedback_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stage_feedback_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `creator_id` int unsigned DEFAULT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileextension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stage_feedback_documents_stage_feedback_id_index` (`stage_feedback_id`),
  KEY `stage_feedback_documents_user_id_index` (`user_id`),
  KEY `stage_feedback_documents_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `stage_feedbacks`;
CREATE TABLE `stage_feedbacks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stage_id` int DEFAULT NULL,
  `creator_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `feedback` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `stage_links`;
CREATE TABLE `stage_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stage_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `link` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stage_links_stage_id_index` (`stage_id`),
  KEY `stage_links_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `stage_skills`;
CREATE TABLE `stage_skills` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stage_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `skill_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stage_skills_stage_id_index` (`stage_id`),
  KEY `stage_skills_creator_id_index` (`creator_id`),
  KEY `stage_skills_skill_id_index` (`skill_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `stage_users`;
CREATE TABLE `stage_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stage_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `team_id` int DEFAULT NULL,
  `professor` tinyint(1) DEFAULT '0',
  `practice_student_status_id` int unsigned DEFAULT '1',
  `presence` tinyint(1) DEFAULT '0',
  `workload` time DEFAULT NULL,
  `grade` double(8,2) DEFAULT NULL,
  `concept` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_file` tinyint(1) DEFAULT '0',
  `observations` longtext COLLATE utf8mb4_unicode_ci,
  `status_change_date` date DEFAULT NULL,
  `permission` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stage_users_stage_id_index` (`stage_id`),
  KEY `stage_users_user_id_index` (`user_id`),
  KEY `stage_users_team_id_index` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `stage_videos`;
CREATE TABLE `stage_videos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stage_id` int unsigned NOT NULL,
  `creator_id` int unsigned NOT NULL,
  `video` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stage_videos_stage_id_index` (`stage_id`),
  KEY `stage_videos_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `stages`;
CREATE TABLE `stages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_period_id` int unsigned DEFAULT NULL,
  `curricular_unit_id` int unsigned DEFAULT NULL,
  `practice_id` int unsigned DEFAULT NULL,
  `element_id` int unsigned DEFAULT NULL,
  `academic_product_id` int unsigned DEFAULT NULL,
  `qualification_id` int unsigned DEFAULT NULL,
  `name` text NOT NULL,
  `participant_limit` int unsigned DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_hour` time DEFAULT NULL,
  `end_hour` time DEFAULT NULL,
  `workload` time DEFAULT NULL,
  `grade` double(8,2) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `exclude_from_average` tinyint(1) NOT NULL DEFAULT '0',
  `expected_participants` int DEFAULT NULL,
  `condition_participation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` longtext COLLATE utf8mb4_unicode_ci,
  `instructions` longtext COLLATE utf8mb4_unicode_ci,
  `academic_goals` longtext COLLATE utf8mb4_unicode_ci,
  `specific_goals` longtext COLLATE utf8mb4_unicode_ci,
  `methodology` longtext COLLATE utf8mb4_unicode_ci,
  `justification` longtext COLLATE utf8mb4_unicode_ci,
  `schedule` longtext COLLATE utf8mb4_unicode_ci,
  `target_audience` longtext COLLATE utf8mb4_unicode_ci,
  `integration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favorite` tinyint(1) DEFAULT NULL,
  `is_duplicate` tinyint(1) NOT NULL DEFAULT '0',
  `date_finished` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stages_school_period_id_index` (`school_period_id`),
  KEY `stages_practice_id_index` (`practice_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `states`;
CREATE TABLE `states` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uf` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `student_evaluations`;
CREATE TABLE `student_evaluations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int unsigned NOT NULL,
  `practice_student_id` int unsigned NOT NULL,
  `criterion_id` int unsigned DEFAULT NULL,
  `student_id` int unsigned NOT NULL,
  `team_id` int unsigned DEFAULT NULL,
  `creator_id` int NOT NULL,
  `auto_evaluation` tinyint unsigned NOT NULL DEFAULT '0',
  `grade` double(8,2) DEFAULT NULL,
  `concept` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_evaluations_practice_id_index` (`practice_id`),
  KEY `student_evaluations_practice_student_id_index` (`practice_student_id`),
  KEY `student_evaluations_student_id_index` (`student_id`),
  KEY `student_evaluations_team_id_index` (`team_id`),
  KEY `student_evaluations_creator_id_index` (`creator_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `subpoenas`;
CREATE TABLE `subpoenas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `data` date DEFAULT NULL,
  `idWs` int unsigned DEFAULT NULL,
  `idExterno` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idPublicacao` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataDisponibilizacao` date DEFAULT NULL,
  `dataPublicacao` date DEFAULT NULL,
  `nomeAdvogado` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numeroProcessoCNJ` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numeroProcesso` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lawsuit_id` int DEFAULT NULL,
  `nomeJornal` text COLLATE utf8mb4_unicode_ci,
  `orgao` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cidade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vara` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pagina` int DEFAULT NULL,
  `esfera` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uf` varchar(191) DEFAULT NULL,
  `retificada` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conteudo` text COLLATE utf8mb4_unicode_ci,
  `deadline_in_days` int DEFAULT NULL,
  `deadline_as_date` timestamp NULL DEFAULT NULL,
  `multipleDeadlines` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_deadline` tinyint(1) DEFAULT '0',
  `accepted` char(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `concluded` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subpoenas_idws_index` (`idWs`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `task_certificates`;
CREATE TABLE `task_certificates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `certificate_id` int unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `team_users`;
CREATE TABLE `team_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `user_id` int NOT NULL,
  `leader` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `topic` text COLLATE utf8mb4_unicode_ci,
  `school_period_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `term_students`;
CREATE TABLE `term_students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `term_id` int unsigned NOT NULL,
  `student_id` int unsigned NOT NULL,
  `permission` tinyint(1) NOT NULL DEFAULT '0',
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_accept` date DEFAULT NULL,
  `browser_agent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `terms`;
CREATE TABLE `terms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `thematic_areas`;
CREATE TABLE `thematic_areas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `type_documents`;
CREATE TABLE `type_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `type_forms`;
CREATE TABLE `type_forms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `user_access_permissions`;
CREATE TABLE `user_access_permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `creator_id` int DEFAULT NULL,
  `access_start` datetime DEFAULT NULL,
  `access_end` datetime DEFAULT NULL,
  `weekday_start` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weekday_end` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_old_bonsae` int DEFAULT NULL,
  `id_audora` int DEFAULT NULL,
  `profile_id` int unsigned NOT NULL,
  `active` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'S',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(190) DEFAULT NULL,
  `receive_emails` tinyint(1) DEFAULT '1',
  `gmail` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gcalendar_credentials` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approve_api` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `approve_msg` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cpf` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `period_id` int DEFAULT NULL,
  `oab` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oab_uf` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `workload_real` time DEFAULT NULL,
  `workload_simulated` time DEFAULT NULL,
  `observations` text COLLATE utf8mb4_unicode_ci,
  `profile_pic` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `course` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `is_admin` char(191) COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `access_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser_agent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_accept` date DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `last_logout` datetime DEFAULT NULL,
  `logged_time` time DEFAULT NULL,
  `all_time_logged` time DEFAULT NULL,
  `average_logged_time` time DEFAULT NULL,
  `times_active` int DEFAULT NULL,
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permission` tinyint(1) NOT NULL DEFAULT '0',
  `integration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_registration_number_unique` (`registration_number`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_profile_id_index` (`profile_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `users_events`;
CREATE TABLE `users_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  `team_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_events_event_id_index` (`event_id`),
  KEY `users_events_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT;

DROP TABLE IF EXISTS `warning_links`;
CREATE TABLE `warning_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `warning_id` int unsigned DEFAULT NULL,
  `creator_id` int unsigned DEFAULT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `warnings`;
CREATE TABLE `warnings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint unsigned NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `warnings_sender_id_foreign` (`sender_id`),
  CONSTRAINT `warnings_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

