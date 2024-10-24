PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
--create the library db table
CREATE TABLE IF NOT EXISTS Inventory (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    date DATE,
    isbn TEXT UNIQUE NOT NULL
);
--base data for the library
INSERT Or IGNORE INTO Inventory (title, author, genre, date, isbn) VALUES
    ('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', '1937-09-21', '9780547928227'),
    ('To Kill a Mockingbird', 'Harper Lee', 'Fiction', '1960-07-11', '9780061120084'),
    ('Bone: Out from Boneville', 'Jeff Smith', 'Fantasy', '1991-07-01', '9780439706407'),
    ('Five Nights at Freddy''s: The Silver Eyes', 'Scott Cawthon', 'Horror', '2015-12-17', '9781338134377'),
    ('Geronimo Stilton: Lost Treasure of the Emerald Eye', 'Geronimo Stilton', 'Fiction', '2000-05-01', '9780439559638'),
    ('The White Tiger', 'Aravind Adiga', 'Fiction', '2008-04-22', '9781416562603'),
    ('Death of a Salesman', 'Arthur Miller', 'Drama', '1949-02-10', '9780140481341'),
    ('Dune', 'Frank Herbert', 'Science Fiction', '1965-08-01', '9780441172719'),
    ('Pride and Prejudice', 'Jane Austen', 'Romance', '1813-01-28', '9781503290563'),
    ('Moby Dick', 'Herman Melville', 'Adventure', '1851-10-18', '9781503280786'),
    ('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', '1925-04-10', '9780743273565'),
    ('The Wright Brothers', 'David McCullough', 'Non-Fiction', '2015-05-05', '9781476728759');

COMMIT;