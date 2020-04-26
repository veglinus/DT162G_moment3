var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://user:9JF69q3doh7DQTVD@linuscluster-gpcjz.mongodb.net/Moment-3-3');

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

var courseSchema = mongoose.Schema({ // Schema för datan
  courseId: String,
  courseName: String,
  coursePeriod: Number
}, {versionKey: false}); // Behöver inga versionkeys
var course = mongoose.model('Course', courseSchema)

db.once('open', function (callback) { // Öppna connection
  console.log('Connected to DB');
});


function getData(callback) { // Hämtar all data från mongoDB servern
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

  function getCoursebyID(id, callback) { // Hitta kurs utifrån ObjectID
    course.findById(id, function(err, data) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        callback(data);
      }
    });
  }
  getCoursebyID(req.params.id, function(response) {
    res.json(response);
  });
});


// Radera en enskild kurs från listan med angivet id (verb DELETE - http://localhost:3000/courses/2)

function deleteCourse(id, callback) {
  console.log(id);
  course.findByIdAndDelete(id, function(err) { // Hitta kurs by ObjectID och ta bort
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log("Deleted course with ID: " + id);
      callback("Course deleted!");
    }
  });
}
router.delete('/:id', function(req, res, next) {
  deleteCourse(req.params.id, function(response) {
    res.send(response);
  });
});



// Lägg till en ny kurs
function addCourse(data, callback) {

  var newCourse = new course({
    courseId: data.courseid,
    courseName: data.coursename,
    coursePeriod: data.courseperiod
  });

  newCourse.save(function(err) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log("Course added");
      callback("Course added!");
    }
  });

}
router.post('/', function(req, res, next) {

  addCourse(req.body, function(response) {
    res.send(response);
  });
});

module.exports = router;