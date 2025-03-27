-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 27, 2025 at 07:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `accnt`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `service` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `service`, `date`, `time`, `status`, `remarks`) VALUES
(26, 36, 'Health Check-up', '2025-03-22', '13:00:00', 'approved', NULL),
(27, 37, 'Free Medicine', '2025-03-22', '14:00:00', 'approved', NULL),
(28, 42, 'Massage', '2025-03-29', '14:30:00', 'approved', NULL),
(29, 37, 'Free Medicine', '2025-03-13', '14:00:00', 'approved', NULL),
(30, 33, 'Health Check-up', '2025-03-27', '13:00:00', 'approved', NULL),
(31, 33, 'Health Check-up', '2025-03-26', '15:00:00', 'approved', NULL),
(32, 40, 'Free Medicine', '2025-03-27', '14:00:00', 'approved', NULL),
(33, 39, 'Health Check-up', '2025-03-27', '09:00:00', 'approved', NULL),
(34, 39, 'Health Check-up', '2025-03-28', '09:00:00', 'approved', NULL),
(35, 52, 'Health Check-up', '2025-03-28', '13:00:00', 'approved', NULL),
(36, 37, 'Health Check-up', '2025-03-29', '09:00:00', 'approved', NULL),
(37, 40, 'Free Medicine', '2025-03-28', '14:00:00', 'rejected', NULL),
(38, 40, 'Free Medicine', '2025-03-28', '14:00:00', 'rejected', 'Note: already full slot'),
(39, 37, 'Free Medicine', '2025-03-29', '10:00:00', 'approved', 'No valid Id'),
(40, 40, 'Massage', '2025-03-29', '14:30:00', 'pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `organizer` varchar(255) NOT NULL,
  `date_time` datetime NOT NULL,
  `event_title` varchar(255) NOT NULL,
  `event_description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `organizer`, `date_time`, `event_title`, `event_description`, `location`, `created_at`) VALUES
(17, 'Ryan', '2025-03-27 01:26:00', 'Zumba', 'fsaa', 'agaga', '2025-03-26 17:26:45'),
(18, 'Ryan', '2025-03-26 01:26:00', 'Zumba', 'asfafaaasfasasfa', 'agaga', '2025-03-26 17:26:54'),
(19, 'Jc', '2025-03-28 01:43:00', 'afadsgs', 'asfas', 'asfasf', '2025-03-26 17:43:31');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','client') NOT NULL DEFAULT 'client',
  `age` int(11) NOT NULL,
  `sex` enum('Male','Female') NOT NULL,
  `address` varchar(255) NOT NULL,
  `health_issue` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `barangay_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `age`, `sex`, `address`, `health_issue`, `created_at`, `barangay_id`) VALUES
