// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var moment = require('moment')

var env = require('dotenv').config()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api', (req,res) => {
  res.send({
    unix: new Date().getTime()+20000, 
    utc: new Date().toUTCString()
  }
  )
})

app.get('/api/:date', (req,res) => {

  // console.log(date_check.getDate());
  const date_checka = Date.parse(req.params.date) 
  const new_date = new Date(date_checka)
  

  if(req.params.date.indexOf(' ') >= 0){
    res.send({
      "unix": new_date.getTime(),
      "utc": new_date.toUTCString()
    })
  }
  if(date_checka === null){
    res.send({
      error : "Invalid Date"
    })
  }


  if(!req.params){
    res.send({
      unix: new Date().getTime(), 
      utc: new Date().toUTCString()})
  }
  if(req.params.date.length == 13){
    var date = new Date(parseInt(req.params.date));

    res.send({
      "unix": parseInt(req.params.date),
      "utc": date.toUTCString()
    })
  }

  console.log("test: "+req.params.date);

  if(req.params.date.length == 0){
    var date = new Date();
    res.send({
      "unix": date.getTime(),
      "utc": date.toUTCString()
    })
  }

  let date_check = moment(req.params.date, 'YYYY-MM-DD', true);
  
  if (!date_check.isValid()) {
    res.send({
      error : "Invalid Date"
    })
  }

    let date_unix = Math.floor(new Date(req.params.date).getTime())
    let utc = new Date(req.params.date).toUTCString()
    res.send(
      {
        "unix": date_unix,
        "utc": utc
      }
    )
  
})
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
