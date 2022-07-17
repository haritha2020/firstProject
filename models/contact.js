var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new Schema(
    {
        id: { type: String, required: true },
        referenceid: { type: String, required: true },
        referencetype: { type: String, enum: ['organization', 'employee'], required: true },
        address: {
            line1: { type: String, required: true },
            line2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true }
        },
        phone: { mobile: { type: String }, work: { type: String } },
        email: { personal: { type: String }, work: { type: String } }
    }
);

//Export model
const ContactModel = mongoose.model('contact', ContactSchema,'contact');
module.exports = ContactModel;
