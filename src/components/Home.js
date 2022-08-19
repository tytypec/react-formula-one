import { getAllByDisplayValue, getAllByPlaceholderText } from "@testing-library/react";
import axios from 'axios';
import React from "react";
import 'bulma/css/bulma.min.css';

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
            pageClicks: 0,
            teamsFetched: false,
            imagesLoaded: false,
            driverListCollapsed: true,
            raceListCollapsed: true,
            topTeamDisplayCollapsed: true,
            bottomTeamDisplayCollapsed: true,
            activeTeam: [],
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
        //I dont think this function is needed anymore.
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

    
    handleDriverToggle() {
        console.log("clicked on button");
        this.setState({ driverListCollapsed: !this.state.driverListCollapsed});
    }
    handleRaceToggle() {
        console.log("clicked on button");
        this.setState({ raceListCollapsed: !this.state.raceListCollapsed});
    }
    handleTopDriversToggle(team) {
        // this.setState({activeTeam: team})
        this.state.activeTeam = team;
        if(this.state.activeTeam.length !== 0){
        this.setState({ topTeamDisplayCollapsed: !this.state.topTeamDisplayCollapsed});
        console.log("clicked on button ", this.state.activeTeam);
        }
    }
    handleBottomDriversToggle(team){
        this.state.activeTeam = team;
        if(this.state.activeTeam.length !== 0){
        this.setState({ bottomTeamDisplayCollapsed: !this.state.bottomTeamDisplayCollapsed});
        console.log("clicked on button ", this.state.activeTeam);
        }
    }



    render() {
        var driversAsListItems = "";
        var topTeamScores = "";
        var bottomTeamScores = "";
        var raceBreakDown = "";
        var topTeamsInfo = "";
        var bottomTeamsInfo ="";
        var activeTeamInfo = "";
        var bottomActiveTeamInfo = "";
        var currentTeamInfo ="";
        var currentTeam = "";

        if(!this.state.teamsFetched){
            console.log("Loading");

            driversAsListItems = "Loading...";
            topTeamScores = "";
            bottomTeamScores = "";
            raceBreakDown = "";

        }
        else{
            console.log('Loading Complete');

            if(!this.state.driverListCollapsed){
                driversAsListItems = this.state.backendInfo.seasonDrivers.map((driver) => {
                    var imageSource = driver.imageUrl ? driver.imageUrl : "";
                    var driverRacesStats = driver.results.map((result) => {
                        
                        return (
                            <tr key={result.circuit.circuitName}>
                            <th>{result.circuit.circuitName}</th>
                            <td>{result.result.grid}</td>
                            <td>{result.result.qualifyingPoints}</td>
                            <td>{result.result.position}</td>
                            <td>{result.result.points}</td>
                            <td>{result.result.weekendPoints}</td>
                            </tr>
                        )
                    })

                    return (<li class="box block" key={driver.code}>
                        <div class="columns is-vcentered title is-3">
                            <div class="column has-background-danger-dark">
                                {driver.code} - {driver.givenName} {driver.familyName} <br/>
                                {driver.permanentNumber} - {driver.construction}
                            </div>
                        </div>
                        <div class="columns is-vcentered title is-3">
                            {/* <div class="column "></div> */}
                            <div class="column is-full">
                                <img src={imageSource} alt="didnt load" />
                            <br/>
                            </div>
                        </div>
                        <div className="table-container">
                            <table class="table is-narrow is-bordered is-striped is-hoverable">
                                <thead>
                                    <tr>
                                    <th><abbr title="Race">Race</abbr></th>
                                    <th><abbr title="Grid Position">GPos</abbr></th>
                                    <th><abbr title="Grid Points">GPts</abbr></th>
                                    <th><abbr title="Race Position">RPos</abbr></th>
                                    <th><abbr title="Race Points">RPts</abbr></th>
                                    <th><abbr title="Total Weekend Points">TWP</abbr></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {driverRacesStats}
                                    <tr>
                                        <th rowSpan={2}>total points</th>
                                        <td colSpan={1}>{driver.seasonPoints}</td>
                                        <td class="has-background-grey-lighter"colSpan={4}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </li>)
                    
                })
            }

            

            topTeamScores = this.state.topTeams.map((team) => {  
                return( 
                <tr key={team.name}><td>{team.name}</td> <td>{team.teamTotalPoints}</td><td><img src={require("../images/info.png")} onClick={() => {this.handleTopDriversToggle(team)}} alt="loading error" style={{height:"25px", width:"25px"}} /></td> </tr>
                )
                
            })
            
            if(!this.state.topTeamDisplayCollapsed){
                currentTeam = this.state.activeTeam
                currentTeamInfo = currentTeam.teamDriverInfo.map((driver) => {
                    var imageSource = driver.imageUrl ? driver.imageUrl : "";

                    return( 

                    <tr key={driver.code}>
                        <img src={imageSource} alt="didnt load" />
                        <th>{driver.familyName}</th>
                        <th>{driver.construction}</th>
                        <th>{driver.nationality}</th>
                        <th>{driver.seasonPoints}</th>
                    </tr>

                    )
                })

                activeTeamInfo =
                <div className="table-container">
                <table class="table is-bordered is-hoverable">
                <thead class="has-background-danger-dark">
                    <tr>
                    <th>Image</th>
                    <th>Driver</th>
                    <th>Construction</th>
                    <th>Nationality</th>
                    <th>Total Points</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTeamInfo}
                </tbody>
            </table>
            </div>
            }

            topTeamsInfo = <div className="box is-flex-direction-column columns is-vcentered">
            <div className="title">Top Constructors Score</div>
                <table class="table is-bordered is-hoverable">
                    <thead class="has-background-danger-dark">
                        <tr>
                        <th>Team</th>
                        <th>Score</th>
                        <th>Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topTeamScores}
                    </tbody>
                </table>
                <div className="title">{currentTeam.name}</div>
                
                {activeTeamInfo}
            </div> 
            
                        // 
            if(!this.state.bottomTeamDisplayCollapsed){
                currentTeam = this.state.activeTeam
                currentTeamInfo = currentTeam.teamDriverInfo.map((driver) => {
                    var imageSource = driver.imageUrl ? driver.imageUrl : "";

                    return( 

                    <tr key={driver.code}>
                        <img src={imageSource} alt="didnt load" />
                        <th>{driver.familyName}</th>
                        <th>{driver.construction}</th>
                        <th>{driver.nationality}</th>
                        <th>{driver.seasonPoints}</th>
                    </tr>

                    )
                })

                bottomActiveTeamInfo =
                <div className="table-container">
                <table class="table is-bordered is-hoverable">
                <thead class="has-background-danger-dark">
                    <tr>
                    <th>Image</th>
                    <th>Driver</th>
                    <th>Construction</th>
                    <th>Nationality</th>
                    <th>Total Points</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTeamInfo}
                </tbody>
            </table>
            </div>
            }

            bottomTeamScores = this.myStuff.bottomTeams.map((team) => {  
                // var teamName = team.name ? team.name : "";
                return <tr key={team.name}><td>{team.name}</td> <td>{team.teamTotalPoints}</td><td><img src={require("../images/info.png")} onClick={() => {this.handleBottomDriversToggle(team)}} alt="loading error" style={{height:"25px", width:"25px"}} /></td> </tr>
            })

            bottomTeamsInfo = 
            <div className="box is-flex-direction-column columns is-vcentered">
                <div className="title">Bottom Constructors Score</div>
                <table class="table is-bordered is-hoverable">
                <thead class="has-background-danger-dark">
                    <tr>
                    <th>Team</th>
                    <th>Score</th>
                    <th>Info</th>
                    </tr>
                </thead>
                <tbody>
                    {bottomTeamScores}
                </tbody>
                </table>
                <div className="title">{currentTeam.name}</div>
                {bottomActiveTeamInfo}
            </div>


            if(!this.state.raceListCollapsed){
                raceBreakDown = this.state.backendInfo.seasonRaces.map((race) => {
                    var myRace = race.Results.map((result) => {
                        return(
                            <tr key={result.Driver.code}>
                            <th>{result.Driver.code}</th>
                            <td>{result.position}</td>
                            <td>{result.points}</td>
                            <td>{result.grid}</td>
                            <td>{result.qualifyingPoints}</td>
                            <td>{result.weekendPoints}</td>
                            </tr>
                        )
                    })


                    // console.log(race);
                    return(
                    <div className="table-container">   
                        <table class="table is-bordered is-striped is-hoverable">
                                {race.Circuit.circuitName} - {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                                <tr>
                                    <th>Driver Code</th>
                                    <th>Race Place</th>
                                    <th>Race Points</th>
                                    <th>Grid Position</th>
                                    <th>Qualifying Points</th>
                                    <th>Weekend Points</th>
                                </tr>
                                {myRace}
                        </table>
                    </div>
                    )
                })
            }
            
        }


        // console.log("team", this.state.teams.name);



        
        return (
            <div className="container has-background-white-ter is-full has-text-centered">
                
                {topTeamsInfo}

                
                {bottomTeamsInfo}


                
                    <div className="box">
                        <div className="dropdown-trigger">
                            <button className="button" onClick={() => this.handleDriverToggle()}>
                            <span>Show Drivers</span>
                            </button>
                        </div> 
                    <ul>{driversAsListItems}</ul>
                    </div>
                
                <div className="box">
                <div className="dropdown-trigger">
                            <button className="button" onClick={() => this.handleRaceToggle()}>
                            <span>Show Races</span>
                            </button>
                        </div> 
                    {raceBreakDown}
                </div>
            </div>
        );
    }
}

export default Home;