(30, 'admin', '$2y$10$T.IdC4D60C.IA1ar2Lc58OPWKzYTwkrdZm0in4/gRbmyvp8T2DkXq', 'admin', 60, 'Male', '2359 G. Tejron St Sta Ana', 'Diabetes', '2025-03-20 06:47:17', 0),
(33, 'Kristel', '$2y$10$NIbTHKFMp.ORqvUhD2A8H.ZEHSKiab1Q33i4MG9a.9Opm00pfjRuu', 'client', 60, 'Female', '2359 G. Tejron St Sta Ana', 'Heart', '2025-03-20 06:49:07', 0),
(34, 'Mae', '$2y$10$osL35fZ1hhZ.Jmbsm/zZO.VukCsrZquazq582n/ACVCeup0PsMf1W', 'client', 60, 'Female', '2359 G. Tejron St Sta Ana', 'Heart', '2025-03-20 06:49:27', 0),
(35, 'Aliah', '$2y$10$6GddlGACq5bA2Kiy9bH/EuCMmrkHD2dLWLkjWx/lZs99PvtgJUQNa', 'client', 60, 'Male', '1212 G Tejeron ST. Sta ANa manila', 'Diabetes', '2025-03-20 06:49:45', 0),
(36, 'Mhae', '$2y$10$7ghDvkykeZSKltuiIMhGLeeoKZS1fuENqQSEmkQZLlx38crNgaBZ.', 'client', 60, 'Male', '2359 G. Tejron St Sta Ana', 'Diabetes', '2025-03-20 06:50:04', 0),
(37, 'Tin', '$2y$10$8Vx4U3Neaohyd.mz12r55OfP.aznkVFeVXff8aqt..nYXcQX9TyMm', 'client', 60, 'Female', '1212 G Tejeron ST. Sta ANa manila', 'Diabetes', '2025-03-20 06:50:25', 0),
(38, 'Bea', '$2y$10$61PXkVe5Dtd2tCfp4izsjuQh0yLdIaiDo8g1Joe/AD6F8NTNqvw1q', 'client', 60, 'Female', '2359 G. Tejron St Sta Ana', 'Heart', '2025-03-20 06:52:03', 0),
(39, 'Jan', '$2y$10$uJWyIvOXiXFApyQvE8OQD.P6S0Q.fcXI/ksM0O32FcckVIZ0JfqHG', 'client', 60, 'Male', '2359 G. Tejron St Sta Ana', 'Diabetes', '2025-03-20 06:52:16', 0),
(40, 'Ashley', '$2y$10$JitXZNoAhiceQy03IDedHuuNFd.fOk9Iu1IVkcA.aglEtmq4TG/Oe', 'client', 60, 'Male', '2359 G. Tejron St Sta Ana', 'Diabetes', '2025-03-20 06:52:33', 0),
(41, 'Christian', '$2y$10$GoaGeuLiS.uor0o0InamUONjcSK9RCCTBF4y1NBmGmPGlDi7BCHUu', 'admin', 60, 'Male', '124', 'diabetes', '2025-03-21 03:39:30', 0),
(42, 'Ryan', '$2y$10$CXjkRPItsxjhIq2OMdbWVOL1YKnr1NBbA2JS3Vzj0BthndBxUIUru', 'client', 60, 'Male', 'manila', 'diabetes', '2025-03-21 03:40:00', 0),
(43, 'Nicol', '$2y$10$FCSEkttGR4465MIyu4cLw.kXjGG07DIHdXhajGU3NXUELNfhgwVr.', 'client', 60, 'Male', 'manila', 'diabetes', '2025-03-21 03:49:05', 0),
(44, 'Nicole', '$2y$10$yPBWEe8RSa9IlcazQ86TFuRMdU.CUfA4rLlyXeLyd8pJtVcC1Wl5a', 'client', 60, 'Male', '90912 G Tejeron ST Sta ana manila', 'Diabetes', '2025-03-24 07:46:50', 0),
(45, 'Angeline', '$2y$10$85IDB.O3FyOmnw/yJpr2MueueGmBl8uIhCpNSwKBpgWXPgg/9H5ym', 'client', 60, 'Female', '90912 G Tejeron ST Sta ana manila', 'Diabetes', '2025-03-24 07:56:46', 0),
(46, 'Diego', '$2y$10$WF2CpJitkjhhRKsGrUPTTuH7U7/8sTVwZKdJwe9osrK37orGVpNYW', 'client', 67, 'Male', '2359 G. Tejron St Sta Ana', 'Diabetes', '2025-03-25 06:03:35', 0),
(47, 'jc', '$2y$10$4V6oY52eFpmGdQ8uUEY5fOR.ydoqDAwAQzfC7/UZJB.lbdPsH1Yvy', '', 60, 'Male', '1212 G Tejeron ST. Sta ANa manila', 'Diabetes', '2025-03-26 08:54:02', 0),
(48, 'jOY', '$2y$10$C3deCX6APW7uxJYUO3sEaua7OzcZSR5a2nmHOEHYFTwAKvgtu7C2a', '', 67, 'Male', '2359 G. Tejron St Sta Ana', 'Diabetes', '2025-03-26 08:58:49', 0),
(49, 'Jc1', '$2y$10$blSolWaSqNvbNXXq2arx9e1Wg6ryeXcGBk740n7fEpf6u2ZKRGHa2', 'client', 60, 'Male', '2359 G. Tejron St Sta Ana', 'Diabetes', '2025-03-26 09:06:44', 0),
(50, 'admin1', '$2y$10$18AcmnNNXh2WO4KU/VFdy.TCz5usjHdNpUray/xWzsktA8J16yMW2', 'admin', 60, 'Male', '2359 G. Tejron St Sta Ana', 'Heart', '2025-03-26 09:07:15', 0),
(52, 'RyanJoshua', '$2y$10$dmC90MDsdhsMGpM8T9WRAut4qaAhGD15oDgKJbevBZ9G8QF42L9he', 'client', 60, 'Male', '2359 G. Tejron St Sta Ana', 'Diabetes', '2025-03-27 00:52:40', 12345),
(53, 'cods', '$2y$10$0Lqv2si2n5X84GTbWTZtc.WwrGi1Q3q2xXMZUs2FXIgivZ2mqgWG6', 'client', 60, 'Male', '2359 G. Tejron St Sta Ana', 'Diabetes, Arthritis, Heart Disease', '2025-03-27 01:10:59', 12412),
(54, 'Simang', '$2y$10$c3r.V2wKaCEC9jqSAHGq5uMJ.CK8R2yuoqGz7PHocdp5FYNLQUQKu', 'client', 67, 'Male', 'asdsa', 'Diabetes, Arthritis', '2025-03-27 04:54:28', 90135),
(57, 'selden', '$2y$10$AM14HsYsnOUJIMLSffHlFeylI52bAhi1KxhsVwzjy0tiSHLlCv1Oi', 'client', 69, 'Male', '1212 G Tejeron ST. Sta ANa manila', 'Diabetes, Hypertension, Arthritis', '2025-03-27 06:13:32', 12345);

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `barangay_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `id_file` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `user_id`, `barangay_id`, `username`, `first_name`, `middle_name`, `last_name`, `birthday`, `address`, `id_file`, `profile_picture`) VALUES
(1, 37, 0, 'Tin', 'Ryan Joshua', 'assf', 'Araneta', '2025-03-29', '2359 G. Tejron St Sta Ana', NULL, NULL),
(5, 42, 0, 'Ryan', 'Ryan', 'Joshua', 'Araneta', '2025-03-29', '2359 G. Tejron St Sta Ana', 'uploads/1743050067_781da1d6933ce8cddebd87e9bb1c0260.jpg', 'uploads/1743050067_aape.jpg'),
(8, 52, 0, '', 'Ryan Joshua', 'Tulagan', 'Araneta', '2025-03-28', '2359 G. Tejron St Sta Ana', 'uploads/1743050675_781da1d6933ce8cddebd87e9bb1c0260.jpg', 'uploads/1743050675_781da1d6933ce8cddebd87e9bb1c0260.jpg'),
(13, 54, 0, '', 'Ryan Joshua', 'sfa', 'Araneta', '2025-03-29', '2359 G. Tejron St Sta Ana', NULL, NULL),
(15, 39, 0, '', 'Jan', 'Ashley', 'TInao', '2025-03-29', '2359 G. Tejron St Sta Ana', 'uploads/1743052613_4231ba18f2c5203240e20f7ed9ad848c.jpg', 'uploads/1743052613_4231ba18f2c5203240e20f7ed9ad848c.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointments_ibfk_1` (`user_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
