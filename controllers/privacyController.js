const mongoose = require('mongoose');

const Affiliate = mongoose.model('Affiliate');
const ARS = mongoose.model('ARS');
const Document = mongoose.model('Document');
const DocType = mongoose.model('DocType');
const PSS = mongoose.model('PSS');
const Credentials = mongoose.model('Credentials');
const MedicalProfessional = mongoose.model('MedicalProfessional');

const conn = require('../models');

const jwt = require('jsonwebtoken');

exports.getTrustedUsers = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const accessToken = token.split(' ')[1];
        const payload = await jwt.verify(accessToken, process.env.SECRET);

        if (payload.role != 'affiliate') return res.status(401).json({message:"You don't have enough permission to perform this action"});
        
        const affiliateExists = await Affiliate.findOne({credentials: payload.userId});
        if(!affiliateExists) throw "Affiliate doesn't exist!";

        // await affiliateExists.populate({
        //     path: 'trustedUsers',
        //     select: 'userName role'
        // });

        //console.log(affiliateExists);
        
        const trustedUsers = affiliateExists.trustedUsers.map(id => ({id}));

        const medicalProfessionals = await MedicalProfessional.find({
            'credentials': {$in: affiliateExists.trustedUsers}
        }, 'medicalLicense profile credentials').populate([{
            path: 'profile',
            select: 'name lastName birthDate'
        }, {
            path: 'credentials',
            select: 'role'
        }]);

        const affiliates = await Affiliate.find({
            'credentials': {$in: affiliateExists.trustedUsers}
        }, 'idNumber profile credentials').populate([{
            path: 'profile',
            select: 'name lastName birthDate'
        }, {
            path: 'credentials',
            select: 'role'
        }]);

        var mergedList = medicalProfessionals.concat(affiliates);
        var result = [];
        
        mergedList.forEach(i => {
            if (i.credentials.role == 'affiliate') {
                var newObject = {name: i.profile.name + ' ' + i.profile.lastName, role: i.credentials.role, idNumber: i.idNumber, age: calculate_age(i.profile.birthDate) };
                result.push(newObject)
            } else if (i.credentials.role == 'medicalProfessional') {
                var newObject = {name: i.profile.name + ' ' + i.profile.lastName, role: i.credentials.role, idNumber: i.medicalLicense, age: calculate_age(i.profile.birthDate) };
                result.push(newObject)
            }
        });

        res.status(200).json({
            message: "Success",
            data: result
        });
    } catch (error) {
        throw error;
    }
}

