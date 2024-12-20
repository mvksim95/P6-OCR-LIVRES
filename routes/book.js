const express = require ('express');
const router = express.Router();

const auth = require('../middleware/auth');

const bookCtrl = require ('../controllers/book');

router.post('/', auth, bookCtrl.createBook);

router.get('/', bookCtrl.getAllBooks);

module.exports = router;

// getOneThing, deleteThing, modifyThing 