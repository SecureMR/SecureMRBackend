const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const privacyController = require('../controllers/privacyController');
const documentController = require('../controllers/documentController');
const {catchErrors} = require('../handlers/errorHandler');

router.post("/accounts/login", catchErrors(accountController.login));

router.post("/accounts/affiliate/create",catchErrors(accountController.createAffiliate));
router.post("/accounts/ars/create", catchErrors(accountController.createARS));
router.post("/accounts/pss/create",   catchErrors(accountController.createPSS));
router.post("/accounts/medicalProfessional/create", catchErrors(accountController.createMedicalProfessional));

router.get("/accounts/affiliate",   catchErrors(accountController.getAffiliate));
router.get("/accounts/pss",   catchErrors(accountController.getPSS));
router.get("/accounts/ars",   catchErrors(accountController.getARS));
router.get("/accounts/medicalProfessional",   catchErrors(accountController.getMedicalProfessional));

router.post("/privacy/affiliate/trustedusers/add",   catchErrors(privacyController.addTrustedUser));
router.get("/privacy/affiliate/trustedusers/get",   catchErrors(privacyController.getTrustedUsers));
router.get("/privacy/affiliate/trustedusers/getdocument",   catchErrors(privacyController.getOneDocumentTrustedUser));
router.get("/privacy/affiliate/trustedusers/getdocuments",   catchErrors(privacyController.getDocumentsTrustedUser));
router.delete("/privacy/affiliate/trustedusers/delete",   catchErrors(privacyController.deleteTrustedUser));
router.post("/privacy/affiliate/documentrequests/add",   catchErrors(privacyController.requestDocuments));
router.post("/privacy/affiliate/documentrequests/changestate",   catchErrors(privacyController.changeDocumentRequestState));

router.post("/documents/add",   catchErrors(documentController.addDocument))
router.delete("/documents/delete",   catchErrors(documentController.deleteDocument))

module.exports = router;
