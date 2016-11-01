var express = require('express');
var router = express.Router();

var ctrlAdmin=require('../controllers/admin/index');

router.get('/',ctrlAdmin.angularApp)

module.exports = router;