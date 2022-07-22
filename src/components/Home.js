import { getAllByDisplayValue } from "@testing-library/react";
import React from "react";

class Home extends React.Component{

     myStuff = {
        seasonRaces: [],
        amountOfRaces: 23,
        currentRound: 10,
        leagueIdentificationNumber: 1,
        topTeams: [
            {
                name: "Cotton Candy Dan",
                teamTotalPoints: 0,
                raceResults: [],
                driverNames: [],
            },  
            {
                name: "Ty's Flyin Tyres",
                teamTotalPoints: 0,
                raceResults: [],
                driverNames: [],
            },
            {
                name: "Kayla's Peanut Patrol",
                teamTotalPoints: 0,
                raceResults: [],
                driverNames: [],
            },
        ],
        bottomTeams: [
            {
                name: "Dan's Back Up Boys",
                teamTotalPoints: 0,
                raceResults: [],
                driverNames: [],
            },  
            {
                name: "First In Our Hearts",
                teamTotalPoints: 0,
                raceResults: [],
                driverNames: [],
            },
            {
                name: "They Made Me Pick Slow People",
                teamTotalPoints: 0,
                raceResults: [],
                driverNames: [],
            },
        ],
    };

    constructor(props){
        super(props);
        this.state = {
            seasonRaces: [],
            driverInfo: [],
            ready: false,
            imagesLoaded: false,
            apiUpdated: false,
            currentRound: 11,
        }
    }

    async componentDidMount(){
        console.log("didmount");
        // console.log("initial state",this.state);
        await this.getDrivers();
        await this.getRaces();
        // console.log("after await BEFORE state", this.state);
        this.setState ({apiUpdated: true})
        console.log("after state and await", this.state);
    }


    addRace(race){
        this.setState(state =>{
            const races = state.seasonRaces.concat(race);
            return {
                seasonRaces: races,
            };
        })
    }

    addDrivers(drivers){
        drivers.forEach(driver => {
            if (driver.code === "HUL"){
                // console.log("REMOVE");
                drivers.splice(driver, 1);
            }
            else{    
            }
        });

        this.setState({driverInfo: drivers})
        this.imageLoader();
    }


    imageLoader(){
        var imageCount = 0;
        var drivers = this.state.driverInfo
        // console.log("LLLLL",drivers);

        for (let i = 0; i < drivers.length; i++){
            imageCount += 1;
            const image = new Image();
            // var url = `./images/items/${drivers[i].code}.png`
            image.src = `../images/${drivers[i].code}.png`;

            // image.onload = () => {
            //     imageCount += 1;
            //     console.log("image count up");
            //     if(imageCount === 20){
            //         console.log('images are loaded! Great Job!');
            //         // this.setState ({canvasLoaded: true})
            //         // this.setState ({imagesLoaded: true})
            //     }
            // };
            
            drivers.forEach(name => {
                // console.log(name.code);
                name.imageURL = image.src;

                if(imageCount === 20){
                    console.log('ready');
                    
                    this.setState ({imagesLoaded: true})
                }
                // console.log(name.code);
                // if(name[19].imgURL){
                       
                // }
            });

            // console.log("images loaded", imageCount);


        }
    }

    async getRaces(){
        this.setState ({apiUpdated: true})  
        for (let m = 10; m <= this.myStuff.amountOfRaces; m++) {
            const raceURL = `http://ergast.com/api/f1/2022/${m}/results.json`
            
            // const raceURL = `http://ergast6.com/api/f1/2022/${m}/results.json` // bad url for tests
            var raceResponse = await fetch(raceURL);
            var fullDetailRace = await raceResponse.json();
            if(!fullDetailRace || fullDetailRace.MRData.RaceTable.Races.length === 0){return}
            var race = fullDetailRace.MRData.RaceTable.Races[0]; 
            // console.log(fullDetailRace);
            // console.log(fullDetailRace.MRData.RaceTable.round);
            if(race){
                // this.myStuff.seasonRaces.push(race);
                this.addRace(race)
                // console.log(race);
            }
        }
        
        
        // console.log(this.state); 
    }

    async getDrivers(){
        const driverURL = `https://ergast.com/api/f1/2022/drivers.json`
        var driverResponse = await fetch(driverURL);
        var fullDriverDetail = await driverResponse.json();
        // console.log("driver deet",fullDriverDetail.MRData.DriverTable.Drivers);
        var drivers = fullDriverDetail.MRData.DriverTable.Drivers;
        if(drivers){
            this.addDrivers(drivers);
        }


    }
    
    render() {
            var poo ="loading"
            // console.log("outside if", this.state);
            // // react not re-rendering when array in state gets new value
            // // each object in any array need to check that key exists.
            // // console.log(this.state);
            // const poo = this.state.seasonRaces.map((race) => {
            //     return <li>{race.round}</li>
            // })
        if(this.state.imagesLoaded){
            // console.log("inside if", this.state);
            poo = this.state.driverInfo.map((driver) => {
                // src\images\ALB.png
                // src={require("./images/items/redX.png")} alt="loading error"/>
                // var imgURL = "`../images/" + driver.code + ".png`"
                console.log(driver.imgURL);
                // return <li>{driver.code} - {driver.familyName} - {driver.imageURL} </li>
                return <li>{driver.code} - {driver.familyName} - <img src={driver.imgURL} alt="didnt load"/> </li>
            })
        }

        const foo = this.myStuff.topTeams.map((team) => { 
            return <li>{team.name}</li>
        });

        return(
                
                // <ul>{foo}</ul>
                <div>
                    <img src={require(`../images/LEC.png`)} alt="didnt load"/>
                    <ul>{poo}</ul>
                </div>
        );

    }
}

export default Home;