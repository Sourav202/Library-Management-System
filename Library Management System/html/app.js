document.addEventListener("DOMContentLoaded", () => {
    //retrieve all books present in the db
    fetchBooks();
    
    //hide/show add book form
    const addBookButton = document.getElementById("addBookButton");
    const addBookForm = document.getElementById("addBookForm");
    
    addBookButton.addEventListener("click", () => {
        addBookForm.style.display = addBookForm.style.display === "none" ? "block" : "none";
    });
    
    //event listener to add a new book
    addBookForm.addEventListener("submit", function(event) {
        event.preventDefault();
    
        //retrieve form data
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const genre = document.getElementById("genre").value;
        const date = document.getElementById("date").value;
        const isbn = document.getElementById("isbn").value;
    
        //send book data to the server.js
        fetch('/add-book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: title,
            author: author,
            genre: genre,
            date: date,
            isbn: isbn,
        }),
        })
        .then(response => response.json())
        .then(data => {
        if (data.success) {
            //clear and refresh fields
            addBookForm.reset();
            addBookForm.style.display = "none";
            fetchBooks();
        } else {
            alert("book not added: " + data.message);
        }
        })
        .catch(error => {
        console.error(error);
        alert("Book was not added - ISBN already exsists within this system!");
        });
    });
    
    //event listener search form 
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
    
        //retrieve form data
        const searchTitle = document.getElementById("searchTitle").value;
        const searchAuthor = document.getElementById("searchAuthor").value;
        const searchGenre = document.getElementById("searchGenre").value;
    
        //find filtered books based on search criteria
        fetch(`/books?title=${encodeURIComponent(searchTitle)}&author=${encodeURIComponent(searchAuthor)}&genre=${encodeURIComponent(searchGenre)}`)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const booksTableBody = document.querySelector('#booksTable tbody');
            booksTableBody.innerHTML = ''; 
            if (data.length === 0) {
                //no data exists with these tags
                booksTableBody.innerHTML = '<tr><td colspan="6">Sorry, no books match your search</td></tr>';
            } else {
            data.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>${book.date}</td>
                <td>${book.isbn}</td>
                `;
                booksTableBody.appendChild(row);
            });
            }
        })
        .catch(err => console.error('Error fetching books:', err));
    });
    
    //display books in table
    function fetchBooks() {
        fetch('/books')
        .then(response => response.json())
        .then(data => {
            const booksTableBody = document.querySelector('#booksTable tbody');
            booksTableBody.innerHTML = ''; 
            //data does not exist
            if (data.length === 0) {
            booksTableBody.innerHTML = '<tr><td colspan="6">No books available</td></tr>';
            } else {
            data.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>${book.date}</td>
                <td>${book.isbn}</td>
                `;
                booksTableBody.appendChild(row);
            });
            }
        })
        .catch(err => console.error('Error fetching books:', err));
    }
    //export as CSV handler
    const exportCSVButton = document.getElementById("exportCSVButton");
    exportCSVButton.addEventListener("click", function() {
        fetch('/export?format=csv')
            .then(response => response.blob())
            .then(blob => {
            //download link for CSV
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'library_inventory.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            })
            .catch(err => console.error(err));
    });
    
    //export as JSON
    const exportJSONButton = document.getElementById("exportJSONButton");
    exportJSONButton.addEventListener("click", function() {
        fetch('/export?format=json')
            .then(response => response.blob())
            .then(blob => {
            //download link for JSON
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'library_inventory.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
            })
            .catch(err => console.error(err));
        });
    });
    