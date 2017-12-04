'use strict';

// const express = require('express')
// const app = express()
// const port = process.env.PORT || 3000
// // const knex = require('./db');
// const { camelizeKeys, decamelizeKeys } = require('humps');

const boom = require('boom');
const express = require('express');
const router = express.Router();
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// YOUR CODE HERE

router.get('/books', (req, res, next) => {
  knex('books').orderBy('title')
    .then( (result) => {
      const books = camelizeKeys(result)
      res.status(200).json(books);
    });
})

router.get('/books/:id', (req, res, next) => {
  const id = req.params.id;
  knex('books').where('id', id).first()
    .then((result) => {
      const book = camelizeKeys(result);
      res.status(200).json(book);
    })
})

router.post('/books', (req, res, next) => {
  const { title, author, genre, description, coverUrl } = req.body;

  const insertBook = { title, author, genre, description, coverUrl };

  knex('books')
    .insert(decamelizeKeys(insertBook), '*')
    .then((rows) => {
      const book = camelizeKeys(rows[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id);

  knex('books')
    // .select()
    .where('id', id)
    .first()
    .then((book) => {
      const { title, author, genre, description, coverUrl } = req.body;
      const updateBook = {};

      if (title) {
        updateBook.title = title;
      }

      if (author) {
        updateBook.author = author;
      }

      if (genre) {
        updateBook.genre = genre;
      }

      if (description) {
        updateBook.description = description;
      }

      if (coverUrl) {
        updateBook.coverUrl = coverUrl;
      }

      return knex('books')
        .update(decamelizeKeys(updateBook), '*')
        .where('id', id);
    })
    .then((results) => {
      const book = camelizeKeys(results[0])
      res.send(book)
    })
    .catch((err) => {
      next(err);
    })

})

router.delete('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id);

  let book;

  knex('books')
    .where('id', id)
    .first()
    .then((row) => {
      book = camelizeKeys(row);

      return knex('books')
        .del()
        .where('id', id);
    })
    .then(() => {
      delete book.id;

      res.send(book);
    })
})

module.exports = router;
