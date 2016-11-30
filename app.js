var path = require('path');
const express = require('express');
const zipdb = require('zippity-do-dah');
const Forecastio = require('forecastio');

var app = express();
// Forecastio 'AKA' Dark Sky (darksky.net) -- Get your own API secret key
var weather = new Forecastio("<Your API Secret Key Here");

// Serves static files out of public
app.use(express.static(path.resolve(__dirname, "public")));

// Setting views template path with embedded js as engine
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// Render the index.esj as the homepage
app.get("/", function(req, res) {
  res.render("index");
});

app.get(/^\/(\d{5})$/, function(req, res, next){
  var zipcode = req.params[0];
  var location = zipdb.zipcode(zipcode);
  if (!location.zipcode) {
    next();
    return;
  }

  var latitude = location.latitude;
  var longitude = location.longitude;

  weather.forecast(latitude, longitude, function(err, data){
    if (err) { next(); return; }

    res.json({
      zipcode: zipcode,
      temperature: data.currently.temperature
    });
  });
});

app.use(function(req, res){
  res.status(404).render("404");
});

app.listen(5000, function() {
  console.log("Reading on port 3000...");
});
