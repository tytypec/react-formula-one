import { getAllByDisplayValue, getAllByPlaceholderText } from "@testing-library/react";
import axios from 'axios';
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
                teamDriverInfo: [],
                driverCodes: ["PER","VER"],
            },
            {
                name: "Ty's Flyin Tyres",
                teamTotalPoints: 0,
                teamDriverInfo: [],
                driverCodes: ["HAM","LEC"],
            },
            {
                name: "Kayla's Peanut Patrol",
                teamTotalPoints: 0,
                teamDriverInfo: [],
                driverCodes: ["RUS","SAI"],
            },
        ],
        bottomTeams: [
            {
                name: "Dan's Back Up Boys",
                teamTotalPoints: 0,
                teamDriverInfo: [],
                driverCodes: ["NOR","VET"],
            },
            {
                name: "First In Our Hearts",
                teamTotalPoints: 0,
                teamDriverInfo: [],
                driverCodes: ["BOT","RIC"],
            },
            {
                name: "They Made Me Pick Slow People",
                teamTotalPoints: 0,
                teamDriverInfo: [],
                driverCodes: ["ALO","TSU"],
            },
        ],

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
    };

    constructor(props) {
        super(props);
        this.state = {
            backendInfo: [],
            seasonRaces: [],
            driverInfo: [],
            currentRound: 11,
            topTeams: [],
            bottomTeams: [],
            teamsFetched: false,
        }
    }

    async componentDidMount() {
        await this.backend();
        await this.getDrivers();
        await this.getRaces();
        this.addRacesToDrivers();
        // this.addQualifyingPoints();
        this.addDriversToTeams(this.myStuff.topTeams);
        this.addDriversToTeams(this.myStuff.bottomTeams);
        this.sumTeamPoints(this.myStuff.topTeams, this.state.topTeams);
        this.sumTeamPoints(this.myStuff.bottomTeams, this.state.bottomTeams);
        console.log("STATE", this.state);
        console.log("MYSTUFF", this.myStuff);
    }
    // dictionary python a way to look up information.
    
    async backend(){
        var backendResponse = await fetch('http://localhost:3001/myStuff');
        var backendData = await backendResponse.json();
        console.log("backdata", backendData);
        this.setState ({backendInfo: backendData})
    }

    sumTeamPoints(teams, stateTeam){
        // const teams = this.myStuff.topTeams;

        teams.forEach(team => {
            var totalPoints = 0;

            // console.log(team.teamDriverInfo);
            team.teamDriverInfo.forEach(result => {
                totalPoints += result.seasonPoints;;
            });

            team.teamTotalPoints = totalPoints;
            stateTeam.push(team)
        });

        if(stateTeam === undefined || stateTeam.length == 0){
            console.log("Teams NOT Loaded");
        }
        else{
            console.log("Teams Loaded");
            this.setState ({teamsFetched: true})
        }
    }

    //this function intentionally out of addRacesToDrivers() this should happen on front end
    // and addRacesToDrivers() Should be back end.
    addDriversToTeams(team){
        const drivers = this.state.driverInfo;

        drivers.forEach(driver => {
            if(driver.code === team[0].driverCodes[0] || driver.code === team[0].driverCodes[1]){
                team[0].teamDriverInfo.push(driver);
                // this.myStuff.topTeams[0].driverResults.push(driver)
            }
            if(driver.code === team[1].driverCodes[0] || driver.code === team[1].driverCodes[1]){
                team[1].teamDriverInfo.push(driver); 
            }
            if(driver.code === team[2].driverCodes[0] || driver.code === team[2].driverCodes[1]){
                team[2].teamDriverInfo.push(driver);
            }
        });
    }

    // addQualifyingPoints(){

    // }

    addRacesToDrivers(){
        const races = this.state.seasonRaces;
        const drivers = this.state.driverInfo;
        races.forEach(race => {
            race.Results.forEach(result => {
                    // checks against scoreSheet to assign qualifying points
                    this.myStuff.scoreSheet.forEach(position => {
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

    async getRaces() {
        for (let m = 10; m <= this.myStuff.amountOfRaces; m++) {
            const raceURL = `http://ergast.com/api/f1/2022/${m}/results.json`
            var raceResponse = await fetch(raceURL);
            var raceResponse = await raceResponse.json();
            if(!raceResponse|| raceResponse.MRData.RaceTable.Races.length === 0){return}
            var races = raceResponse.MRData.RaceTable.Races;
            
            if(this.state.seasonRaces.includes(races) === true){return}
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
            driver.results = [];
            memo.push(driver)
            return memo;
        }, [])
        this.setState({driverInfo: drivers})
    }

    render() {


        var driversAsListItems= this.state.driverInfo.map((driver) => {
            var imageSource = driver.imageUrl ? driver.imageUrl : "";
            return <li key={driver.code}>{driver.code} - {driver.givenName} {driver.familyName} <br/>{driver.permanentNumber} - {driver.construction} <br/> <img src={imageSource} alt="didnt load" />
             {/* <br/>{driver.results[0].result.Constructor.name} */}
             </li>
             
        })

        // console.log("team", this.state.teams.name);
        var topTeamScores = this.state.topTeams.map((team) => {  
            // var teamName = team.name ? team.name : "";
            return <tr key={team.name}><td>{team.name}</td> <td>{team.teamTotalPoints}</td> </tr>
        })

        var bottomTeamScores = this.myStuff.bottomTeams.map((team) => {  
            // var teamName = team.name ? team.name : "";
            return <tr key={team.name}><td>{team.name}</td> <td>{team.teamTotalPoints}</td> </tr>
        })
        
        return (
            <div>
                <div className="topTeamsTable">
                    <div>Top Constructors Score</div>
                    <table>
                    <thead>
                        <tr>
                        <th>Team</th>
                        <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topTeamScores}
                    </tbody>
                    </table>
                </div>
                <div className="bottomTeamsTable">
                    <div>Bottom Constructors Score</div>
                    <table>
                    <thead>
                        <tr>
                        <th>Team</th>
                        <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bottomTeamScores}
                    </tbody>
                    </table>
                </div>
                <h1># of Races This Season: {this.state.seasonRaces.length}</h1>
                <ul>{driversAsListItems}</ul>
            </div>
        );
    }
}

export default Home;
