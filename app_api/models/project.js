var mongoose = require( 'mongoose' );
var customerSchema=new mongoose.Schema({
  customername:String,
  email:String,  
  created: { type: Date, default: Date.now }
});

var projectSchema=new mongoose.Schema({
  // userId
  projectname:String,
  ownerId:String,
  customerId:String,
  status:String,
  comments:String,
  EstimatedFinishDate:Date,
  updatedtime: { type: Date, default: Date.now }
  created: { type: Date, default: Date.now }
});

// userSchema.methods.setPassword = function(password){
//   this.salt = crypto.randomBytes(16).toString('hex');
//   this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
// };
mongoose.model('Project', projectSchema);

var taskSchema=new mongoose.Schema({
  projectId:String,
  ownerId:String,
  status:String,
  targetDate:Date,
  detail:String,  
  created: { type: Date, default: Date.now }
});
mongoose.model('Task', taskSchema);