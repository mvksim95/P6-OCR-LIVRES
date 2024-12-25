const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config');

const bookCtrl = require ('../controllers/book');


//toutes les routes ci dessous

router.post('/', auth, multer, bookCtrl.createBook);

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRating);
// router.post('/:id/rating', auth, bookCtrl.addRating);

router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);


module.exports = router;

