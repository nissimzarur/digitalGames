-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 02, 2021 at 03:19 PM
-- Server version: 5.7.31
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `digital-games`
--

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
CREATE TABLE IF NOT EXISTS `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1020) NOT NULL,
  `img_path` varchar(255) NOT NULL,
  `price` decimal(7,2) NOT NULL,
  `is_featured` tinyint(4) NOT NULL DEFAULT '0',
  `category` tinyint(4) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `title`, `description`, `img_path`, `price`, `is_featured`, `category`, `is_active`, `created_at`) VALUES
(1, '7 Days To Die', 'aaaa', '7days.jpg', '123.00', 1, 8, 0, '2021-09-04 12:16:40'),
(2, 'Battlefield V', 'The game features several new multiplayer modes, including the \"continuous\" campaign mode \"Firestorm\", and \"Grand Operations\". The Grand Operations mode is an expansion of the \"Operations\" mode introduced in Battlefield 1, which focuses on matches taking place across multiple stages to simulate a campaign from the war. In Grand Operations, each round will have specific objectives, and performance in each stage will influence the next. If the final day ends with a close margin of victory, the match will culminate with a \"Final Stand\", with players fighting to the last man standing on a continually shrinking map.', 'BattleV.jpg', '159.99', 1, 2, 1, '2021-09-04 13:08:50'),
(8, 'World War Z: Aftermath', 'World War Z: Aftermath is the ultimate co-op zombie shooter inspired by Paramount Picturesâ€™ blockbuster film, and the next evolution of the original hit World War Z that has now captivated over 15 million players. Turn the tide of the zombie apocalypse on consoles and PC with full cross-play. Join up to three friends or play on your own with AI teammates against hordes of ravenous zombies in intense story episodes across new zombie-ravaged locations around the world. Take back Vatican City in an epic confrontation in Rome, and join forces with survivors in Russiaâ€™s snowbound Kamchatka peninsula. ', 'world-war-z-aftermath-pc-game-steam-cover.jpg', '26.49', 0, 8, 0, '2021-09-21 10:11:15'),
(3, 'Bus Simulator 21', 'Look forward to Bus Simulator 21, and the most comprehensive and advanced fleet in the history of the series. For Bus Simulator 21, a fleet of 30 officially licensed buses by well-known, international manufacturers such as Volvo, Alexander Dennis, Scania, BYD, Grande West, and Blue Bird will join the models by popular brands already included in the preceding installment (Mercedes-Benz, Setra, IVECO BUS, and MAN). For the first time, you will have the chance to master the challenges of daily traffic in the cockpit of double-decker and electric buses.', 'busSimulator.jpg', '139.99', 1, 3, 1, '2021-09-11 11:22:38'),
(4, 'Police Simulator: Patrol Officers ', 'Welcome to Brighton! Join the police force of this fictitious American city and experience the day to day life of a police officer. Start with citing violations and giving out parking tickets, then work your way towards shouldering more responsibilities. Be part of the community of Brighton, get to know your neighborhood and handle daily police work to fight crime during your shift. Always be tough, but fair: respect the law and gain more experience to unlock more neighborhoods, districts and duties.', 'PoliceSimulator.jpg', '201.99', 0, 3, 1, '2021-09-11 11:33:21'),
(5, 'Train Life', 'You not only have to drive the trains, but you also have to grow your company by optimizing your Passenger and Freight activities. Choose a name, a logo, purchase locomotives, and hire drivers, giving them new contracts and exploring new tracks. You must also maintain your locomotives to prevent breakdowns and handle emergency repairs. You are free to accept or refuse contracts: make the right choices, earn money and develop your company!', 'TrainLife.jpg', '119.99', 1, 3, 1, '2021-09-11 11:37:35'),
(6, 'Deathloop', 'DEATHLOOP is a next-gen first person shooter from Arkane Lyon, the award-winning studio behind Dishonored. In DEATHLOOP, two rival assassins are trapped in a mysterious timeloop on the island of Blackreef, doomed to repeat the same day for eternity. As Colt, the only chance for escape is to end the cycle by assassinating eight key targets before the day resets. Learn from each cycle - try new paths, gather intel, and find new weapons and abilities. Do whatever it takes to break the loop.Every new loop is an opportunity to change things up. Use the knowledge you gain from each attempt to change up your playstyle, stealthily sneaking through levels or barreling into the fight, guns-blazing.', 'deathloop.jpg', '49.99', 1, 1, 1, '2021-09-11 11:40:32'),
(7, 'Resident Evil Village', 'he game is first-person game, that allows for six-player online multi-play when preferred. The game is set a few years after the previous game, Resident Evil Seven, and Ethan Winters is once again the protagonist along with his wife, Mia, also from RE7 (see the list of important characters, below, for more). Ethan\'s inventory items are kept in a virtual \'briefcase\' which he keeps with himself at all times, paying periodic visits to a vendor called Duke who sells weapons and healing items.', 'ResidentEvilVillage.png', '79.99', 0, 8, 1, '2021-09-11 11:43:00');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `shipping_address` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `order_games_link`
--

DROP TABLE IF EXISTS `order_games_link`;
CREATE TABLE IF NOT EXISTS `order_games_link` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `game_price` decimal(10,2) NOT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pre_orders`
--

DROP TABLE IF EXISTS `pre_orders`;
CREATE TABLE IF NOT EXISTS `pre_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pre_orders_games_link`
--

DROP TABLE IF EXISTS `pre_orders_games_link`;
CREATE TABLE IF NOT EXISTS `pre_orders_games_link` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pre_order_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `system_preferences`
--

DROP TABLE IF EXISTS `system_preferences`;
CREATE TABLE IF NOT EXISTS `system_preferences` (
  `background_image` varchar(255) NOT NULL,
  `logo_image` varchar(255) NOT NULL,
  `header_image_1` varchar(255) NOT NULL,
  `header_image_2` varchar(255) NOT NULL,
  `header_image_3` varchar(255) CHARACTER SET utf8 NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `system_preferences`
--

INSERT INTO `system_preferences` (`background_image`, `logo_image`, `header_image_1`, `header_image_2`, `header_image_3`) VALUES
('VideoGames2.jpg', 'logo.png', 'dying-light-header.jpg', 'evil-header.jpeg', 'farcray-header.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `f_name` varchar(25) NOT NULL,
  `l_name` varchar(25) NOT NULL,
  `username` varchar(25) NOT NULL,
  `password` varchar(25) NOT NULL,
  `is_admin` tinyint(4) NOT NULL DEFAULT '0',
  `is_super_admin` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `f_name`, `l_name`, `username`, `password`, `is_admin`, `is_super_admin`, `created_at`) VALUES
(1, 'Nissim', 'Zarur', 'nissimzarur', 'nissimz', 1, 1, '2021-09-06 12:14:06'),
(16, 'arik', 'simoni', 'ariks', '123456789', 0, 0, '2021-10-02 12:47:23'),
(17, 'aviv', 'shimon', 'avivs', '321321', 0, 0, '2021-10-02 14:13:02'),
(18, 'itay', 'david', 'itayd', '123456', 0, 0, '2021-10-02 14:35:36');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
