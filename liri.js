

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
    if (term === "") {
        term = "Mr+Nobody";
    }
    var queryUrl = `http://www.omdbapi.com/?t=${term}&apikey=2df8f8a8`;
    axios.get(queryUrl).then(
       function (response) {
           var e = response.data;
           if (e.Response === "False" ) {
               console.log("Cannot inf your movie, Watch Mr. NoBody");
               e = nobody;
            }  
            console.log("\n------------------------------------");
            console.log(`${e.Title} ${e.Year} ${e.Country} ${e.Language}`);
            // console.log(`imdb rating:  ${e.imdbRating} , Rotten Tomatoes: ${e.Ratings[1].Value}`);
            console.log(`Actors: ${e.Actors}`);
            console.log(e.Plot);
      } 
    ).catch(function(error)  {
       console.log("getMovie ERROR !");
       e = nobody;
       console.log("No Body")
       printError(error); 
    })

}


function getSpotify(term) {
    spotify.search({ type: 'track', query: term }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log("\n------------------------------------");
    var arrItems = data.tracks.items;
    arrItems.forEach(function (e) {
        // console.log(e.artists)
        console.log(`Artists:${e.artists[0].name}   Song: ${e.name}  `);
        console.log(`preview: ${e.preview_url}`);
        console.log(`Album Name: ${e.album.name}`)
        console.log("");
    })
       
         
        // console.log(data.tracks.items[2].artists); 
      });
}


var moment = require('moment');
require("dotenv").config();
var Spotify = require('node-spotify-api');
var axios = require("axios");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

nobody = require('./default.js');
// console.log(nobody);

// console.log(spotify);
var cmd = process.argv[2];
if (cmd) {
    cmd = cmd.toLowerCase();
} 

var term0 = process.argv.slice(3).join(" ");
var term = process.argv.slice(3).join("+");
console.log(term0, term);

// for (var i=4; i<process.argv.length; i++) {
//     term = term + "+" + process.argv[i];
// }

switch (cmd) {
    case "concert-this":
        getConcert(term);
        break;  
    case "spotify-this-song":
        getSpotify(term0);    
        break;    
    case "movie-this":
        getMovie(term);
        break;    
   
    default: console.log("ERROR");
}

//

//
