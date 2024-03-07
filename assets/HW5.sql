CREATE TABLE Movie (
  imdbID INT PRIMARY KEY,
  Title NVARCHAR(255),
  Year INT,
  Rated NVARCHAR(255),
  Released NVARCHAR(255),
  Runtime NVARCHAR(255),
  Genre NVARCHAR(255),
  Plot NVARCHAR(255),
  Language NVARCHAR(255),
  Country NVARCHAR(255),
  Awards NVARCHAR(255),
  Poster NVARCHAR(255),
  imdbRating INT,
  imdbVotes INT,
  Type NVARCHAR(255),
  DVD NVARCHAR(255),
  BoxOffice NVARCHAR(255),
  Production NVARCHAR(255),
  Website NVARCHAR(255),
  Response BIT,
  stars INT,
  creators INT
);

CREATE TABLE stars (
  pid INT PRIMARY KEY
);

CREATE TABLE creators (
  pid INT PRIMARY KEY
);

CREATE TABLE Person (
  pid INT PRIMARY KEY,
  name NVARCHAR(255),
  lastname NVARCHAR(255),
  age NVARCHAR(255),
  detail NVARCHAR(255)
);

ALTER TABLE Movie ADD FOREIGN KEY (creators) REFERENCES creators (pid);

ALTER TABLE Movie ADD FOREIGN KEY (stars) REFERENCES stars (pid);

ALTER TABLE Person ADD FOREIGN KEY (pid) REFERENCES creators (pid);

ALTER TABLE Person ADD FOREIGN KEY (pid) REFERENCES stars (pid);