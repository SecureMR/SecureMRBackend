const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post("/accounts/affiliate", accountController.createAffiliate);
router.post("/accounts/ars", accountController.createARS);

module.exports = router;
