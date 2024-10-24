/*
(c) 2023 Louis D. Nel
Based on:
https://socket.io
see in particular:
https://socket.io/docs/
https://socket.io/get-started/chat/
*/
const http = require("http");
const fs = require("fs");
const url = require("url");
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { parse } = require('json2csv');

//init SQLite database
let db = new sqlite3.Database('library.db', (err) => {
    if (err) {
        console.error('Error opening database:');
    } else {
        //read SQL file
        fs.readFile('library.sql', 'utf8', (err, sql) => {
            if (err) {
                console.error('Error reading library.sql file:');
            } else {
                db.exec(sql, (err) => {
                if (err) {
                    console.error('Error executing library.sql:');
                }});
            }
        });
    }
});

//create server
http.createServer(function (request, response) {
    const urlObj = url.parse(request.url, true, false);
    //export requests for CSV and JSON
    if (request.method === 'GET' && urlObj.pathname === '/export') {
        const format = urlObj.query.format;

        //retrieve books from the database
        const sql = "SELECT * FROM Inventory";
        db.all(sql, [], (err, rows) => {
            if (!err) {
                if (format === 'json') {
                    //export as JSON
                    response.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Content-Disposition': 'attachment; filename=library_inventory.json'
                    });
                    response.end(JSON.stringify(rows, null, 2));
                } else if (format === 'csv') {
                    //export as CSV
                    const fields = ['id', 'title', 'author', 'genre', 'date', 'isbn'];
                    const csv = parse(rows, { fields }); 
                    response.writeHead(200, {
                        'Content-Type': 'text/csv',
                        'Content-Disposition': 'attachment; filename=library_inventory.csv'
                    });
                    response.end(csv);
                }
            }
        });
    }

  //handle filter books
    else if (request.method === 'GET' && urlObj.pathname === '/books') {
        const { title, author, genre } = urlObj.query;
        let sql = "SELECT * FROM Inventory WHERE 1=1";
        const params = [];

        if (title && title.trim() !== '') {
        sql += " AND title LIKE ?";
        params.push(`%${title}%`);
        }
        if (author && author.trim() !== '') {
        sql += " AND author LIKE ?";
        params.push(`%${author}%`);
        }
        if (genre && genre.trim() !== '') {
        sql += " AND genre = ?";
        params.push(genre);
        }
        db.all(sql, params, (err, rows) => {
        if (err) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ success: false, message: 'Error fetching books' }));
        } else {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(rows));
        }
        });
    }

    //handle adding books
    else if (request.method === 'POST' && urlObj.pathname === '/add-book') {
        let body = '';

        request.on('data', chunk => {
        body += chunk.toString(); 
        });

        request.on('end', () => {
        try {
            const data = JSON.parse(body);
            const { title, author, genre, date, isbn } = data;
            const sql = `INSERT INTO Inventory (title, author, genre, date, isbn) VALUES (?, ?, ?, ?, ?)`;
            db.run(sql, [title, author, genre, date, isbn], function (err) {
            if (err) {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({ success: false, message: 'could not add book' }));
            } else {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({ success: true, message: 'book added successfully' }));
            }
            });
        } catch (error) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ success: false, message: 'Invalid JSON data' }));
        }
        });
    }

    //static html file
    else if (request.method === 'GET') {
        let filePath = 'html' + urlObj.pathname;
        if (urlObj.pathname === "/") filePath = 'html/index.html';

        fs.readFile(filePath, function (err, data) {
        if (err) {
            response.writeHead(404);
            response.end("404 Not Found");
        } else {
            response.writeHead(200);
            response.end(data);
        }
        });
    }
    }).listen(3000);

console.log("Server running at http://localhost:3000");
