const mongoose = require('mongoose');

const Affiliate = mongoose.Model('Affiliate');
const ARS = mongoose.Model('ARS');
const Document = mongoose.Model('Document');
const DocType = mongoose.Model('DocType');
const PSS = mongoose.Model('PSS');
const Credentials = mongoose.Model('Credentials');
const MedicalProfessional = mongoose.Model('MedicalProfessional');

exports.getTrustedUsers = async (req, res) => {
    try {

        const { 
            affiliate
        } = req.body
        
        const affiliateExists = await Affiliate.findById(affiliate);
        if(!affiliateExists) throw "Affiliate doesn't exist!"

        await affiliateExists.populate('trustedUsers');

        res.json({
            data: affiliateExists.trustedUsers
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
            affiliate,
            trustedUser,
            expDate
        } = req.body
    
        const affiliateExists = await Affiliate.findById(affiliate);
        if(!affiliateExists) throw "Affiliate doesn't exist!";

        const trustedUserExists = await Credentials.findById(trustedUser);
        if(!trustedUser) throw "User doesn't exist!";

        await affiliateExists.populate('trustedUsers');

        var result = affiliateExists.trustedUsers.filter(obj => {
            if(obj.idUser === affiliate){
                return obj.idUser;
            } else {
                return null;
            }
        });

        if(result !== null) throw "User is already trusted!";

        affiliateExists.trustedUsers.push({idUser: trustedUserExists._id, expDate: expDate});

        await affiliateExists.save({session});

        await session.commitTransaction();
        await session.endSession();

        res.json({
            data: "Added"
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}