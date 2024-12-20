const Book = require ('../models/Book');

exports.createBook = (req, res, next) => {
    delete req.body._id;
    const book = new Book({
        ...req.body
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
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