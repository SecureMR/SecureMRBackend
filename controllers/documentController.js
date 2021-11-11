const mongoose = require('mongoose');

const Affiliate = mongoose.model('Affiliate');
const ARS = mongoose.model('ARS');
const Document = mongoose.model('Document');
const DocType = mongoose.model('DocType');
const PSS = mongoose.model('PSS');

const conn = require('../models');

exports.addDocument = async (req, res) => {
    const session = await conn.startSession();
    try {
        session.startTransaction();

        const { 
            title,
            docDate,
            ipfsHash,
            docType,
            pss,
            ars,
            affiliate
        } = req.body

        const affiliateExists = await Affiliate.findById(affiliate);
        if(!affiliateExists) throw "Affiliate doesn't exist!"

        const pssExists = await PSS.findById(pss);
        if(!pssExists) throw "PSS doesn't exist!";

        const arsExists = await ARS.findById(ars);
        if(!arsExists) throw "ARS doesn't exist!";

        const newDocument = new Document({
            docDate: docDate,
            ipfsHash: ipfsHash,
            docType: docType,
            pss: pssExists._id,
            title: title,
            ars: ars._id,
            affiliate: affiliateExists._id
        });

        await newDocument.save({session});

        await session.commitTransaction();
        await session.endSession();

        res.json({
            data: newDocument
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

exports.deleteDocument = async (req, res) => {
    const session = await conn.startSession();
    try {
        session.startTransaction();
        const { 
            id
        } = req.body
        
        const documentExists = await Document.findById(id);
        if(!documentExists) throw "Document doesn't exist!";

        const user = await Affiliate.findById(documentExists.affiliate);

        await Document.deleteOne(documentExists);

        await session.commitTransaction();
        await session.endSession();

        res.json({
            message: "Document deleted successfully"
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}