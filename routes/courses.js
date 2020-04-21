var express = require('express');
var router = express.Router();
const fs = require("fs");

function getData() { // Hämtar courses.json
  var data = fs.readFileSync("courses.json");
  var jsondata = JSON.parse(data);
  return jsondata;
}

// visa alla kurser i årskursen (GET - http://localhost:3000/courses)
router.get('/', function(req, res, next) {
  res.json(getData());
});


// visa enskild kurs i årskursen med angivet id (verb GET - http://localhost:3000/courses/2)
router.get('/:id', function(req, res, next) {

  function getCoursebyID(id) {
    var returnvalue;
    var all = getData(); // Hämta courses.json
    all.some(row => { // Kolla igenom varje rad
      //console.log(row["_id"] + ' - ' + id);
      if (row["_id"] == id) { // Om ID angett i URL matchar _id i JSON datan; sätt returnvalue = den raden
        console.log('match!');
        console.log(row);
        returnvalue = row;
      }
    }); // Variabeln blev undefined när jag returna direkt till rad 35, osäker på varför, så fick initiera variabeln returnvalue och setta den.
    return returnvalue;
  }
  //console.log(JSON.stringify(getCoursebyID(req.params.id)));
  res.json(getCoursebyID(req.params.id));
});



// radera en enskild kurs från listan med angivet id (verb DELETE - http://localhost:3000/courses/2)

function deleteCourse(id) {
  var all = getData();
  for (let index = 0; index < all.length; index++) {
    const row = all[index];

    if (row["_id"] == id) {
      all.splice(index, 1); // Splicea ut raden som vi vill ha bort
    }
  }
  all = JSON.stringify(all); // Översätt till JSON igen
  fs.writeFile("courses.json", all, function(error, result) { // Ersätter hela courses.json med all data igen, nu splicead
    if (error) console.log(error); // Om error; logga error
  });
}

router.delete('/:id', function(req, res, next) {
  deleteCourse(req.params.id);
  res.send("<p>Deleted!</p>");
});

module.exports = router;