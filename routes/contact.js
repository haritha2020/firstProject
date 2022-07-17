var express = require('express');
var router = express.Router();
const { create } = require('../controllers/contact.js');

/* route to create contact. */
router.post('/create', async function (req, res, next) {
  const body = req.body || {};
  try {
    const result = await create(body);
    res.json({ status: "Success", result });
  } catch (e) {
    res.json({ status: "Error", error: e });
  }
});

module.exports = router;
