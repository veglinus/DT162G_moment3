var ajax = new XMLHttpRequest;
var table = document.getElementById("courses"); // Hämta tablen i HTML filen

ajax.onreadystatechange = function() {
    if (this.status == 200 && this.readyState == 4) {
        var jsondata = JSON.parse(this.responseText); // Respons från /courses API
        //console.log(table);

        jsondata.reverse().forEach(row => { // För varje rad i datan:

            var newrow = table.insertRow(1); // Skapa en ny rad

            var cell1 = newrow.insertCell(0); // Och 5 nya celler
            var cell2 = newrow.insertCell(1);
            var cell3 = newrow.insertCell(2);
            var cell4 = newrow.insertCell(3);
            var cell5 = newrow.insertCell(4);

            cell1.innerHTML = row["_id"]; // Tryck in data i dessa 5 celler
            cell2.innerHTML = row["courseId"];
            cell3.innerHTML = row["courseName"];
            cell4.innerHTML = row["coursePeriod"];
            cell5.innerHTML = `<a href='#' onclick='deleteCourse("${row["_id"]}")'><img src='images/delete.svg' class='deleteimg' alt='Ta bort'></a>`;
            newrow.id = row["_id"];

        });
    }
}

ajax.open("GET", "/courses", false);
ajax.send();

function deleteCourse(id) { // Ta bort en kurs
    var check = confirm("Är du säker på att du vill ta bort den här kursen?"); // Confirmation box

    if (check === true) { // Om ja;
        let url = "/courses/" + id; // Sätt urln till rätt id
        ajax.onreadystatechange = function() {
            if (this.status == 200 && this.readyState == 4) { // Om den togs bort
                var idrow = document.getElementById(id);
                idrow.remove(); // Ta även bort på sidan så man slipper ladda om
            }
        }
        ajax.open("DELETE", url, false);
        ajax.send();
    }
}

function addCourse() {

    const data = { // Hämta all data från formuläret
        courseid: document.getElementById("courseId").value,
        coursename: document.getElementById("courseName").value,
        courseperiod: document.getElementById("coursePeriod").value
    }
    
    ajax.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {
            console.log("Kurs tillagd");
            location.reload(); // Ladda om sidan om det fungerade
            return false;
        }
    }
    ajax.open("POST", "/courses", false); // Skicka som POST-request
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(JSON.stringify(data)); // Skicka med datan
    //console.log(JSON.stringify(data));
}


window.addEventListener("load", function () { // Event listener för submit-knappen i formuläret
    // Koden är skriven utifrån https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        addCourse();
      });
});