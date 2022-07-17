var express = require('express');
var router = express.Router();
const { create: createOrg, validateModel: ValidateOrg, getRecords: officeList } = require('../controllers/organization.js');
const contactController = require('../controllers/contact.js');

//const createContact=contactController.create;


router.post('/create', async function (req, res, next) {
  const obj = req.body || {};
  try {
    const { contact, ...office } = obj;
    // step1:pre-validation check
    await ValidateOrg(office);
    if (contact) {
      contact.referencetype = "organization";
      await contactController.validateModel(contact);
    }

    //step-2:office creation
    const officeResult = await createOrg(office);

    //step-3:contact creation
    contact.referenceid = office.id;
    const contactResult = await contactController.create(contact);

    res.json({ status: "Success", result: contactResult });
  } catch (error) {
    res.json({ status: "Error", error });
  }
});

router.get('/', async function (req, res, next) {
  const { status, orgid } = req.query;
  try {
    let result = [], orgQuery = {};
    if (status) {
      orgQuery.status = status;
    }

    let officeResult = await officeList(orgQuery);
    const contactQuery = { referencetype: "organization" };
    let contactResult = await contactController.getRecords(contactQuery);

    officeResult.forEach(function (obj) {
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
    let officeResult = await officeList(obj);
    res.json({ status: "Success", result: officeResult[0] || {} });
  } catch (e) {
    res.json({ status: "Error", error: e });
  }
});

module.exports = router;
