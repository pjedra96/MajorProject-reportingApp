var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var ReportsSchema = new Schema({
    date: String,
	type: String,
	latitude: String,
	longitude: String,
	photo: String,
	comments: String
}, { versionKey: false });
 
ReportsSchema.pre('save', function (next) {
    var reports = this;
    // get the current date
    var currentDate = new Date();
 
    // if date doesn't exist, add to that field
    if (!reports.date) {
        reports.date = currentDate;
    }
    next();
});
 
exports.ReportsSchema = ReportsSchema;
//module.exports = mongoose.model('Reports', ReportsSchema);