var express = require('express');
var router = express.Router();
const fs = require("fs");

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/moment33');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
/*
// old schema:
var courseSchema = mongoose.Schema({
  kurskod: String,
  namn: String,
  progression: String,
  kursplan: String,
  termin: String
});
*/
var courseSchema = mongoose.Schema({
  _id: Number,
  courseId: String,
  courseName: String,
  coursePeriod: Number
});

var course = mongoose.model('Course', courseSchema)

db.once('open', function (callback) {
  console.log('Connected to DB');
});

function getData(callback) { // Hämtar data från mongoDB servern

  course.find(function(err, result) {
    if (err) {
      console.log(err);
    } else {
      callback(result);
    }
  });

}

// Visa alla documents i collectionen courses, i JSON
router.get('/', function(req, res, next) {

  getData(function(response) {
    res.json(response);
  });

});


// visa enskild kurs i årskursen med angivet id (verb GET - http://localhost:3000/courses/2)
router.get('/:id', function(req, res, next) {

  function getCoursebyID(id, callback) {
    var returnvalue;

    getData(function(all) { // Hämta datan
      //console.log(all);
      all.some(row => { // Kolla igenom varje rad
        console.log(row["_id"] + ' - ' + id);
        if (row["_id"] == id) { // Om ID angett i URL matchar _id i JSON datan; sätt returnvalue = den raden
          console.log('match!');
          console.log(row);
          returnvalue = row;
        }
      });
      callback(returnvalue);
    });
  }
  
  getCoursebyID(req.params.id, function(response) {
    res.json(response);
  });
});


// Radera en enskild kurs från listan med angivet id (verb DELETE - http://localhost:3000/courses/2)

function deleteCourse(id, callback) {
  course.deleteOne({ _id: id }), function (err) { // Hitta kurs med id som req.params.id
    if (err) { // Om error; visa error
      console.log(err);
      callback(err);
    } else {
      callback("Course deleted!"); // Annars om success; skicka detta
    }
  }
}

router.delete('/:id', function(req, res, next) {
  deleteCourse(req.params.id, function(response) {
    res.send("<p>", response, "</p>");
  });
});



// Lägg till en ny kurs

function addCourse(data, callback) {

  // TODO: Implement this
  callback("test");
}

router.post('/', function(req, res, next) {
  console.log(req.body);
  
  addCourse(req.body, function(response) {
    res.send("<p>", response, "</p>");
  });
});

module.exports = router;