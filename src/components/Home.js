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
        // console.log("didmount");
        // console.log("initial state",this.state);
        await this.getDrivers();
        await this.getRaces();
        // console.log("after await BEFORE state", this.state);
        this.setState ({apiUpdated: true})
        // console.log("after state and await", this.state);
    }


    async addRace(race){
        await this.setState(state =>{
            const races = state.seasonRaces.concat(race);
            return {
                seasonRaces: races,
            };
        })
    }

    async addDrivers(drivers){
        drivers.forEach(driver => {
            if (driver.code === "HUL"){
                // console.log("REMOVE");
                drivers.splice(driver, 1);
            }
            else{
            }
        });

        console.log(drivers)
        this.setState({driverInfo: drivers}, () => {
            this.imageLoader();
        })
    }


    imageLoader(){

        console.log('start imageLoader');
        console.log(this.state.driverInfo)

        // console.log('blup');
        // var copy = [...this.state.driverInfo];
        // copy.forEach((driver, i) => {
        //     // const image = new Image();
        //     // image.src = `../images/${driver.code}.png`;
        //     let driverCopy = {...copy[i]};
        //     driverCopy.imageUrl = `../images/${driver.code}.png`;
        //     copy[i] = driverCopy;
        //     console.log(copy);
        //     // return copy;
        // });

        // copy.forEach(e => { console.log(e.imageUrl);})


        // this.setState({driverInfo: copy})

        if (!this.state.driverInfo) {
            console.log('Not updating driver info, no info found.');
            return
        }

        var out = this.state.driverInfo.map(driver => {
            driver.imageUrl = require(`../images/${driver.code}.png`);
            return driver
        })

        out.forEach(e => { console.log(e.imageUrl);})
        this.setState({ driverInfo: out })

        console.log('blup');
        console.log('wizbang');
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
        console.log('from render');
        var poo;
        // if (this.state.driversReady) {
            poo = this.state.driverInfo.map((driver) => {
            //    return <li>{driver.code} - {driver.familyName} - {driver.imageUrl} </li>
                var imageSource = driver.imageUrl ? driver.imageUrl : "";
                return <li>{driver.code} - {driver.familyName} - <img src={imageSource} alt="didnt load"/> </li>
            })
        // }


        const foo = this.myStuff.topTeams.map((team) => {
            return <li key="{team.name}">{team.name}</li>
        });

        return(
            <div>
                <img src={require(`../images/LEC.png`)} alt="didnt load"/>
                <ul>{poo}</ul>
            </div>
        );

    }
}

export default Home;
