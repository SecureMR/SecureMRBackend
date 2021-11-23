const mongoose = require("mongoose");
require("dotenv").config();

// Bring in the models

require('./models/Affiliate');
require('./models/ARS');
const Credentials = require('./models/Credentials');
require('./models/Dependent');
require('./models/DocType');
require('./models/Document');
require('./models/MedicalProfessional');
require('./models/Profile');
require('./models/PSS');

const app = require('./app');

// eslint-disable-next-line no-undef
const server = app.listen(process.env.PORT || 8000, () =>{
    console.log("Server listening on port 8000")
});

app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
     const accessToken = req.headers["x-access-token"];
     const { credId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
     // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) { 
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
     } 
     res.locals.loggedInUser = await Credentials.findById(credId); next(); 
    } else { 
     next(); 
    } 
   });

const Affiliate = mongoose.model("Affiliate"); 
const ARS = mongoose.model("ARS"); 
const Credentials = mongoose.model("Credentials"); 
const Dependent = mongoose.model("Dependent"); 
const DocType = mongoose.model("DocType"); 
const Document = mongoose.model("Document"); 
const MedicalProfessional = mongoose.model("MedicalProfessional"); 
const Profile = mongoose.model("Profile"); 
const PSS = mongoose.model("PSS"); 