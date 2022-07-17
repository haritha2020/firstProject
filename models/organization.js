var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrganizationSchema = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        code: { type: String, required: true },
        sector: { type: String, enum: ['private', 'public'], required: true },
        date_established: { type: Date },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' }
    }
    );

//Export model
const OrganizationModel=mongoose.model('organization', OrganizationSchema,'organization');
module.exports = OrganizationModel;
