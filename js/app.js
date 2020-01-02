// Book Class: Represents a Book

class Book {
    constructor(title, author, idBook){
        this.title = title;
        this.author = author;
        this.idBook = idBook;
    }
}

// UI Class: Handle UI Tasks

class UI {
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach( (book) => UI.addBookToList(book) )
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        
        row.innerHTML = '<td>'+ book.title +'</td>';
        row.innerHTML += '<td>'+ book.author + '</td>';
        row.innerHTML += '<td>'+ book.idBook + '</td>';
        row.innerHTML += '<td> <a href="#" class="btn btn-danger btn-sm delete"> X </a> </td>';

        list.appendChild(row);
               
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = 'alert alert-' + className;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#idBook').value = '';
    }

    static deleteBook(element){
        if(element.classList.contains('delete')){
            element.parentElement.parentElement.remove();
        }
    }
}

// Strore Class: Handles Storage

class Store {
    static getBooks(){
        let books;
        
        if (localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse( localStorage.getItem('books') );
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(idBook) { 
        const books = Store.getBooks();

        books.forEach( (book, index) => {
            if (book.idBook === idBook) {
                books.splice(index, 1);
            }
        } );

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Books
const bookForm = document.querySelector('#book-form');

bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    //Get Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const idBook = document.querySelector('#idBook').value;

    //Validate
    if (title === '' || author === '' || idBook === '' ) {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        const book = new Book(title, author, idBook);

        //Add UI
        UI.addBookToList(book);

        //Add Store
        Store.addBook(book)

        UI.showAlert('Success!', 'success');

        //clear fields
        UI.clearFields();
    }
});

// Event: Remove a Books
document.querySelector('#book-list').addEventListener('click', (event) => {
    UI.deleteBook(event.target);
    Store.removeBook(event.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Boook Remove!', 'success');
});