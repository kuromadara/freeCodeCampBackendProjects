require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/is-mongoose-ok", function (req, res) {
  if (mongoose) {
    res.json({ isMongooseOk: !!mongoose.connection.readyState });
  } else {
    res.json({ isMongooseOk: false });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

let urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: Number
});

let Url = mongoose.model('Url', urlSchema);

app.post('/api/shorturl', (req, res) =>{
  console.log(req.body);
  let url = req.body.url;
  let urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  // console.log(urlRegex.test(url));
  // console.log(url.replace(/(^\w+:|^)\/\//, '').split('/')[0]);
  /**
   * urlRegex.test(url) checks if the url is valid
   * example: https://www.freecodecamp.org/forum/t/how-to-get-the-domain-name-only-from-a-url/301143
   *            url.replace(/(^\w+:|^)\/\//, '').split('/')[0]
   *            will return: www.freecodecamp.org which can be validated by dns.lookup
   **/ 
  if(urlRegex.test(url)){

      dns.lookup(url.replace(/(^\w+:|^)\/\//, '').split('/')[0], (err, address, family) => {
      if(err){
        console.log(err);
        console.log(url)
        res.json({error: 'invalid URL'});
      }else {
        let short = Math.floor(Math.random() * 1000);
        let newUrl = new Url({original_url: url, short_url: short});
        newUrl.save((err, data) => {
          if(err) return console.error(err);
          res.json({
            original_url: data.original_url, 
            short_url: data.short_url
          });
        })
      }
    });
  }else {
    res.json({error: 'invalid URL'});
  }
})

app.get('/api/shorturl/:short_url/', (req, res) => {
  let short = req.params.short_url;
  Url.findOne({
    short_url: short,
  }, (err, data) => {
    if(err) return console.error(err);
    res.redirect(data.original_url);
  })
})

