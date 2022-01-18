// const jwt = require('jwt-then');
const jwt = require('jsonwebtoken');
// module.exports = async (req, res, next) => {
//     try {
//         if (!req.headers.authorization) throw "Forbidden!"
//         const token = req.headers.authorization.split(' ')[1];
//         // eslint-disable-next-line no-undef
//         const payload = await jwt.verify(token, process.env.SECRET);
//         req.payload = payload;
//         next();
//     } catch (err) {
//         //console.log(err)
//         res.status(401).json({
//             message: "Forbidden! ERROR"
//         });
//     }
    
   
// }

module.exports = async (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            return res.status(403).json({message: "No credentials sent!"})
        }

        const accessToken = req.headers.authorization.split(' ')[1];

        const payload = await jwt.verify(accessToken, process.env.SECRET);

        res.locals.loggedUser = payload.userId;
        next();

    } catch (error) {
        return res.status(403).json({message: "Credentials are incorrect or expired!"})
    }
};

// module.exports = async (req, res, next) => {
//     if(!req.headers.authorization) {
//         return res.status(403).json({message: "No credentials sent!"})
//     }
//     next();
// }