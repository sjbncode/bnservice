var db = require('../config/sql_db');
var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};
var formmatSql = function(sql, params) {
	var l = params.length;
	for (var i = params.length - 1; i >= 0; i--) {
		var key = "{" + i + "}";
		sql = sql.replace(key, params[i]);
	}
	return sql;
}
module.exports.getSyncLogSummary = function(req, res) {
	var q = "SELECT *FROM (	SELECT DataName AS dataName,Status AS [status],COUNT(1) AS c FROM dbo.IntegrationLog with(nolock) GROUP BY DataName, Status ) as s PIVOT(    SUM([c])    FOR [status] IN (New,NoNeedUpload,UpdateSuccess,Exception,Processing,Inqueue))AS pvt";
	db.select(q, function(r) {
		sendJSONresponse(res, 200, r);
	});

}

module.exports.getSyncErrors = function(req, res) {
	var q = "SELECT ID, DataName,Destination,Key1,key2,Key3,Result,EntityXml,PostEntityXml,SyncTimes,CreatedBy,CreatedDttm,UpdatedDttm FROM dbo.IntegrationLog WHERE Status='exception' ORDER BY CreatedDttm DESC";
	db.select(q, function(r) {
		sendJSONresponse(res, 200, r);
	});
}

module.exports.getSyncErrorByID = function(req, res) {
	var q = "SELECT ID, DataName,Destination,Key1,key2,Key3,Result,EntityXml,PostEntityXml,SyncTimes,CreatedBy,CreatedDttm,UpdatedDttm FROM dbo.IntegrationLog WHERE ID='" + req.body.ID + "'";
	db.select(q, function(r) {
		sendJSONresponse(res, 200, r);
	});
}

module.exports.getDuplicateInvoice = function(req, res) {
	var q = "SELECT InvoiceID,OrderID FROM dbo.FinalInvoiceHeader a WITH(NOLOCK) INNER JOIN dbo.FinalInvoiceDetail b WITH(NOLOCK) ON a.FinalInvoiceID=b.FinalInvoiceID GROUP BY InvoiceID,OrderID HAVING COUNT(DISTINCT a.FinalInvoiceID)>1";
	db.select(q, function(r) {
		sendJSONresponse(res, 200, r);
	});
}

module.exports.getCustomerMonthlySummary = function(req, res) {
	var q =
		`;WITH tmp AS( 
	SELECT a.UserID,b.LoginName,TotalAmount
	,CONVERT(NVARCHAR(128),YEAR(a.CheckOutDate))+'-'+RIGHT('00'+CONVERT(NVARCHAR(128),MONTH(a.CheckOutDate)),2) AS M 
	FROM dbo.SalesOrder a with(nolock)
	INNER JOIN dbo.CustUserInfo b WITH(NOLOCK) ON a.UserID = b.UserID
	WHERE b.LoginName NOT LIKE '%genewiz%' AND a.IsOrder=1
	--AND a.UserID='46AFE43F-39EA-414E-8D36-C3BE0FCEA20B'
	AND b.LoginName=N'{0}'
	)
	SELECT a.UserID,a.LoginName,a.M,COUNT(1) AS  orders,SUM(a.TotalAmount) AS amount
	FROM tmp a
	GROUP BY a.UserID,a.LoginName,a.M
	ORDER BY a.M DESC
	`
	q = formmatSql(q, [req.body.CustomerAccount]);
	db.select(q, function(r) {
		sendJSONresponse(res, 200, r);
	});
}
module.exports.getPIMonthlySummary = function(req, res) {
	var q = `
	--PI layer monthly report
;WITH pitmp AS( 
SELECT p.piid,p.FullName,TotalAmount
,CONVERT(NVARCHAR(128),YEAR(a.CheckOutDate))+'-'+RIGHT('00'+CONVERT(NVARCHAR(128),MONTH(a.CheckOutDate)),2) AS M 
FROM dbo.SalesOrder a with(nolock)
INNER JOIN dbo.CustUserInfo b WITH(NOLOCK) ON a.UserID = b.UserID
LEFT JOIN dbo.CustPI p WITH(NOLOCK) ON b.PiID=p.PIID
WHERE b.LoginName NOT LIKE '%genewiz%' AND a.IsOrder=1
--AND p.PIID='2D00BC20-CA37-4151-AB4A-13BAFC54F2DD'
And p.FullName=N'{0}'
)
SELECT a.piid,a.FullName,a.M,COUNT(1) AS  orders,SUM(a.TotalAmount)  AS amount
FROM pitmp a
GROUP BY a.piid,a.FullName,a.M
ORDER BY a.M DESC
`;
	q = formmatSql(q, [req.body.PIName]);
	db.select(q, function(r) {
		sendJSONresponse(res, 200, r);
	});
}
module.exports.getCompanyMonthlySummary = function(req, res) {
	var q = `;WITH pitmp AS( 
SELECT c.CompanyID,c.CompanyName,TotalAmount
,CONVERT(NVARCHAR(128),YEAR(a.CheckOutDate))+'-'+RIGHT('00'+CONVERT(NVARCHAR(128),MONTH(a.CheckOutDate)),2) AS M 
FROM dbo.SalesOrder a with(nolock)
INNER JOIN dbo.CustUserInfo b WITH(NOLOCK) ON a.UserID = b.UserID
LEFT JOIN dbo.CustPI p WITH(NOLOCK) ON b.PiID=p.PIID
LEFT JOIN dbo.CustCompany c WITH(NOLOCK) ON p.CompanyID=c.CompanyID
WHERE b.LoginName NOT LIKE '%genewiz%' AND a.IsOrder=1
--AND c.CompanyID='61D74E0F-477A-4B75-A191-EDBE1000AD9E'
AND c.CompanyName=N'{0}'
)
SELECT a.CompanyID,a.CompanyName,a.M,COUNT(1) AS  orders,SUM(a.TotalAmount)  AS amount
FROM pitmp a
GROUP BY a.CompanyID,a.CompanyName,a.M
ORDER BY a.M DESC
	`;
	q = formmatSql(q, [req.body.CompanyName]);
if(req.body.CompanyName==undefined||req.body.CompanyName==''){
	q=`;WITH pitmp AS( 
SELECT TotalAmount
,CONVERT(NVARCHAR(128),YEAR(a.CheckOutDate))+'-'+RIGHT('00'+CONVERT(NVARCHAR(128),MONTH(a.CheckOutDate)),2) AS M 
FROM dbo.SalesOrder a with(nolock)
INNER JOIN dbo.CustUserInfo b WITH(NOLOCK) ON a.UserID = b.UserID
WHERE b.LoginName NOT LIKE '%genewiz%' AND a.IsOrder=1
)
SELECT a.M,COUNT(1) AS  orders,SUM(a.TotalAmount)  AS amount
FROM pitmp a
GROUP BY a.M
ORDER BY a.M DESC`;

}
	console.log(q);
	db.select(q, function(r) {
		sendJSONresponse(res, 200, r);
	});
}