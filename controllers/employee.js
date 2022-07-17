const common = require('../utils/common.js');
var EmployeeModel = require('../models/employee.js');

async function create(payload) {
  try {
    await validateModel({ ...payload });
    payload.id = common.getSequnceId();
    payload.code = common.getEmpId();
    const result = EmployeeModel.create(payload);
    return result;
  } catch (e) {
    throw common.parseError(e) || e;
  }
}

async function validateModel(payload) {
  try {
    if (!payload.id) payload.id = "123";
    //console.log(payload);
    await EmployeeModel.validate(payload);
    return true;
  } catch (e) {
    throw common.parseError(e) || e;
  }
}

async function getRecords(payload = {}, projectionFields) {
  console.log(payload);
  if (!projectionFields) projectionFields = { _id: 0, __v: 0 };
  let result = await EmployeeModel.find(payload, projectionFields).lean().exec();
  return result;
}

async function updateRecord(payload) {
  const { id, ...updatePayload } = payload;
  if (!id) throw "to update id is mandatory";
  try {
    const result = await EmployeeModel.updateOne({ id }, updatePayload);
    if (result.modifiedCount) {
      return "record updated successsfully";
    } else {
      throw "record update failed/ record doesn't exist";
    }
  } catch (e) {
    throw common.parseError(e) || e;
  }
}

module.exports = { create, validateModel, getRecords, updateRecord };
