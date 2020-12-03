const express = require('express');
const fs = require('fs');
const request = require('request');
const app = express();
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  
  fs.readFile('form.html', (err, data) => {
    if (err) throw err;
    //console.log(data.toString());
    res.send(data.toString());
  });
  
});

app.post("/", function(req, res) {
  console.log("Post request received");
  //console.log("Data: " + req.body);
  //console.log(req.body.key);
  if (process.env.REQUESTOR_KEY === req.body.key) {
    console.log("Calling Habitica API...");
    scoreHabiticaTask();
    //console.log("Done triggering.");
  } else {
    console.log("Bad key, exiting.");
  } 
  res.end();
});


app.listen(3000, () => {
  console.log('server started');
  //console.log(app.locals);
});

function scoreHabiticaTask() {
  // Make a request to Habitica using the user ID and API key from .env 
  request(
    {
      headers: {
        "x-api-user": process.env.HABITICA_USER,
        "x-api-key": process.env.HABITICA_API_KEY
      },
      uri:
        "https://habitica.com/api/v3/tasks/" +
        process.env.HABIT_ID +
        "/score/up",
      method: "POST"
    },
    function(error, res, body) {
      if (!error && res.statusCode == 200) {
        console.log(body); // Show the res from Habitica
      } else {
        console.log(res.statusCode);
        console.log(body);
      }
    }
  );
}