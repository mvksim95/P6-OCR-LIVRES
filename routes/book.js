const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config');

const bookCtrl = require ('../controllers/book');

router.post('/', auth, multer, bookCtrl.createBook)

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;

// getOneThing, deleteThing, modifyThing 