

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
// only one movie display

function getMovie(term) {
    if (term === "") {
        term = "Mr+Nobody";
    }
    var queryUrl = `http://www.omdbapi.com/?t=${term}&apikey=2df8f8a8`;
    axios.get(queryUrl).then(
       function (response) {
           var e = response.data;
           if (e.Response === "False" ) {
               console.log("Cannot find your movie, Watch Mr. NoBody");
               e = nobody;
            }  
            var tomatoes = '';
            e.Ratings.forEach(function(r){
                if (r.Source === 'Rotten Tomatoes') {
                   tomatoes = "Rotten Tomatoes: " + r.Value;
                } 
            })
            console.log("\n------------------------------------");
            console.log(`${e.Title} ${e.Year} ${e.Country} ${e.Language}`);
            console.log(`imdb rating:  ${e.imdbRating} ,  ${tomatoes}`);
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
        // console.log(e);
        // console.log(e.artists)
        var artistNames = Array.from(e.artists, x=>x.name).join(" ");
        console.log(`Song: ${e.name}  `);
        console.log('Artists: ' , artistNames)
        if (e.preview_url) {
           console.log(`preview: ${e.preview_url}`);
        }   
        console.log(`Album Name: ${e.album.name}`)
        console.log("");
    })
       
         
        // console.log(data.tracks.items[2].artists); 
      });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function doWhatever() {
   fs.readFile(fRandom, 'utf8', function (err, info) {
     var arr = info.split('\n').filter(x => x.trim()!=="");
     console.log(getRandomInt(arr.length));
     var arr1 = arr[getRandomInt(arr.length)].split(',');
     var cmd  = arr1[0].trim();
     var term = arr1[1].trim();
     goAhead(cmd, term);

     console.log(cmd , term);
   })
}

function goAhead(cmd, term) {
  var term1 = term.replace(" ", "+");
  switch (cmd) {
    case "concert-this":
        getConcert(term1);
        break;  
    case "spotify-this-song":
        getSpotify(term);    
        break;    
    case "movie-this":
        getMovie(term1);
        break;    
    case "do-what-it-says":
    default:
        doWhatever();
  }

}

function promptCommandTerm () {
  inquirer.prompt([{
     type: 'list',
     name: 'cmd',
     message: "\n What do you want to do : \n",
     choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]
    },
    {
      type: 'input',
      name: 'term',
      message: 'Enter the name of an artist, song or movie ?'
    }
  ]).then(answers => {
    cmd = answers.cmd;
    term = answers.term;
    goAhead(cmd, term);
  });
}

//
//   BEGIN HERE
//

var moment = require('moment');
require("dotenv").config();
var Spotify = require('node-spotify-api');
var axios = require("axios");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
const fs = require('fs');
var fRandom = "./random.txt";
const inquirer = require('inquirer');

nobody = require('./default.js');
var cmd = process.argv[2];
var term = "";

if (cmd) {
  term = process.argv.slice(3).join(" ");
  cmd = cmd.toLowerCase();  
  goAhead(cmd, term); 
} else {   // Interactive if no "cmd"
  promptCommandTerm();    
}