const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Helper function for register to check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    Promise.resolve(books)
      .then(data => {
        res.send(JSON.stringify(data, null, 4));
      })
      .catch(err => {
        res.status(500).send('Error fetching books');
      });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
  
    Promise.resolve(books[isbn])
      .then(book => {
        if (book) {
          res.send(book);
        } else {
          res.status(404).send('Book not found');
        }
      })
      .catch(err => {
        res.status(500).send('Error fetching book by ISBN');
      });
  });

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
  
    Promise.resolve(Object.values(books))
      .then(bookArray => {
        const booksByAuthor = bookArray.filter(book => book.author === author);
        res.send(JSON.stringify(booksByAuthor, null, 4));
      })
      .catch(err => {
        res.status(500).send('Error fetching books by author');
      });
  });
  

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
  
    Promise.resolve(Object.values(books))
      .then(bookArray => {
        const booksByTitle = bookArray.filter(book => book.title === title);
        res.send(JSON.stringify(booksByTitle, null, 4));
      })
      .catch(err => {
        res.status(500).send('Error fetching books by title');
      });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let review = books[req.params.isbn]["review"];
  return res.send(JSON.stringify(review, null, 4));
});

module.exports.general = public_users;
