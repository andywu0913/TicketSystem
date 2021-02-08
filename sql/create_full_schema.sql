-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: 192.168.250.2
-- Generation Time: Feb 07, 2021 at 05:33 PM
-- Server version: 10.3.7-MariaDB-1:10.3.7+maria~jessie
-- PHP Version: 7.2.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+08:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `TicketSystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `creator_uid` int(10) UNSIGNED NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'Host'),
(3, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `time` datetime NOT NULL,
  `address` varchar(64) NOT NULL,
  `ticket_sell_time_open` datetime NOT NULL,
  `ticket_sell_time_end` datetime NOT NULL,
  `max_seats` int(10) UNSIGNED NOT NULL,
  `price` int(10) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `id` int(10) UNSIGNED NOT NULL,
  `session_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `seat_no` int(10) UNSIGNED NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ticket`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `uname` varchar(64) NOT NULL,
  `password` varchar(170) NOT NULL,
  `role` int(10) UNSIGNED NOT NULL,
  `name` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `register_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `refresh_token` varchar(64) DEFAULT NULL,
  `token_expires_in` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `uname`, `password`, `role`, `name`, `email`, `register_time`, `last_update_time`, `last_login_time`, `refresh_token`, `token_expires_in`) VALUES
(1, 'admin', 'scrypt64:09c28292035f827cb1503a68548aac06:f0c9942a171e1f6218ee6e4e8f683eae91fc65e6bd083cf6b3884823a3beff23d1a33a3774a99a36f79f977fa6539d1ecf28eac93c76487001898490cbe57a8a', 1, 'Admin', 'admin@123.com', '2021-02-02 09:07:51', '2021-02-07 11:03:47', '2021-02-07 16:15:56', '4122637d837cfdd1dd0b703ff0d8bbe9e6e6a1b6f44d2d60bb98bbc60f10a883', '2021-02-08 10:15:56'),

-- --------------------------------------------------------

--
-- Table structure for table `user_github`
--

CREATE TABLE `user_github` (
  `id` int(10) UNSIGNED NOT NULL,
  `github_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_user` (`creator_uid`) USING BTREE;

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_event` (`event_id`) USING BTREE;

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `UNIQUE_session&seat` (`session_id`,`seat_no`) USING BTREE,
  ADD KEY `FK_user_id` (`user_id`) USING BTREE,
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uname_unique` (`uname`) USING BTREE,
  ADD KEY `uname_index` (`uname`) USING BTREE,
  ADD KEY `FK_role` (`role`) USING BTREE;

--
-- Indexes for table `user_github`
--
ALTER TABLE `user_github`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `github_id_unique` (`github_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `FK_user` FOREIGN KEY (`creator_uid`) REFERENCES `user` (`id`);

--
-- Constraints for table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `FK_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`);

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `FK_session` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_role` FOREIGN KEY (`role`) REFERENCES `role` (`id`);

--
-- Constraints for table `user_github`
--
ALTER TABLE `user_github`
  ADD CONSTRAINT `FK_github_id` FOREIGN KEY (`id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
