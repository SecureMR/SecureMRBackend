const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const {catchErrors} = require('../handlers/errorHandler');

router.post("/accounts/affiliate/create", accountController.createAffiliate);
router.post("/accounts/ars/create", accountController.createARS);

module.exports = router;