exports.addTrustedUser = async (req, res) => {
    const session = await conn.startSession();
    try {
        session.startTransaction();

        const { 
            trustedUserName,
        } = req.body

        const token = req.headers.authorization;
        const accessToken = token.split(' ')[1];
        const payload = await jwt.verify(accessToken, process.env.SECRET);
    
        // const creds = res.locals.loggedInUser;
        // if (creds.role != 'affiliate') throw "You don't have enough permission to perform this action";

        const affiliateExists = await Affiliate.findOne({credentials: payload.userId});
        if(!affiliateExists) throw "Affiliate doesn't exist!";

        const trustedUserExists = await Credentials.findOne({userName: trustedUserName});
        if(!trustedUserExists) throw "User doesn't exist!";

        await affiliateExists.populate('trustedUsers');

        var result = affiliateExists.trustedUsers.filter(obj => {
            return obj._id === trustedUserExists._id
        });

        if(Object.keys(result).length !== 0) throw "User is already trusted!";

        affiliateExists.trustedUsers.push(trustedUserExists._id);

        await affiliateExists.save({session});

        await session.commitTransaction();
        await session.endSession();

        res.json({
            data: "Added Trusted User: " + trustedUserExists._id
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

exports.deleteTrustedUser = async (req, res) => {
    const session = await conn.startSession();
    try {
        session.startTransaction();
        const { trustedUserName  } = req.body;

        const creds = res.locals.loggedInUser;
        if (creds.role != 'affiliate') throw "You don't have enough permission to perform this action";

        const affiliateExists = await Affiliate.findOne({credentials: creds._id}).populate('trustedUsers');
        if(!affiliateExists) throw "Affiliate does not exist!";

        const trustedUserExists = await Credentials.findOne({userName: trustedUserName});
        if(!trustedUserExists) throw "Trusted User does not exist!";

        var filter = affiliateExists.trustedUsers.filter(obj => {
            return obj._id === trustedUserExists._id
        });

        if(Object.keys(filter).length === 0) throw "User is already not trusted!"

        await affiliateExists.trustedUsers.pull(trustedUserExists._id);

        await affiliateExists.save({session});
    
        await session.commitTransaction();
        await session.endSession();

        res.json({
            data: "Deleted Trusted User: " + trustedUserExists._id
        });
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

exports.requestDocuments = async (req, res) => {
    const session = await conn.startSession();
    try {
        session.startTransaction();
        
        const { message, affiliate } = req.body;

        const creds = res.locals.loggedInUser;
        if (creds.role != 'medicalProfessional' || creds.role != 'pss' || creds.role != 'ars') throw "You don't have enough permission to perform this action";

        const affiliateExists = await Affiliate.findById(affiliate).populate('trustedUsers');
        if(!affiliateExists) throw "Affiliate does not exist!";

        const petitionerExists = await Credentials.findOne({credentials: creds._id});
        if(!petitionerExists) throw "Petitioner does not exist!";

        var documentrequest = affiliateExists.documentRequests.push({message: message, petitioner: petitionerExists._id, state: "Pending"});
        console.log(documentrequest)

        await affiliateExists.save();
    
        await session.commitTransaction();
        await session.endSession();

        res.json({
            data: "Created document request: " + documentrequest
        });
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

exports.changeDocumentRequestState = async (req, res) => {
    const session = await conn.startSession();
    try {
        session.startTransaction();
        
        const { requestId, state } = req.body;

        const creds = res.locals.loggedInUser;
        if (creds.role != 'affiliate') throw "You don't have enough permission to perform this action";

        if(!mongoose.Types.ObjectId.isValid(requestId)) throw "RequestId is not formatted correctly!";
        if(!mongoose.Types.ObjectId.isValid(affiliate)) throw "RequestId is not formatted correctly!"

        const affiliateExists = await Affiliate.findOne({credentials: creds._id}).populate('documentRequests');
        if(!affiliateExists) throw "Affiliate does not exist!";

        var returnval = await Affiliate.updateOne(
            { _id: affiliateExists._id, "documentRequests._id":requestId},
            {
                $set : {
                    "documentRequests.$.state": state
                }
            }
        );

        if(returnval.modifiedCount === 0) throw "Document request doesn't exist!"

        await session.commitTransaction();
        await session.endSession();

        res.json({
            data: "Change state of request " + requestId + " to " + state
        });
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

// CAMBIAR A BUSCAR EL TRUSTEDUSER POR JWT
exports.getOneDocumentTrustedUser = async (req, res) => {
    const { affiliate, trustedUserName, document } = req.body;
    if(!mongoose.Types.ObjectId.isValid(affiliate)) throw "Affiliate ID is not formatted correctly!";
    if(!mongoose.Types.ObjectId.isValid(document)) throw "Document ID is not formatted correctly!";

    const affiliateExists = await Affiliate.findById(affiliate).populate('trustedUsers');
    if(!affiliateExists) throw "Affiliate does not exist!";

    const trustedUserExists = await Credentials.findOne({userName: trustedUserName});
    if(!trustedUserExists) throw "User doesn't exist!";

    const exists = await Affiliate.findOne({"trustedUsers": trustedUserExists._id});
    if (!exists) {
        throw "Trusted user is not in affiliate's list";
    }

    const documentExists = await Document.findById(document);
    if(!documentExists) throw "Document does not exist!";

    res.json({
        data: documentExists
    });

}

// CAMBIAR A BUSCAR EL TRUSTEDUSER POR JWT
exports.getDocumentsTrustedUser = async (req, res) => {
    const { affiliate, trustedUserName } = req.body;

    const affiliateExists = await Affiliate.findById(affiliate).populate('trustedUsers');
        if(!affiliateExists) throw "Affiliate does not exist!";
    
    const trustedUserExists = await Credentials.findOne({userName: trustedUserName});
        if(!trustedUserExists) throw "User doesn't exist!";

    const exists = await Affiliate.findOne({"trustedUsers": trustedUserExists._id});
    if (!exists) {
        throw "Trusted user is not in affiliate's list";
    }
    
    const documents = await Document.find({affiliate: affiliateExists._id});
    
    res.json({
        data: documents
    });
}

function calculate_age(dob) { 
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

// exports.getAffiliates = async (req, res) => {
//     const creds = res.locals.loggedInUser;
//     if (creds.role != 'affiliate') throw "You don't have enough permission to perform this action";

//     const medicalProfessionalExists = await MedicalProfessional.findOne({credentials: creds._id});
//     if(!medicalProfessionalExists) throw "Medical Professional does not exist!";

//     const exists = await Affiliate.findOne({""})
// }