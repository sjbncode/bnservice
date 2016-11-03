var sqldb=function(conn_str){
	var sql = require('msnodesqlv8'); 
//var
 conn_str =conn_str|| process.env.SQL_CON;

//open database  
sql.open(conn_str, function(err, conn) {
	if (err) {
		console.log(err);
	}
});

function exeScript(sqlscript) {
	sql.queryRaw(conn_str, sqlscript, function(err, results) {

		if (err) {
			console.log(err);
		} else {
			console.log(results);
		}
	});
}

function select(sqlscript, cb) {
	sql.queryRaw(conn_str, sqlscript, function(err, results) {

		if (err) {
			console.log(err);
			cb({error:err});
		} else {
			cb({data:toJson(results)});
		}
	});
}

function del(sqlscript) {
	exeScript(sqlscript);
}

function update(sqlscript) {
	exeScript(sqlscript);
}

function add(sqlscript) {
	exeScript(sqlscript);
}

//convert table to json  
function toJson(dt, tbName) {
	var results=[];
	if (dt != undefined && dt.rows.length > 0) {
		var rowLen = dt.rows.length;
		var colLen = dt.meta.length;
		for (var i = 0; i < rowLen; i++) {
			var r={};
			for (var j = 0; j < colLen; j++) {
				
				var v=dt.rows[i][j];
				var k=dt.meta[j].name;
				r[k]=v;
			}
			results.push(r);			
		}
	}
	return results;
}

return{
	select:select,
	del:del,
	update:update,
	add:add,
}
}
module.exports=sqldb;
// exports.add = add;
// exports.del = del;
// exports.update = update;
// exports.select = select;
