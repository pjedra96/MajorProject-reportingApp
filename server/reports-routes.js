var express = require('express');
 
var app = module.exports = express.Router();
 
var Report = require('./server');
 
// POST
// Create a new Report
app.post('/reports', function (req, res) {
  if (!req.body.type) {
    return res.status(400).send({ "success": false, "msg": "You need to include the type of the issue !" });
  }
 
  var newReport = new Report.Report({
    date: req.body.date,
	type: req.body.type,
	latitude: req.body.latitude,
	longitude: req.body.longitude,
	photo: req.body.photo,
	comments: req.body.comments
  });
 
  newReport.save(function (err) {
    if (err) {
      console.log("some error: ", err);
      return res.json({ "success": false, "msg": "Error while sending a report", "error": err });
    }
    res.status(201).send({ "success": true, "msg": 'Successful submission of the report' });
  });
});
 
// GET
// Get all open Reports
app.get('/reports', function (req, res) {
  Report.Report.find({}, function (err, reports) {
    if (err) {
      return res.json({ "success": false, "msg": "Error while creating a report", "error": err });
    }
 
    res.status(200).send({ "success": true, "result": reports });
  });
});
 
// DELETE
// Remove one report by its ID
app.delete('/reports/:reportId', function (req, res) {
  var lectionId = req.params.reportId;
  if (!lectionId || lectionId === "") {
    return res.json({ "success": false, "msg": "You need to send the ID of the report", "error": err });
  }
 
  Todo.findByIdAndRemove(lectionId, function (err, removed) {
    if (err) {
      return res.json({ "success": false, "msg": "Error while deleting report", "error": err });
    }
    res.status(200).json({ "success": true, "msg": "Report deleted" });
  });
});