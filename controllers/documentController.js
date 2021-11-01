const mongoose = require('mongoose');

const Affiliate = mongoose.Model('Affiliate');
const ARS = mongoose.Model('ARS');
const Document = mongoose.Model('Document');
const DocType = mongoose.Model('DocType');
const PSS = mongoose.Model('PSS');

exports.addDocument = async (req, res) => {
    const session = await conn.startSession();
    try {
        session.startTransaction();
        const { 
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
            ars: ars._id,
            affiliate: affiliate._id
        });

        await newDocument.save({session});

        affiliateExists.documents.push(newDocument);
        await affiliateExists.save({session});

        pss.documents.push(newDocument);
        await pss.save({session});

        await session.commitTransaction();
        await session.endSession();

        res.json({
            data: newDependent
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
            data: newDependent
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}

exports.giveAccess = async (req, res) => {

}

exports.removeAcess = async (req, res) => {

}