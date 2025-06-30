const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });     
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });
      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  // Check if the ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if user is logged in and review is provided
  if (!username || !review) {
    return res.status(400).json({ message: "Missing username or review." });
  }

  // Post or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully posted/updated.",
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const book = books[isbn];

    // Check if book exists
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Check if user's review exists
    if (!book.reviews[username]) {
        return res.status(404).json({ message: `No review found for user ${username}.` });
    }

    // Delete the user's review
    let review = book.reviews[username]
    delete book.reviews[username];

    res.send(`Review by ${username} on ${book} - ${review} - has been deleted.`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
