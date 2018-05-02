var logger = require('morgan'),
  cors = require('cors'),
  http = require('http'),
  express = require('express'),
  errorhandler = require('errorhandler'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  report = require('./reports'),
  routes = require('./reports-routes'),
  config = require('./config.json');

  // connect to mongo
db = mongoose.createConnection(config.database),
Report = db.model('Reports', report.ReportsSchema);

db.on('open', function(){
	console.log("\nReporting App Mongo is set up");
	
	var app = express();
	app.use(morgan('dev'));
    app.use(cors());

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(routes);
	
    app.listen(3002, function (err) {
       console.log('Server is running at: ' + 'http://localhost:3002');
    });
});
exports.Report = Report;