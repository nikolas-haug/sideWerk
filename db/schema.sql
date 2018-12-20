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
    task_name VARCHAR(100) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,

    PRIMARY KEY (id)
);