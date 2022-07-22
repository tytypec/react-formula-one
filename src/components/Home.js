import { getAllByDisplayValue } from "@testing-library/react";
import React from "react";

class Home extends React.Component {

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

    constructor(props) {
        super(props);
        this.state = {
            seasonRaces: [],
            driverInfo: [],
            currentRound: 11,
        }
    }

    async componentDidMount() {
        await this.getDrivers();
        await this.getRaces();
        this.setState({ apiUpdated: true })
    }


    addRace(race) {
        this.setState(state => {
            const races = state.seasonRaces.concat(race);
            return {
                seasonRaces: races,
            };
        })
    }

    async addDrivers(drivers) {
        drivers.forEach(driver => {
            if (driver.code === "HUL") {
                // console.log("REMOVE");
                drivers.splice(driver, 1);
            }
            else {
            }
        });

        this.setState({ driverInfo: drivers });
        this.imageLoader();
    }


    imageLoader() {
        if (!this.state.driverInfo.length) {
            console.log('Not updating driver info, no info found.');
            return;
        }

        var out = this.state.driverInfo.map(driver => {
            driver.imageUrl = require(`../images/${driver.code}.png`);
            return driver
        })

        // out.forEach(e => { console.log(e.imageUrl); })
        this.setState({ driverInfo: out })
    }

    async getRaces() {
        for (let m = 10; m <= this.myStuff.amountOfRaces; m++) {
            const raceURL = `http://ergast.com/api/f1/2022/${m}/results.json`

            // const raceURL = `http://ergast6.com/api/f1/2022/${m}/results.json` // bad url for tests
            var raceResponse = await fetch(raceURL);
            var fullDetailRace = await raceResponse.json();
            if (!fullDetailRace || fullDetailRace.MRData.RaceTable.Races.length === 0) { return }
            var race = fullDetailRace.MRData.RaceTable.Races[0];
            // console.log(fullDetailRace);
            // console.log(fullDetailRace.MRData.RaceTable.round);
            if (race) {
                // this.myStuff.seasonRaces.push(race);
                this.addRace(race)
                // console.log(race);
            }
        }


        // console.log(this.state);
    }

    async getDrivers() {
        const driverURL = `https://ergast.com/api/f1/2022/drivers.json`
        var driverResponse = await fetch(driverURL);
        var fullDriverDetail = await driverResponse.json();
        // console.log("driver deet",fullDriverDetail.MRData.DriverTable.Drivers);
        var drivers = fullDriverDetail.MRData.DriverTable.Drivers;
        if (drivers) {
            this.addDrivers(drivers);
        }


    }

    render() {
        var driversAsListItems= this.state.driverInfo.map((driver) => {
            //    return <li>{driver.code} - {driver.familyName} - {driver.imageUrl} </li>
            var imageSource = driver.imageUrl ? driver.imageUrl : "";
            return <li key={driver.code}>{driver.code} - {driver.familyName} <br/> <img src={imageSource} alt="didnt load" /> </li>
        })

        return (
            <div>
                <img src={require(`../images/LEC.png`)} alt="didnt load" />
                <ul>{driversAsListItems}</ul>
            </div>
        );
    }
}

export default Home;
