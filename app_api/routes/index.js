var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});



router.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});


var synclogCtrl = require('../controllers/synclog');
router.get('/synclog', synclogCtrl.getSyncLogSummary);
router.get('/syncErrors', synclogCtrl.getSyncErrors);
router.post('/SyncErrorByID', synclogCtrl.getSyncErrorByID);
router.get('/duplicateInvoice', synclogCtrl.getDuplicateInvoice);
router.post('/CustomerMonthlySummary', synclogCtrl.getCustomerMonthlySummary);
router.post('/PIMonthlySummary', synclogCtrl.getPIMonthlySummary);
router.post('/CompanyMonthlySummary', synclogCtrl.getCompanyMonthlySummary);

module.exports = router;