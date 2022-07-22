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
    }

    async getRaces() {
        for (let m = 10; m <= this.myStuff.amountOfRaces; m++) {
            const raceURL = `http://ergast.com/api/f1/2022/${m}/results.json`

            var res = await fetch(raceURL);
            var resJSON = await res.json();
            if(!resJSON|| resJSON.MRData.RaceTable.Races.length === 0){return}
            var races = resJSON.MRData.RaceTable.Races;
            this.setState(function(state) {
                return { seasonRaces: state.seasonRaces.concat(races) }
            });
        }
    }

    async getDrivers() {
        const driverURL = `https://ergast.com/api/f1/2022/drivers.json`
        var driverResponse = await fetch(driverURL);
        var fullDriverDetail = await driverResponse.json();
        var drivers = fullDriverDetail.MRData.DriverTable.Drivers;

        drivers = drivers.reduce((memo, driver) => {
            if (driver.code === "HUL") { return memo;}
            driver.imageUrl = require(`../images/${driver.code}.png`);
            memo.push(driver)
            return memo;
        }, [])
        this.setState({driverInfo: drivers})
    }

    render() {
        var driversAsListItems= this.state.driverInfo.map((driver) => {
            var imageSource = driver.imageUrl ? driver.imageUrl : "";
            return <li key={driver.code}>{driver.code} - {driver.familyName} <br/> <img src={imageSource} alt="didnt load" /> </li>
        })

        return (
            <div>
                <h1># of Races This Season: {this.state.seasonRaces.length}</h1>
                <img src={require(`../images/LEC.png`)} alt="didnt load" />
                <ul>{driversAsListItems}</ul>
            </div>
        );
    }
}

export default Home;
