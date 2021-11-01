// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("affiliate")
 .readOwn("profile")
 .updateOwn("profile")
 .readOwn("documents")
 .updateOwn("documents")
 .readOwn("contacts")
 .updateOwn("contacts");
 
ac.grant("pss")
 .readOwn("profile")
 .updateOwn("profile")
 .readOwn("documents")
 .updateOwn("documents");
 
ac.grant("admin")
 .readAny("users")

ac.grant("medicalProfessional")
 .readOwn("profile")
 .updateOwn("profile")
 .readOwn("documents")
 .updateOwn("documents");

 
return ac;
})();