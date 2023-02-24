import ImageRepository from "./src/imageRepository.js"; 
import express from 'express';
import cors from "cors";
import path from 'path';
import fetch from "node-fetch";
import {fileURLToPath} from 'url';
import { log } from "console";
// chronjobs

const app = express();
const port = 3001;
const API_URL = process.env.DOMAIN_URL ? process.env.DOMAIN_URL : "http://127.0.0.1:3001"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
global.__basedir = __dirname;

var repo = new ImageRepository();
var myImages = repo.readImageFileNames();
var workingFilePaths = repo.readImageFileNames();
// console.log(workingFilePaths);
var images = [];

var myStuff = {
    seasonRaces: [],
    seasonDrivers: [],
    amountOfRaces: 23,
    seasonStartingRound: 10,
    getRacesConfig:{
        frequency: 1800000,  
        // frequency: 11800,  
    }, 
    leagueIdentificationNumber: 1,
    images: [],
    scoreSheet: [
        {
            position: 1,
            points: 25
        },
        {
            position: 2,
            points: 18
        },
        {
            position: 3,
            points: 15
        },
        {
            position: 4,
            points: 12
        },
        {
            position: 5,
            points: 10
        },
        {
            position: 6,
            points: 8
        },
        {
            position: 7,
            points: 6
        },
        {
            position: 8,
            points: 4
        },
        {
            position: 9,
            points: 2
        },
        {
            position: 10,
            points: 1
        },
    ]
}

async function main(){
    await getDrivers();
    await getRaces();
    
    // console.log(global.__basedir);
    // console.log(myImages);
    addRacesToDrivers(myStuff.seasonDrivers,myStuff.seasonRaces); //trying to add this to the bottom of getRaces() so its called when setInterval is envoked. That didnt work 
    // this is a 10 second interval used for testing code
    // setInterval(checkDate, 10000);
    // this is a 30 mins interval to check if its sunday. *Scheduled jobs.
    setInterval(getRaces, myStuff.getRacesConfig.frequency);
}

main();


// workingFilePaths.forEach((element, index) => {
//     // var imageURL = repo.folderPath() + element
//     // var imageURL = 'http://localhost:3000/images/items/' + element
//     var imageURL = 'http://localhost:3001/image/' + element
//     // var imageName = element.replace(/\.[^/.]+$/, "");
//     var imageName = element.replace(".png", "");
//     var thing = {
//         image: imageName,
//         url : imageURL,
//         id: index
//     }
//     myStuff.images.push(thing);
//     // console.log(thing);
// })

app.get("/images", (req, res) => {
    res.json(images);
});
  
