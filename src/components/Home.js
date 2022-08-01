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
            imagesLoaded: false,
        }
    }

    async componentDidMount() {
        await this.backend();
        this.imageLoader(this.state.backendInfo.seasonDrivers);
        this.addDriversToTeams(this.myStuff.topTeams);
        this.addDriversToTeams(this.myStuff.bottomTeams);
        this.sumTeamPoints(this.myStuff.topTeams, this.state.topTeams);
        this.sumTeamPoints(this.myStuff.bottomTeams, this.state.bottomTeams);
        console.log("STATE", this.state);
        console.log("MYSTUFF", this.myStuff);
    }
    // dictionary python a way to look up information.
    
    imageLoader(driverList){
        var imageCount = 0;
        
            
        
        driverList.forEach(driver => {
            const image = new Image();
            image.src = driver.imageUrl;

            image.onload = () => {
                imageCount += 1;
                if(imageCount === this.state.backendInfo.images.length){
                    console.log('images are loaded! Great Job!');
                    this.setState ({imagesLoaded: true})
                }
            }
            driver.image = image;
            // this.loadedImagesAvailableForSelection.push(image);           
        });
        
        // console.log(this.loadedImagesAvailableForSelection);
    }

    async backend(){
        var backendResponse = await fetch('http://localhost:3001/myStuff');
        var backendData = await backendResponse.json();
        // console.log("backdata", backendData);
        // this.setState ({backendInfo: backendData})
        this.state.backendInfo = backendData;
        // console.log("insideAPI",this.state);
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
        const drivers = this.state.backendInfo.seasonDrivers;
        // console.log(team);
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



    render() {
        var driversAsListItems = "";
        var topTeamScores = "";
        var bottomTeamScores = "";

        if(!this.state.teamsFetched){
            console.log("Loading");

            driversAsListItems = "Loading...";
            topTeamScores = "";
            bottomTeamScores = "";

        }
        else{
            console.log('Loading Complete');

            driversAsListItems = this.state.backendInfo.seasonDrivers.map((driver) => {
                var imageSource = driver.imageUrl ? driver.imageUrl : "";
                var driverRacesStats = driver.results.map((result) => {
                    
                    return (
                        <tr>
                        <th>{result.circuit.circuitName}</th>
                        <td>{result.result.grid}</td>
                        <td>{result.result.qualifyingPoints}</td>
                        <td>{result.result.position}</td>
                        <td>{result.result.points}</td>
                        <td>{result.result.weekendPoints}</td>
                        </tr>
                    )
                })

                return (<li key={driver.code}>{driver.code} - {driver.givenName} {driver.familyName} <br/>{driver.permanentNumber} - {driver.construction} <br/> <img src={imageSource} alt="didnt load" />
                 <br/>
                 <table>
                    <thead>
                        <tr>
                        <th>Race</th>
                        <th>Grid Position</th>
                        <th>Grid Points</th>
                        <th>Race Position</th>
                        <th>Race Points</th>
                        <th>Total Weekend Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {driverRacesStats}
                    </tbody>
                    </table>
                 </li>)
                 
            })

            topTeamScores = this.state.topTeams.map((team) => {  
                // var teamName = team.name ? team.name : "";
                return <tr key={team.name}><td>{team.name}</td> <td>{team.teamTotalPoints}</td> </tr>
            })

            bottomTeamScores = this.myStuff.bottomTeams.map((team) => {  
                // var teamName = team.name ? team.name : "";
                return <tr key={team.name}><td>{team.name}</td> <td>{team.teamTotalPoints}</td> </tr>
            })
            
        }


        // console.log("team", this.state.teams.name);



        
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
                <ul>{driversAsListItems}</ul>
            </div>
        );
    }
}

export default Home;
