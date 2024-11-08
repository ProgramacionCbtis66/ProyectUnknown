-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: adae
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos` (
  `id_alumno` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `semestre` int NOT NULL,
  `grupo` varchar(45) NOT NULL,
  `especialidad` varchar(100) NOT NULL,
  `numero_control` varchar(20) NOT NULL,
  `turno` enum('Matutino','Vespertino') NOT NULL,
  `curp` varchar(18) NOT NULL,
  PRIMARY KEY (`id_alumno`),
  UNIQUE KEY `numero_control` (`numero_control`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `alumnos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `alumnos_clases`
--

DROP TABLE IF EXISTS `alumnos_clases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos_clases` (
  `id_alumno_clase` int NOT NULL AUTO_INCREMENT,
  `id_alumno` int NOT NULL,
  `id_clase` int NOT NULL,
  PRIMARY KEY (`id_alumno_clase`),
  KEY `id_alumno` (`id_alumno`),
  KEY `id_clase` (`id_clase`),
  CONSTRAINT `alumnos_clases_ibfk_1` FOREIGN KEY (`id_alumno`) REFERENCES `alumnos` (`id_alumno`) ON DELETE CASCADE,
  CONSTRAINT `alumnos_clases_ibfk_2` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id_clase`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencias` (
  `id_asistencia` int NOT NULL AUTO_INCREMENT,
  `id_alumno_clase` int NOT NULL,
  `fecha` date NOT NULL,
  `estado_asistencia` enum('Asistió','Retardo','Inasistencia') NOT NULL,
  PRIMARY KEY (`id_asistencia`),
  KEY `id_alumno_clase` (`id_alumno_clase`),
  CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`id_alumno_clase`) REFERENCES `alumnos_clases` (`id_alumno_clase`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clases`
--

DROP TABLE IF EXISTS `clases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clases` (
  `id_clase` int NOT NULL AUTO_INCREMENT,
  `nombre_clase` varchar(100) NOT NULL,
  `id_profesor` int NOT NULL,
  PRIMARY KEY (`id_clase`),
  KEY `id_profesor` (`id_profesor`),
  CONSTRAINT `clases_ibfk_1` FOREIGN KEY (`id_profesor`) REFERENCES `profesores` (`id_profesor`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `profesores`
--

DROP TABLE IF EXISTS `profesores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesores` (
  `id_profesor` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id_profesor`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `profesores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `correo_institucional` varchar(100) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `rol` enum('Alumno','Profesor','Administrador') NOT NULL,
  `foto` blob,
  `fecha_nac` date DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo_institucional` (`correo_institucional`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-04 11:46:51
