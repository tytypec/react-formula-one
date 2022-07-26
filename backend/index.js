import ImageRepository from "./src/imageRepository.js"; 
import express from 'express';
import cors from "cors";
import path from 'path';
import fetch from "node-fetch";
import {fileURLToPath} from 'url';
import { log } from "console";

const app = express();
const port = 3001;

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
    currentRound: 10,
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
    await getRaces();
    await getDrivers();
    // console.log(myStuff);
    addRacesToDrivers();
    sendInfo();
}

main();

workingFilePaths.forEach((element, index) => {
    // var imageURL = repo.folderPath() + element
    // var imageURL = 'http://localhost:3000/images/items/' + element
    var imageURL = 'http://localhost:3000/image/' + element
    // var imageName = element.replace(/\.[^/.]+$/, "");
    var imageName = element.replace(".png", "");
    var thing = {
      image: imageName,
      url : imageURL,
      id: index
    }
    myStuff.images.push(thing);
    // console.log(thing);
  })


  async function getRaces() {
    console.log("getRaces");
    for (let m = 10; m <= myStuff.amountOfRaces; m++) {
        const raceURL = `http://ergast.com/api/f1/2022/${m}/results.json`
        var raceResponse = await fetch(raceURL);
        var raceJson = await raceResponse.json();
        if(!raceJson|| raceJson.MRData.RaceTable.Races.length === 0){return}
        var races = raceJson.MRData.RaceTable.Races;
        // there could be extra data in the array, we want to isolate object.
        console.log(races);
        // myStuff.seasonRaces.concat(races);
        myStuff.seasonRaces.push(races[0]);
        console.log(myStuff.seasonRaces);
        // if(this.state.seasonRaces.includes(races) === true){return}
        // this.setState(function(state) {
        //     return { seasonRaces: state.seasonRaces.concat(races) }
        // });
    }
}

async function getDrivers() {
    console.log("inside getDrivers");
    const driverURL = `https://ergast.com/api/f1/2022/drivers.json`
    var driverResponse = await fetch(driverURL);
    var fullDriverDetail = await driverResponse.json();
    var drivers = fullDriverDetail.MRData.DriverTable.Drivers;

    //reduce is similar to map
    // function noHulkenburg(memo, driver){
    //     if (driver.code === "HUL") { return memo;}
    //     driver.imageUrl = `http://localhost:3000/image/${driver.code}.png`;
    //     driver.results = [];
    //     memo.push(driver)
    //     console.log(driver.code);
    //     console.log(memo.length);
    //     return memo;

    // }

    // drivers = drivers.reduce(noHulkenburg, [])
    
    
    
    
    // drivers.forEach(driver =>{ console.log(driver.code);})
    // var memo = [];

    // var memo = drivers.map(driver => {
    //     if(driver.code === "HUL"){        
    //         return
    //     }
    //     // memo.push(driver)
    //     // console.log(memo.length);
    //     return driver;
    // })

    // memo.forEach(driver =>{ console.log(driver.code);})

    drivers = drivers.reduce((memo, driver) => {
        if (driver.code === "HUL") { return memo;}
        driver.imageUrl = `http://localhost:3000/image/${driver.code}.png`;
        driver.results = [];
        memo.push(driver)
        return memo;
    }, [])

    // var numbers = [1,2,3,4,5]
    
    // var fun = numbers.reduce((num, numbers) => {
    //     numbers += num
    //     return numbers;
    // }, 0)

    // console.log(fun);

    myStuff.seasonDrivers = drivers;
}

// forEach Map reduce. reduce I have control over the box

function addRacesToDrivers(){
    const races = myStuff.seasonRaces;
    const drivers = myStuff.seasonDrivers;
    // console.log("SEASON RACES", myStuff)
    races.forEach(race => {
        console.log("RACE",race);
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

function sendInfo(){
    app.get('/myStuff', (req, res) => {
        res.json(myStuff);
      });
}

app.listen(port, () => {
    console.log('Server Listening on port', port);
  });