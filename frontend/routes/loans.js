const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createLoan, getLoansByUser, deleteLoan } = require('../controllers/loanController');

router.use(authMiddleware);

router.post('/', createLoan);

router.get('/:userId', getLoansByUser);

router.delete('/:loanId', deleteLoan);

module.exports = router;
