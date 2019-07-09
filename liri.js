

function printError(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
}

// concert-this
//Example:  https://rest.bandsintown.com/artists/lady+gaga/events?app_id=codingbootcamp

function getConcert(term) {
  var queryUrl = `https://rest.bandsintown.com/artists/${term}/events?app_id=codingbootcamp`;
  axios.get(queryUrl).then(
    function(response) {
      if (response.data.length > 0 ) {
          response.data.forEach (function(e) {
              console.log("\n------------------------------------")
              console.log(`${e.venue.name} ${e.venue.city} ${e.venue.country}`);
            //   console.log(moment(e.datetime));
              var m = moment(e.datetime).format('MM/DD/YYYY');
              console.log(`Date: ${m}`);
          })
      }  else {
          console.log(term + " NOT FOUND !");
      }
    //   console.log("The movie is released on " + response.data[0].venue.name);
    })
    .catch(function(error) {
      console.log("getConcert ERROR !");  
      printError(error);      
    });
}

// http://www.omdbapi.com/?t=pretty+woman&apikey=2df8f8a8   search title
// http://www.omdbapi.com/?i=tt0100405&apikey=2df8f8a8  

function getMovie(term) {
    var queryUrl = `http://www.omdbapi.com/?t=${term}&apikey=2df8f8a8`;
    axios.get(queryUrl).then(
       function (response) {
           var e = response.data;
           if (e.Response === "True") {   
            console.log("\n------------------------------------");
            console.log(`${e.Title} ${e.Year} ${e.Country} ${e.Language}`);
            console.log(`imdb rating:  ${e.imdbRating} , Rotten Tomatoes: ${e.Ratings[1].Value}`);
            console.log(`Actors: ${e.Actors}`);
            console.log(e.Plot);
           } else {
               console.log("Movie not found !");
           }
       } 
    ).catch(function(error)  {
       console.log("getMovie ERROR !");
       printError(error); 
    })

}


var moment = require('moment');
require("dotenv").config();
var Spotify = require('node-spotify-api');
var axios = require("axios");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// console.log(spotify);
var cmd = process.argv[2];
if (cmd) {
    cmd = cmd.toLowerCase();
} 

var term = process.argv[3];

for (var i=4; i<process.argv.length; i++) {
    term = term + "+" + process.argv[i];
}

switch (cmd) {
    case "concert-this":
        getConcert(term);
        break;  
    case "movie-this":
        getMovie(term);
        break;    
   
    default: console.log("ERROR");
}

//

//
