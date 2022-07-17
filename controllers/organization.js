var { getSequnceId, parseError } = require('../utils/common.js');
const OrganizationModel = require('../models/organization.js');

async function create(payload) {
    try {
        await validateModel({ ...payload });
        payload.id = getSequnceId();
        const result = await OrganizationModel.create(payload);
        return result;
    } catch (e) {
        throw parseError(e) || e;
    }

}

async function validateModel(payload) {
    try {
        //const {date_established,status}=payload;
        if (!payload.id) payload.id = "123";
        await OrganizationModel.validate(payload);
        return true;
    } catch (e) {
        throw parseError(e) || e;
    }

}

async function getRecords(payload = {}, projectionFields) {
    if (!projectionFields) projectionFields = { _id: 0, __v: 0 };
    let result = await OrganizationModel.find(payload, projectionFields).lean().exec();
    return result;
}

module.exports = { create, validateModel, getRecords };