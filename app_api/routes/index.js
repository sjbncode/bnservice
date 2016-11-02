var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});



router.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Credentials', true);
	res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
	if ('OPTIONS' == req.method) 
		return res.send(200);
	console.log(next);
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


var userCtrl=require('../controllers/authentication');
router.post('/register',userCtrl.register);
router.post('/login',userCtrl.login);
//Logout
router.get('/logout', auth, userCtrl.logout); 

module.exports = router;