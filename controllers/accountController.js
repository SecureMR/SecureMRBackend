const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Affiliate = mongoose.model('Affiliate');
const AffiliateType = mongoose.model('AffiliateType');
const ARS = mongoose.model('ARS');
const Credentials = mongoose.model('Credentials');
const Dependent = mongoose.model('Dependent');
const MedicalProfessional = mongoose.model('MedicalProfessional');
const Profile = mongoose.model('Profile');
const PSS = mongoose.model('PSS');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
    
async function validatePassword(plainPassword, hashedPassword) {
return await bcrypt.compare(plainPassword, hashedPassword);
}

const conn = require('../models');

exports.createAffiliate = async (req, res, next) => {
    const session = await conn.startSession();
    try {
        const { 
            username, 
            password, 
            ipfsAddress,
            fingerprintHash,
            name,
            lastname,
            email,
            address,
            birthdate,
            idNumber,
            ssn,
            affiliateType,
            ars
        } = req.body
        
        const hashedPassword = await hashPassword(password);
    
        const newCredentials = new Credentials({
            userName: username, 
            password: hashedPassword,
            role: "affiliate"
        });
    
        const newProfile =  new Profile({
            name: name,
            lastName: lastname,
            email: email,
            address: address,
            birthDate: birthdate
        });
    
        const newAffiliate = new Affiliate({
            idNumber: idNumber,
            ssn: ssn
        });

        const userAffiliateType = AffiliateType.findById(affiliateType);
        const userARS = ARS.findById(ars);

        if(!userAffiliateType){
            throw "Affiliate type doesn't exist!";
        }
        if(!userARS){
            throw "ARS doesn't exist!";
        }
        
        newAffiliate.ars = userARS._id;
        newAffiliate.affiliateType = userAffiliateType._id;
    
        session.startTransaction();

        await newCredentials.save({session});
        await newProfile.save({session});

        newAffiliate.credentials = newCredentials._id;
        newAffiliate.profile = newProfile._id;
        
        await newAffiliate.save({session});

        await session.commitTransaction();

        res.json({
            data: newAffiliate
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

exports.createPSS = async (req, res, next) => {
    const session = await conn.startSession();
    try {
        const { 
            medicalCenter, 
            address, 
            userName,
            password
        } = req.body
        
        const hashedPassword = await hashPassword(password);
    
        const newCredentials = new Credentials({
            userName: userName, 
            password: hashedPassword,
            role: "ars"
        });
    
        const newPSS = new PSS({
            medicalCenter: medicalCenter,
            address: address
        });
        
        session.startTransaction();

        await newCredentials.save({session});

        newPSS.credentials = newCredentials._id;
        
        await newPSS.save({session});

        await session.commitTransaction();

        res.json({
            data: newPSS
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

exports.createARS = async (req, res, next) => {
    const session = await conn.startSession();
    try {
        const { 
            company,
            username, 
            password, 
            email,
            address
        } = req.body
        
        const hashedPassword = await hashPassword(password);
    
        const newCredentials = new Credentials({
            userName: username, 
            password: hashedPassword,
            role: "ars"
        });
    
        const newProfile =  new Profile({
            email: email,
            address: address,
        });
    
        const newARS = new ARS({
            company: company
        });
        
        session.startTransaction();

        await newCredentials.save({session});
        await newProfile.save({session});

        newARS.credentials = newCredentials._id;
        newARS.profile = newProfile._id;
        
        await newARS.save({session});

        await session.commitTransaction();

        res.json({
            data: newARS
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

exports.createDependent = async (req, res, next) => {
    
}
