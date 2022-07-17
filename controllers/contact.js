var { getSequnceId, parseError } = require('../utils/common.js');
const ContactModel = require('../models/contact.js');

async function create(payload) {
    try {
        await validateModel({ ...payload });
        payload.id = getSequnceId();
        const result = await ContactModel.create(payload);
        return result;
    } catch (e) {
        throw parseError(e) || e;
    }
}

async function validateModel(payload) {

    const { id, referenceid } = payload;
    if (!id) payload.id = "id";
    if (!referenceid) payload.referenceid = "referenceid";

    try {
        if (payload.phone) {
            const { mobile, work } = payload.phone;
            if (!(mobile || work)) {
                throw "mobile or work phone should be specified";
            }
        }
        if (payload.email) {
            const { work, personal } = payload.email;
            if (!(personal || work)) {
                throw "personal or work phone should be specified";
            }
        }
        await ContactModel.validate(payload);
        return true;
    } catch (e) {
        throw parseError(e) || e;
    }
}

async function getRecords(query = {}) {
    let result = await ContactModel.find(query,{_id:0,__v:0}).lean();
    return result;
}



module.exports = { create, validateModel, getRecords };
