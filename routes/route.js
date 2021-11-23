const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const privacyController = require('../controllers/privacyController');
const documentController = require('../controllers/documentController');
const {catchErrors} = require('../handlers/errorHandler');

router.post("/accounts/login", catchErrors(accountController.login));

router.post("/accounts/affiliate/create", accountController.allowIfLoggedin, catchErrors(accountController.createAffiliate));
router.post("/accounts/ars/create", accountController.allowIfLoggedin, catchErrors(accountController.createARS));
router.post("/accounts/pss/create", accountController.allowIfLoggedin, catchErrors(accountController.createPSS));
router.post("/accounts/medicalProfessional/create", accountController.allowIfLoggedin, catchErrors(accountController.createMedicalProfessional));

router.get("/accounts/affiliate", accountController.allowIfLoggedin, catchErrors(accountController.getAffiliate));
router.get("/accounts/pss", accountController.allowIfLoggedin, catchErrors(accountController.getPSS));
router.get("/accounts/ars", accountController.allowIfLoggedin, catchErrors(accountController.getARS));
router.get("/accounts/medicalProfessional", accountController.allowIfLoggedin, catchErrors(accountController.getMedicalProfessional));

router.post("/privacy/affiliate/trustedusers/add", accountController.allowIfLoggedin, catchErrors(privacyController.addTrustedUser));
router.get("/privacy/affiliate/trustedusers/get", accountController.allowIfLoggedin, catchErrors(privacyController.getTrustedUsers));
router.get("/privacy/affiliate/trustedusers/getdocument", accountController.allowIfLoggedin, catchErrors(privacyController.getOneDocumentTrustedUser));
router.get("/privacy/affiliate/trustedusers/getdocuments", accountController.allowIfLoggedin, catchErrors(privacyController.getDocumentsTrustedUser));
router.delete("/privacy/affiliate/trustedusers/delete", accountController.allowIfLoggedin, catchErrors(privacyController.deleteTrustedUser));
router.post("/privacy/affiliate/documentrequests/add", accountController.allowIfLoggedin, catchErrors(privacyController.requestDocuments));
router.post("/privacy/affiliate/documentrequests/changestate", accountController.allowIfLoggedin, catchErrors(privacyController.changeDocumentRequestState));

router.post("/documents/add", accountController.allowIfLoggedin, catchErrors(documentController.addDocument))
router.delete("/documents/delete", accountController.allowIfLoggedin, catchErrors(documentController.deleteDocument))

module.exports = router;
