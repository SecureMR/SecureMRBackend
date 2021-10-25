const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const {catchErrors} = require('../handlers/errorHandler');

router.post("/accounts/affiliate/create", accountController.createAffiliate);
router.post("/accounts/ars/create", accountController.createARS);
router.post("/accounts/pss/create", accountController.createPSS);
router.post("/accounts/medicalProfessional/create", accountController.createMedicalProfessional);
router.get("/accounts/affiliate", accountController.getAffiliate);
router.get("/accounts/pss", accountController.getPSS);
router.get("/accounts/ars", accountController.getARS);
router.get("/accounts/medicalProfessional", accountController.getMedicalProfessional);
router.post("/accounts/login", accountController.login);

module.exports = router;
