DROP DATABASE sidewerk_dev;

CREATE DATABASE sidewerk_dev;

USE sidewerk_dev;

CREATE TABLE items(
    id INT AUTO_INCREMENT NOT NULL,
    item_name VARCHAR(100) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE list(
    id INT AUTO_INCREMENT NOT NULL,
    list_name VARCHAR(100) NOT NULL,
    list_owner VARCHAR(100) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE list_items(
    id INT AUTO_INCREMENT NOT NULL,
    task_name VARCHAR(100) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    listID INT,
    FOREIGN KEY (listID) REFERENCES list(id),

    PRIMARY KEY (id)
);

CREATE TABLE users(
    id INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(20) NOT NULL,
    password CHAR(60) NOT NULL,
        
    PRIMARY KEY (id),

    UNIQUE INDEX id_UNIQUE (id ASC),
    UNIQUE INDEX username_UNIQUE (username ASC)

);

CREATE TABLE list_joiners(
    id INT AUTO_INCREMENT NOT NULL,
    joiner VARCHAR(100) NOT NULL,
    confirmed BOOLEAN NOT NULL DEFAULT 0,
    listID INT,
    FOREIGN KEY (listID) REFERENCES list(id),

    PRIMARY KEY (id)
);