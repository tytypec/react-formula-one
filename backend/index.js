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
console.log(workingFilePaths);
var images = [];

var myStuff = {
    seasonRaces: [],
    seasonDrivers: [],
    amountOfRaces: 23,
    currentRound: 10,
    leagueIdentificationNumber: 1,
    images: [],
}

async function main(){
    await getRaces();
    await getDrivers();
    // console.log(myStuff);
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
    for (let m = 10; m <= myStuff.amountOfRaces; m++) {
        const raceURL = `http://ergast.com/api/f1/2022/${m}/results.json`
        var raceResponse = await fetch(raceURL);
        var raceResponse = await raceResponse.json();
        if(!raceResponse|| raceResponse.MRData.RaceTable.Races.length === 0){return}
        var races = raceResponse.MRData.RaceTable.Races;
        console.log(races);
        // if(this.state.seasonRaces.includes(races) === true){return}
        // this.setState(function(state) {
        //     return { seasonRaces: state.seasonRaces.concat(races) }
        // });
    }
}

async function getDrivers() {
    const driverURL = `https://ergast.com/api/f1/2022/drivers.json`
    var driverResponse = await fetch(driverURL);
    var fullDriverDetail = await driverResponse.json();
    var drivers = fullDriverDetail.MRData.DriverTable.Drivers;

    drivers = drivers.reduce((memo, driver) => {
        if (driver.code === "HUL") { return memo;}
        // driver.imageUrl = require(`../images/${}.png`);
        driver.results = [];
        myStuff.seasonDrivers = drivers;
        // memo.push(driver)
        // return memo;
    }, [])
}

function sendInfo(){
    app.get('/myStuff', (req, res) => {
        res.json(myStuff);
      });
}

app.listen(port, () => {
    console.log('Server Listening on port', port);
  });