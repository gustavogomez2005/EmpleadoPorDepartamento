CREATE DATABASE IF NOT EXISTS Personal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Personal;

-- Tabla Departamento
CREATE TABLE Departamento (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    presupuesto DECIMAL(12, 2) DEFAULT 0.00,
    CONSTRAINT uq_depto_nombre UNIQUE (nombre)
);

-- Tabla Empleado
CREATE TABLE Empleado (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    sexo ENUM('Femenino', 'Masculino') NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fecha_incorporacion DATE NOT NULL,
    sueldo DECIMAL(12, 2) NOT NULL,
    comision DECIMAL(12, 2) DEFAULT 0.00,
    cargo VARCHAR(100) NOT NULL,
    codigo_departamento INT NOT NULL,
    codigo_jefe INT NULL,
    CONSTRAINT fk_empleado_departamento FOREIGN KEY (codigo_departamento) 
        REFERENCES Departamento(codigo) ON DELETE RESTRICT,
    CONSTRAINT fk_empleado_jefe FOREIGN KEY (codigo_jefe) 
        REFERENCES Empleado(codigo) ON DELETE SET NULL
);

-- Tabla Usuario
CREATE TABLE Usuario (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    rol ENUM('operador', 'administrador') NOT NULL DEFAULT 'operador',
    intentos_fallidos INT DEFAULT 0,
    bloqueado BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR(255) NULL,
    reset_token_expires DATETIME NULL
);


ALTER TABLE Usuario ADD COLUMN provider_id VARCHAR(255) NULL;
ALTER TABLE Usuario ADD COLUMN provider VARCHAR(50) NULL; -- 'google', 'github', etc.
