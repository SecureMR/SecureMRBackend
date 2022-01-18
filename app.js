const express = require("express");

const app = express();

const jwt = require("jsonwebtoken");

const multer = require('multer')

app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Setup Cross Origin
app.use(require('cors')());

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024,
    },
});

app.use(multerMid.single('file'))

// app.use(async (req, res, next) => {
//     if (req.headers["x-access-token"]) {
//      const accessToken = req.headers["x-access-token"];
//      const { credId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
//      // Check if token has expired
//      if (exp < Date.now().valueOf() / 1000) { 
//       return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
//      } 
//      res.locals.loggedInUser = await Credentials.findById(credId); next(); 
//     } else { 
//      next(); 
//     } 
//    });

app.use(function (req, res, next) {
    console.log('Time: ' + Date.now() + ' ' + 'Type: ' + req.method + ' ' + 'Path: ' + req.path);
    next()
})

//Bring in the routes
// app.use("/user", require("./routes/user"));
// app.use("/chatroom", require("./routes/chatroom"));
app.use( require("./routes/route"))

//Setup Error Handlers
const errorHandlers = require('./handlers/errorHandler');
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongooseErrors);
// eslint-disable-next-line no-undef
if (process.env.ENV == "DEVELOPMENT"){
    app.use(errorHandlers.developmentErrors);
} else {
    app.use(errorHandlers.productionErrors)
}


module.exports = app;