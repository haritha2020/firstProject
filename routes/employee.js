var express = require('express');
var router = express.Router();
const employeeController = require('../controllers/employee.js');
const { create: createContact, validateModel: validateContact, getRecords: contactList } = require("../controllers/contact.js")
const { create: createOrg, validateModel: ValidateOrg, getRecords: officeList } = require('../controllers/organization.js');

router.post("/create", async (req, res) => {
  let obj = req.body || {};
  try {
    const { contact, ...employee } = obj;

    //step-1:prevalidation
    let result1 = await employeeController.validateModel(employee);
    contact.referencetype = "employee";
    await validateContact(contact);

    //step-2:employee creation
    let employeeResult = await employeeController.create(employee);

    //step-3:contact creation
    contact.referenceid = employee.id;
    let contactResult = await createContact(contact);
    //let result={}
    res.json({ staus: "Success", result: contactResult });
  } catch (e) {
    res.json({ status: "Error", error: e })
  }
});


router.get('/', async function (req, res, next) {
  const { status, orgid } = req.query;
  try {
    let result = [], orgQuery = {};
    if (status) {
      if (status != "assigned" && orgid) throw "invalid query params";
      orgQuery.status = status;
    }
    if (orgid) {
      orgQuery.orgid = orgid;
    }
    let employeeResult = await employeeController.getRecords(orgQuery);
    const contactQuery = { referencetype: "employee" };
    let contactResult = await contactList(contactQuery);
    employeeResult.forEach(function (obj) {
      let contactInfo = contactResult.find(function (post) {
        return (obj.id == post.referenceid);
      });
      obj.contact = (contactInfo || {});
      result.push(obj);
    });
    res.json({ status: "Success", result });
  } catch (e) {
    res.json({ status: "Error", error: e });
  }
});



router.get('/:id', async function (req, res, next) {
  try {
    let obj = req.params;
    let employeeResult = await employeeController.getRecords(obj);
    res.json({ status: "Success", result: employeeResult[0] || {} });
  } catch (e) {
    res.json({ status: "Error", error: e });
  }
});

router.put('/assign', async function (req, res, next) {
  try {
    const { id, orgid } = req.body;
    if (!id) throw "id is required";
    if (!orgid) throw "orgid is required";

    //step-1:Employee validation
    let employeeResult = await employeeController.getRecords({ id });
    if ((employeeResult || []).length !== 1) throw "employee details not found";
    const { id: empId, status } = employeeResult[0];
    if (status == "inactive") throw "employee status is inactive";
    if (status != "active") throw "employee is already assigned to organization";

    //step-2:Organization validation
    const officeQuery = { id: orgid, status: "active" };
    const officeProjections = { id: 1 };
    let officeResult = await officeList(officeQuery, officeProjections);
    if ((officeResult || []).length !== 1) throw "organization details not found";

    //step_3:Updating Employee Record
    const updateRec = { id, orgid, status: "assigned" };
    const result = await employeeController.updateRecord(updateRec);
    res.json({ status: "Success", result });
  } catch (e) {
    res.json({ status: "Error", error: e });
  }
})

router.put('/unassign', async function (req, res, next) {
  try {
    const { id } = req.body;
    if (!id) throw "id is required";

    //step-1:Employee validation

    const projectionFields = { id: 1, status: 1 };
    let employeeResult = await employeeController.getRecords({ id }, projectionFields);
    if ((employeeResult || []).length !== 1) throw "employee details not found";
    const { id: empId, status } = employeeResult[0];
    if (status !== "assigned") throw "employee un assignment is not possible";

    //step_3:Updating Employee Record
    const updateRec = { id, orgid: null, status: "active" };
    const result = await employeeController.updateRecord(updateRec);
    res.json({ status: "Success", result });
  } catch (e) {
    res.json({ status: "Error", error: e });
  }
})

router.put('/update', async function (req, res, next) {
  try {
    const { id, ...updateinfo } = req.body;
    if (!id) throw "id is required";
    if (updateinfo.status == "assigned") throw "status can be active/inactive";
    if (updateinfo.orgid) throw "orgid cannot be updated";
    if (updateinfo.status) {
      let employeeResult = await employeeController.getRecords({ id }, { status: 1 });
      if (employeeResult[0] && employeeResult[0].status == "assigned") throw "cannot change status, employee is assigned to office";
    }
    const result = await employeeController.updateRecord(req.body);
    res.json({ status: "Success", result });
  } catch (e) {
    res.json({ status: "Error", error: e });
  }

})


module.exports = router;
