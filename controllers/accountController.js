const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Affiliate = mongoose.model('Affiliate');
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

exports.createAffiliate = async (req, res) => {
    const session = await conn.startSession();
    try {
        session.startTransaction();
        const { 
            userName, 
            password, 
            ipfsAddress,
            fingerprintHash,
            name,
            lastName,
            email,
            address,
            birthDate,
            idNumber,
            ssn,
            ars
        } = req.body
        
        const idNumExists = await Affiliate.findOne({idNumber: idNumber});
        if(idNumExists) throw "User already has an account!"

        const userARS = await ARS.findById(ars);
        console.log(userARS._id);
        if(!userARS) throw "ARS doesn't exist!";

        const hashedPassword = await hashPassword(password);
    
        const newCredentials = new Credentials({
            userName: userName, 
            password: hashedPassword,
            role: "affiliate"
        });
    
        const newProfile =  new Profile({
            name: name,
            lastName: lastName,
            email: email,
            address: address,
            birthDate: birthDate
        });
    
        const newAffiliate = new Affiliate({
            idNumber: idNumber,
            ssn: ssn,
            ars: userARS._id
        });

        await newCredentials.save({session});
        await newProfile.save({session});

        newAffiliate.credentials = newCredentials._id;
        newAffiliate.profile = newProfile._id;
        
        await newAffiliate.save({session});

        await newAffiliate.populate('profile');
        await newAffiliate.populate({path: 'credentials', select: 'userName role'});

        await session.commitTransaction();
        await session.endSession();

        res.json({
            data: newAffiliate
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

exports.createPSS = async (req, res) => {
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
            role: "pss"
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

exports.createARS = async (req, res) => {
    const session = await conn.startSession();
    try {
        const { 
            company,
            userName, 
            password, 
            email,
            address
        } = req.body
        
        const hashedPassword = await hashPassword(password);
    
        const newCredentials = new Credentials({
            userName: userName, 
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

exports.createDependent = async (req, res) => {
    const session = await conn.startSession();
    try {
        const { 
            name,
            lastName,
            email,
            address,
            birthDate,
            userName,
            password,
            affiliate
        } = req.body
        
        const hashedPassword = await hashPassword(password);
        
        const newDependent = new Dependent();

        const newProfile = new Profile({
            name: name,
            lastname: lastName,
            email: email,
            address: address,
            birthdate: birthDate
        });

        const newCredentials = new Credentials({
            userName: userName, 
            password: hashedPassword,
            role: "dependent"
        });

        const dependentAffiliate = Affiliate.findById(affiliate);

        if(!dependentAffiliate){
            throw "Affiliate does not exist!";
        }
        
        session.startTransaction();

        await newCredentials.save({session});
        await newProfile.save({session});
        
        newDependent.profile = newProfile._id;
        newDependent.credentials = newCredentials._id;
        newDependent.affiliate = dependentAffiliate._id;

        await newDependent.save({session});

        await session.commitTransaction();

        res.json({
            data: newDependent
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

exports.getAffiliate = async (req, res) => {
    const {id} = req.body;

    const affiliate = await Affiliate.findById(id).populate({
        path: 'credentials',
        select: 'userName role'
    });

    if(!affiliate) throw "Affiliate doesn't exist!"

    res.json({
        data: affiliate
    });
}

exports.getDependent = async (req, res) => {
    const {id} = req.body;

    const dependent = await Dependent.findById(id).populate({
        path: 'credentials',
        select: 'userName role'
    });

    if(!dependent) throw "Dependent doesn't exist!"

    res.json({
        data: dependent
    });
}

exports.getARS = async (req, res) => {
    const {id} = req.body;

    const ars = await ARS.findById(id).populate({
        path: 'credentials',
        select: 'userName role'
    });

    if(!ars) throw "ARS doesn't exist!"

    res.json({
        data: ars
    });
}

exports.getMedicalProfessional = async (req, res) => {
    const {id} = req.body;

    const medprof = await MedicalProfessional.findById(id).populate({
        path: 'credentials',
        select: 'userName role'
    });

    if(!medprof) throw "Medical Professional doesn't exist!"

    res.json({
        data: medprof
    });
}

exports.getPSS = async (req, res) => {
    const {id} = req.body;

    const pss = await PSS.findById(id).populate({
        path: 'credentials',
        select: 'userName role'
    });

    if(!pss) throw "PSS doesn't exist!"

    res.json({
        data: pss
    });
}

exports.login = async (req, res) => {
    const session = await conn.startSession();
    
    try {
        const { userName, password } = req.body;
        const user = await Credentials.findOne({ userName });
        if (!user) throw "User doesn't exist"
        
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) throw 'Password is not correct';
        
        const accessToken = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: "1d"
        });

        session.startTransaction();

        await Credential.findByIdAndUpdate(user._id, { accessToken })

        await session.commitTransaction();

        res.status(200).json({
            data: { userName: user.userName, role: user.role },
            accessToken
        });
    } catch(error) {
        session.abortTransaction();
        throw error;
    }
    
}