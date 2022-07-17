var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeSchema = new Schema(
    {
        id: { type: String, required: true },
        firstname: { type: String, required: true },
        lastname : { type: String, required: true },
        gender: { type: String, enum: ['male', 'female'], required: true },
        dob: { type: Date },
        code:{type:String},
        orgid:{type:String},
        status: { type: String, enum: ['active','assigned', 'inactive'], default: 'active' }
    }
);

//Export model
const EmployeeModel=mongoose.model('employee', EmployeeSchema,'employee');
module.exports = EmployeeModel;
