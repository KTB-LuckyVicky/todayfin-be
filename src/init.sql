CREATE DATABASE IF NOT EXISTS TodayFin default CHARACTER SET UTF8;

USE TodayFin;

CREATE TABLE IF NOT EXISTS User (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    oauthProvider VARCHAR(20) NOT NULL,
    oauthId VARCHAR(30) NOT NULL,
    nickname VARCHAR(10) NOT NULL,
    name VARCHAR(10) NOT NULL,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Post (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    authorId INT NOT NULL,
    FOREIGN KEY (authorId) REFERENCES User(_id)
);