const Book = require('../models/Book');
const fs = require('fs');

const mongoose = require('mongoose');

exports.createBook = (req, res, next) => {
  console.log('DEBUG req.body.book : ', req.body);
  console.log('DEBUG 2 image : ', req.file);
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
    .catch(error => { res.status(400).json({ error }) })
};

exports.getAllBooks = (req, res, next) => {
  Book.find().then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });

    }
  );
};

exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Tri décroissant sur averageRating
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  }).then(
    (book) => {
      res.status(200).json(book);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...req.body, _id: req.params.id }
        )
          .then(() => {
            res.status(200).json({ message: 'Objet modifié !' });
          })
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};


// exports.addRating = (req, res, next) => {
//   const bookId = req.params.id;
//   const userId = req.auth.userId;
//   const { grade } = req.body; // Le champ attendu est `grade`

//   console.log('DEBUG req.body:', req.body);
//   console.log('DEBUG req.params.id:', req.params.id);
//   console.log('DEBUG req.auth.userId:', req.auth.userId);

//   if (!grade || grade < 0 || grade > 5) {
//     return res.status(400).json({ message: 'La note doit être entre 0 et 5. est le pb est ici' });
//   }

//   Book.findOne({ _id: bookId })
//     .then(book => {
//       if (!book) {
//         return res.status(404).json({ message: 'Livre non trouvé.' });
//       }

//       // Vérifie si l'utilisateur a déjà noté
//       const existingRating = book.ratings.find(rating => rating.userId === userId);
//       if (existingRating) {
//         return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
//       }

//       // Ajoute le nouveau rating
//       book.ratings.push({ userId, grade });

//       // Recalcule la moyenne
//       const totalRatings = book.ratings.length;
//       const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
//       book.averageRating = sumRatings / totalRatings;

//       // Sauvegarde les modifications
//       book.save()
//         .then(() => res.status(200).json({ message: 'Note ajoutée avec succès.', book }))
//         .catch(error => res.status(500).json({ error }));
//     })
//     .catch(error => res.status(500).json({ error }));
// };



exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Objet supprimé !' });
            })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

