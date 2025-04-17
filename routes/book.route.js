import express from 'express';
import { addBooks } from '../controllers/bookController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { deleteBook, getAllBooks, getRecommendedBooks } from '../controllers/bookController.js';

const router = express.Router();


router.post('/',verifyToken,addBooks)
router.get('/',getAllBooks)
router.get('/recommended',verifyToken,getRecommendedBooks)
router.delete('/:id',verifyToken,deleteBook)

export default router