app.get("/image/:imageName", (req, res) => {
  
    var options = {
      root: repo.imageDirectory,
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
  
    var fileName = req.params.imageName
    res.sendFile(fileName, options, function(err){
      if (err){
        console.log(err);
      }
      else{
        console.log('sent: ', fileName );
      }
    })
    // console.log(req.params);
    // res.json(req.params.name);
});

//   return number of latest race week  
function latestRaceWeek(){
    // this is offset to start at 10th race of season.
    var raceCount = myStuff.seasonRaces.length + myStuff.seasonStartingRound;
    return raceCount; 
}

// async function getRaces(){
//     var data;
//     const raceURL = `http://ergast.com/api/f1/2022/10/results.json`
//     var myPromise = fetch(raceURL).then((response)=>{
//         data = response
//         console.log(data);
//     });

//     console.log(myPromise);
//     console.log(data);
// }

async function getRaces() {
    var currentRace = latestRaceWeek();
    var found = true;

    while (found) {
        const raceURL = `http://ergast.com/api/f1/2022/${currentRace}/results.json`
        try{
        var raceResponse = await fetch(raceURL);}
        catch(e){
            console.log("fail to fetch raceResponse from the race number", currentRace);
            console.log(e);
            break
        };
        try{
            var raceJson = await raceResponse.json();
            console.log("raceResponse.json code");
        }
        catch(e){
            console.log("fail to fetch raceJson from the race number", currentRace);
            console.log(e);
            break
        };
        found = raceJson && raceJson.MRData.RaceTable.Races.length;
        if(!found) { continue; };
        var races = raceJson.MRData.RaceTable.Races; 
        myStuff.seasonRaces.push(races[0]);
        currentRace += 1;
    }

}

//   async function getRacesForLoop() {
//     // console.log("getRaces");
//     for (let m = 10; m <= myStuff.amountOfRaces; m++) {
//         const raceURL = `http://ergast.com/api/f1/2022/${m}/results.json`
//         var raceResponse = await fetch(raceURL);
//         var raceJson = await raceResponse.json();
//         if(!raceJson|| raceJson.MRData.RaceTable.Races.length === 0){return}
//         var races = raceJson.MRData.RaceTable.Races;
//         // there could be extra data in the array, we want to isolate object.
//         // console.log(races);
//         // myStuff.seasonRaces.concat(races);
//         myStuff.seasonRaces.push(races[0]);
//         // console.log(myStuff.seasonRaces);
//         // if(this.state.seasonRaces.includes(races) === true){return}
//         // this.setState(function(state) {
//         //     return { seasonRaces: state.seasonRaces.concat(races) }
//         // });
//     }
// }

async function getDrivers() {
    // console.log("inside getDrivers");
    const driverURL = `https://ergast.com/api/f1/2022/drivers.json`
    var driverResponse = await fetch(driverURL);
    var fullDriverDetail = await driverResponse.json();
    var drivers = fullDriverDetail.MRData.DriverTable.Drivers;


    drivers = drivers.reduce((memo, driver) => {
        if (driver.code === "HUL") { return memo;}
        // driver.imageUrl = `http://localhost:3001/image/${driver.code}.png`;
        driver.imageUrl = API_URL + `/image/${driver.code}.png`;
        driver.results = [];
        memo.push(driver)
        return memo;
    }, [])

    myStuff.seasonDrivers = drivers;
}

// forEach Map reduce. reduce I have control over the box

function addRacesToDrivers(){
    const races = myStuff.seasonRaces;
    const drivers = myStuff.seasonDrivers;
    console.log(races.length);
    console.log(drivers.length);
    // console.log("SEASON RACES", myStuff)
    races.forEach(race => {
        // console.log("RACE",race);
        race.Results.forEach(result => {
            // checks against scoreSheet to assign qualifying points
            myStuff.scoreSheet.forEach(position => {
                if(parseInt(result.grid) === position.position){
                    result.qualifyingPoints = position.points;
                    // var weekendPoints = position.points + result.Results.points;
                }
                else if(parseInt(result.grid) >= 11 || parseInt(result.grid) === 0 || parseInt(result.grid) === "R"){
                    result.qualifyingPoints = 0;   
                }
                // else{
                //     result.qualifyingPoints = 0;
                // }
            });
            result.weekendPoints = parseInt(result.points) + result.qualifyingPoints;

            drivers.forEach(driver => {
                if(result.Driver.code === driver.code && driver.results.includes(result) === false){
                    var info = {
                        circuit: race.Circuit,
                        result: result,
                    } 
                    driver.results.push(info)
                    // console.log(driver.code, parseInt(result.weekendPoints));
                }
                var totalPoints = 0;
                var construction = "";

                driver.results.forEach(result => {
                    totalPoints += result.result.weekendPoints;
                    construction = driver.results[0].result.Constructor.name;
                    // console.log(driver.results[0].result.Constructor.name);  
                })
                driver.seasonPoints = totalPoints;
                
                driver.construction = construction;
            });
        });
    });
}


app.get('/myStuff', (req, res) => {
    console.log("got here");
    // console.log(req);
    res.json(myStuff);
});


app.listen(port, () => {
    console.log('Server Listening on port', port);
});

// docker build -t {image name} THIS BUILDS THE THING
// docker run -p port:port {image name} THIS RUN
// docker rm -f $(docker ps -a -q) YOU CANT US ^C for some reason
// 
// docker run -p 80:3000 --env-file ./myEnv typecora/formula-front
// docker run -p 3001:3001 --env-file ./myEnv typecora/formula-back

// next 3 steps
// 1 container front end. Create Dockerfile and Dockerignore (backend folder too)
// 2 Run front end containter and  navigate to UI in browser get something to show up
// 3 get front end container should fetch data from backend container (use differnt IP http://127.0.0.1/)







// error recieved
//   file:///D:/Code/react-formula-one/backend/node_modules/node-fetch/src/index.js:108
//                         reject(new 
// FetchError(`request to ${request.url} failed, reason: ${error.message}`, 'system', error));
//                                ^   

// FetchError: request to http://ergast.com/api/f1/2022/14/results.json failed, reason: connect ETIMEDOUT 185.229.22.110:80
//     at ClientRequest.<anonymous> (file:///D:/Code/react-formula-one/backend/node_modules/node-fetch/src/index.js:108:11)
//     at ClientRequest.emit (node:events:390:28)
//     at Socket.socketErrorListener (node:_http_client:447:9)
//     at Socket.emit (node:events:390:28)
//     at emitErrorNT (node:internal/streams/destroy:157:8)
//     at emitErrorCloseNT (node:internal/streams/destroy:122:3)
//     at processTicksAndRejections (node:internal/process/task_queues:83:21) {
//   type: 'system',
//   errno: 'ETIMEDOUT',
//   code: 'ETIMEDOUT',
//   erroredSysCall: 'connect'        
// }
// PS D:\Code\react-formula-one\backend>


// file:///D:/Code/react-formula-one/backend/node_modules/node-fetch/src/index.js:108
//                         reject(new 
// FetchError(`request to ${request.url} failed, reason: ${error.message}`, 'system', error));
//                                ^   

// FetchError: request to http://ergast.com/api/f1/2022/14/results.json failed, reason: read ECONNRESET     
//     at ClientRequest.<anonymous> (file:///D:/Code/react-formula-one/backend/node_modules/node-fetch/src/index.js:108:11)
//     at ClientRequest.emit (node:events:390:28)
//     at Socket.socketErrorListener (node:_http_client:447:9)
//     at Socket.emit (node:events:390:28)
//     at emitErrorNT (node:internal/streams/destroy:157:8)
//     at emitErrorCloseNT (node:internal/streams/destroy:122:3)
//     at processTicksAndRejections (node:internal/process/task_queues:83:21) {
//   type: 'system',
//   errno: 'ECONNRESET',
//   code: 'ECONNRESET',
//   erroredSysCall: 'read'
// }