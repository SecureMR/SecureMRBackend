const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const privacyController = require('../controllers/privacyController');
const documentController = require('../controllers/documentController');
const {catchErrors} = require('../handlers/errorHandler');
const auth = require('../middlewares/auth')


router.post("/accounts/login", catchErrors(accountController.login));
router.post("/accounts/checkToken", catchErrors(accountController.checkToken));

router.post("/accounts/affiliate/create", catchErrors(accountController.createAffiliate));
router.post("/accounts/ars/create", catchErrors(accountController.createARS));
router.post("/accounts/pss/create",   catchErrors(accountController.createPSS));
router.post("/accounts/medicalProfessional/create", catchErrors(accountController.createMedicalProfessional));

router.get("/accounts/affiliate", auth, catchErrors(accountController.getAffiliate));
router.get("/accounts/pss", auth, catchErrors(accountController.getPSS)); 
router.get("/accounts/ars", auth, catchErrors(accountController.getARS));
router.get("/accounts/medicalProfessional", auth, catchErrors(accountController.getMedicalProfessional));

router.post("/privacy/affiliate/trustedusers/add", auth, catchErrors(privacyController.addTrustedUser));
router.get("/privacy/affiliate/trustedusers/get", auth, catchErrors(privacyController.getTrustedUsers));
router.get("/privacy/affiliate/trustedusers/getdocument", auth, catchErrors(privacyController.getOneDocumentTrustedUser));
router.get("/privacy/affiliate/trustedusers/getdocuments", auth, catchErrors(privacyController.getDocumentsTrustedUser));
router.delete("/privacy/affiliate/trustedusers/delete", auth, catchErrors(privacyController.deleteTrustedUser));
router.post("/privacy/affiliate/documentrequests/add", auth, catchErrors(privacyController.requestDocuments));
router.post("/privacy/affiliate/documentrequests/changestate", auth, catchErrors(privacyController.changeDocumentRequestState));

router.post("/documents/add", auth, catchErrors(documentController.addDocument))
router.delete("/documents/delete", auth, catchErrors(documentController.deleteDocument))

// TESTING ROUTES
router.post("/test/upload", documentController.testUploadDocument)
router.get("/test/download", documentController.testDownloadDocument)

module.exports = router;
