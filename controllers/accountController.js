const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Affiliate = mongoose.Model('Affiliate');
const AffiliateType = mongoose.Model('AffiliateType');
const ARS = mongoose.Model('ARS');
const Credentials = mongoose.Model('Credentials');
const Dependent = mongoose.Model('Dependent');
const MedicalProfessional = mongoose.Model('MedicalProfessional');
const Profile = mongoose.Model('Profile');
const PSS = mongoose.Model('PSS');

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
    
}

exports.createARS = async (req, res, next) => {

}

exports.createDependent = async (req, res, next) => {
    
}