import { getAllByDisplayValue, getAllByPlaceholderText } from "@testing-library/react";
import axios from 'axios';
import React from "react";
import 'bulma/css/bulma.min.css';
import '../index.css'
// const API_URL = process.env.REACT_APP_DOMAIN_URL ? process.env.REACT_APP_DOMAIN_URL : "http://127.0.0.1:3001"
const API_URL = "http://localhost:3001"

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
            burgerMenuCollapsed: false,
            carGifGo: false,
            pageInfoCollapsed: true,
            activeTopTeam: [],
            activeBottomTeam: [],
        }
    }

    async componentDidMount() {
        await this.backend();
        this.imageLoader(this.state.backendInfo.seasonDrivers);
        this.addDriversToTeams(this.myStuff.topTeams);
        this.addDriversToTeams(this.myStuff.bottomTeams);
        this.sumTeamPoints(this.myStuff.topTeams, this.state.topTeams);
        this.sumTeamPoints(this.myStuff.bottomTeams, this.state.bottomTeams);
        this.navbarJustWork();
        console.log("STATE", this.state);
        console.log("MYSTUFF", this.myStuff);
    }
    // dictionary python a way to look up information.
   

    navbarJustWork(){
        document.addEventListener('DOMContentLoaded', () => {

            // Get all "navbar-burger" elements
            const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
          
            // Add a click event on each of them
            $navbarBurgers.forEach( el => {
              el.addEventListener('click', () => {
          
                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);
          
                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
          
              });
            });
          
          });
    }

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
        // var backendResponse = await fetch('http://localhost:3001/myStuff');
        var fullURL = API_URL + "/myStuff"
        var backendResponse = await fetch(fullURL);
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
        // this.setState({activeTopTeam: team})
        this.state.activeTopTeam = team;
        if(this.state.activeTopTeam.length !== 0){
        this.setState({ topTeamDisplayCollapsed: !this.state.topTeamDisplayCollapsed});
        console.log("clicked on button ", this.state.activeTopTeam);
        }
    }
    handleBottomDriversToggle(team){
        this.state.activeBottomTeam = team;
        if(this.state.activeBottomTeam.length !== 0){
        this.setState({ bottomTeamDisplayCollapsed: !this.state.bottomTeamDisplayCollapsed});
        console.log("clicked on button ", this.state.activeBottomTeam);
        }
    }

    closeDrivers(){
        console.log('you clicked close driver and it worked');
        this.setState({ driverListCollapsed: true});
    }
    closeRaces(){
        console.log('you clicked close race and it worked');
        this.setState({ raceListCollapsed: true});
    }
    mouseEnter(){
        console.log('you are hovering');
        this.setState({ carGifGo: true});    
    }
    mouseLeave(){
        console.log('you are NOT hovering');
        this.setState({ carGifGo: false});    
    }

    carClick(){
        this.setState({ carGifGo: !this.state.carGifGo});
    }
    burgerMenuClick(){
        
        this.setState({burgerMenuCollapsed: !this.state.burgerMenuCollapsed});
        console.log('burger menu click', this.state.burgerMenuCollapsed);
        
    }
    pageInfoToggle(){
        this.setState({ pageInfoCollapsed: false});
        this.setState({burgerMenuCollapsed: false})
        window.scrollTo(0,0)
        console.log("info clicked", this.state.pageInfoCollapsed);
    };

    pageInfoClose(){
        this.setState({pageInfoCollapsed: true})
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
        var pointsKey ="";
        var pageInfo ="";
        var carIcon = <img src={require("../images/car.gif")} onClick={() => this.carClick()} onMouseLeave={() => this.mouseLeave()} width="136" height="50"></img> 
        // delete ! to get info working
        if(this.state.pageInfoCollapsed){
            pageInfo = ""
        }
        else{
            pageInfo = 
            <div class="columns is-centered">
                <div class="column is-6 ">
                    <article class="message is-dark">
                    <div class="message-header">
                    <p>Info</p>
                    <button onClick={() => this.pageInfoClose()} class="delete" aria-label="delete"></button>
                    </div>
                    <div class="message-body">
                    <strong>About</strong>
                    <br></br>
                    <br></br>
                    This is an app for me and some friends to track our fantasy Formula One Season. It pulls its data from the ergast.com motor racing API, has a few tables to help us interpret the data, and adds our scores when race data is updated. We created 2 leagues this season; a top league comprised of the front runner teams (Ferrari, Mercedes, and Red Bull) and a bottom bracket of all other teams. We started late this season on the 10th race, that’s just when we thought to make a league! Let's talk scoring.
                    <br></br>
                    <br></br>
                    <strong>Scoring</strong>
                    <br></br>
                    <br></br>
                        <div class="columns is-mobile">
                            <div class="column is-half">
                                <table class="table is-narrow is-bordered is-striped is-hoverable">
                                    <thead>
                                        <th>place</th>
                                        <th>points</th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>25</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>18</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>15</td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>12</td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>10</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>8</td>
                                        </tr>
                                        <tr>
                                            <td>7</td>
                                            <td>6</td>
                                        </tr>
                                        <tr>
                                            <td>8</td>
                                            <td>4</td>
                                        </tr>
                                        <tr>
                                            <td>9</td>
                                            <td>2</td>
                                        </tr>
                                        <tr>
                                            <td>10</td>
                                            <td>1</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>    
                            <div class="column">
                            This score chart represents possible scores for both <strong>Qualifying</strong> and the <strong>Grand Prix</strong>, there is also one possible extra point for fastest lap during the Grand Prix <strong>only</strong>. The maximum a driver could score in one weekend is 51 points. A realistic example we will look at is Lewis Hamilton’s score from the Silverstone Circuit race weekend. He qualified <strong>5th</strong> resulting in <strong>10 points</strong> on race day he finished <strong>3rd</strong> resulting in <strong>16 points</strong>. That weekend he was awarded a total of <strong>26 points</strong>.
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
        }

        if(this.state.carGifGo){
            carIcon = <img src={require("../images/car.gif")} onClick={() => this.carClick()} onMouseLeave={() => this.mouseLeave()} width="136" height="50"></img>
            console.log('go go go');
             
        }
        else{
            carIcon = <img src={require("../images/car.png")} onClick={() => this.carClick()} onMouseOver={() => this.mouseEnter()} onMouseLeave={() => this.mouseLeave()} width="136" height="50"></img>  
        }

        if(!this.state.teamsFetched){
            console.log("Loading");

            driversAsListItems = "Loading...";
            topTeamScores = "";
            bottomTeamScores = "";
            raceBreakDown = "";

        }
        else{
            console.log('Loading Complete');
            // carIcon = <img src={require("../images/car.png")} onClick={() => this.mouseEnter()} width="136" height="50"></img> 

            if(!this.state.driverListCollapsed){
                pointsKey = 
                <div class="box is-6 is-size-5-desktop">
                    <div className="table-container">
                        <table class="table is-bordered is-striped is-hoverable">
                            <thead>
                                <th>Word</th>
                                <th>Grid Position</th>
                                <th>Grid Points</th>
                                <th>Race Position</th>
                                <th>Race Points</th>
                                <th>Weekend Points</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Abbr</th>
                                    <td>G Po</td>
                                    <td>G Pt</td>
                                    <td>R Po</td>
                                    <td>R Pt</td>
                                    <td>WP</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
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
                        <div class="columns is-centered title is-3">
                            <div class="column is-6 has-background-danger-dark">
                                {driver.code} - {driver.givenName} {driver.familyName} <br/>
                                {driver.permanentNumber} - {driver.construction}
                            </div>
                        </div>
                        <div class="columns is-centered title is-6">
                            {/* <div class="column "></div> */}
                            <div class="column is-full">
                                <img src={imageSource} alt="didnt load" />
                            <br/>
                            </div>
                        </div>
                        <div class="columns is-centered title is-6">
                            <div class="column is-narrow">
                                <div className="table-container">
                                    <table class="table is-narrow is-bordered is-striped is-hoverable">
                                        <thead>
                                            <tr>
                                            <th><abbr title="Race">Race</abbr></th>
                                            <th><abbr title="Grid Position">G Po</abbr></th>
                                            <th><abbr title="Grid Points">G Pt</abbr></th>
                                            <th><abbr title="Race Position">R Po</abbr></th>
                                            <th><abbr title="Race Points">R Pt</abbr></th>
                                            <th><abbr title="Total Weekend Points">WP</abbr></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {driverRacesStats}
                                            <tr>
                                                <th rowSpan={2}>Total Points</th>
                                                <td colSpan={1}>{driver.seasonPoints}</td>
                                                <td class="has-background-grey-lighter"colSpan={4}></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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
                currentTeam = this.state.activeTopTeam
                currentTeamInfo = currentTeam.teamDriverInfo.map((driver) => {
                    var imageSource = driver.imageUrl ? driver.imageUrl : "";

                    return( 
                    <div class="box is-full">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-64x64">
                                <img src={imageSource} alt="didnt load" />
                                </figure>
                                <div class="media">
                                </div>
                            </div>

                            <div class="container is-fluid">
                                <nav class="level is-mobile">
                                    <div class="level-item has-text-centered">     
                                        <div>                                  
                                            <p class="title is-5">{driver.familyName}</p>
                                            <br></br>
                                            <p class="subtitle is-5">{driver.nationality}</p>
                                        </div> 
                                    </div>
                                    <div class="level-item has-text-centered">
                                        <div>
                                            <p class="title is-5">{driver.construction}</p>
                                            <br></br>
                                            <p class="subtitle is-5">{driver.seasonPoints} pts</p>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>    
                    </div>

                    // <tr key={driver.code}>
                    //     <img src={imageSource} alt="didnt load" />
                    //     <td>{driver.familyName}</td>
                    //     <td>{driver.construction}</td>
                    //     <td>{driver.nationality}</td>
                    //     <td>{driver.seasonPoints}</td>
                    // </tr>

                    )
                })
            }

            topTeamsInfo = 
            <div className="box">
                <div class="columns is-centered">
                    <div className="title is-6 column">Top Constructors Score</div>
                </div>
                <div class="columns is-centered">
                    <div className="column is-6">
                        <table class="score-board table is-bordered is-hoverable ">
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
                        <div class="columns is-centered">
                            <div className="title column is-6">{currentTeam.name}</div>
                        </div>
                        <div class="container is-centered">
                            {currentTeamInfo}    
                        </div>
                    </div>
                </div>
            </div> 
            
            // 
            if(!this.state.bottomTeamDisplayCollapsed){
                currentTeam = this.state.activeBottomTeam
                bottomActiveTeamInfo = currentTeam.teamDriverInfo.map((driver) => {
                    var imageSource = driver.imageUrl ? driver.imageUrl : "";

                    return( 

                        <div class="box is-full">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-64x64">
                                <img src={imageSource} alt="didnt load" />
                                </figure>
                                <div class="media">

                                </div>
                            </div>

                            <div class="container is-fluid">
                                <nav class="level is-mobile">
                                    <div class="level-item has-text-centered">     
                                        <div>                                  
                                            <p class="title is-5">{driver.familyName}</p>
                                            <br></br>
                                            <p class="subtitle is-5">{driver.nationality}</p>
                                        </div> 
                                    </div>
                                    <div class="level-item has-text-centered">
                                        <div>
                                            <p class="title is-5">{driver.construction}</p>
                                            <br></br>
                                            <p class="subtitle is-5">{driver.seasonPoints} pts</p>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>    
                    </div>

                    )
                })

            }

            bottomTeamScores = this.myStuff.bottomTeams.map((team) => {  
                // var teamName = team.name ? team.name : "";
                return <tr key={team.name}><td>{team.name}</td> <td>{team.teamTotalPoints}</td><td><img src={require("../images/info.png")} onClick={() => {this.handleBottomDriversToggle(team)}} alt="loading error" style={{height:"25px", width:"25px"}} /></td> </tr>
            })

            bottomTeamsInfo = 
            <div className="box">
                <div class="columns is-centered">
                    <div className="title is-6 column">Bottom Constructors Score</div>
                </div>

                <div class="columns is-centered">
                    <div class="column is-6">
                        <table class="score-board table is-bordered is-hoverable">
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
                    </div>
                </div>
                
                <div class="columns is-centered">
                    <div class="title column is-6">{currentTeam.name}</div>
                </div>
                <div class="columns is-centered">
                    <div class="column is-6">
                      {bottomActiveTeamInfo}
                    </div>
                </div>
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
            <div id="mainContainer" className="container has-background-white-ter has-text-centered">
                <nav class="navbar is-light is-transparent is-fixed-top" role="navigation" aria-label="main navigation">
                    <div class="navbar-brand">
                        <a class="navbar-item">
                        {carIcon}
                        </a>
                        <a class="navbar-item" onClick={() => window.scrollTo(0,0)}>
                        Formula Wow
                        </a>
                        <a role="button" onClick={() => this.burgerMenuClick()} class={`navbar-burger burger  ${this.state.burgerMenuCollapsed ? "is-active" : ""}`} aria-label="menu" aria-expanded="false" data-target="navbarBasic">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>
                    <div id="navbarBasic" class={`navbar-menu ${this.state.burgerMenuCollapsed ? "is-active" : ""}`}>
                        <div class="navbar-start">
                            <a class="navbar-item" onClick={() => this.closeDrivers()}> Close Drivers </a>
                            <a class="navbar-item" onClick={() => this.closeRaces()}> Close Races </a>
                            <a class="navbar-item" onClick={() => {this.pageInfoToggle()}}> Info </a>
                        </div>
                    </div>
                </nav>
                <div id="myBox">

                    {pageInfo}

                    {topTeamsInfo}

                
                    {bottomTeamsInfo}
                

                
                    <div className="box">
                        <div className="dropdown-trigger">
                            <button className="button" onClick={() => this.handleDriverToggle()}>
                            <span>Show Drivers</span>
                            </button>
                        </div>
                        <div className="columns is-centered">
                            <div className="pointsKey column is-6">
                                {pointsKey} 
                            </div>
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
            </div>
        );
    }
}

export default Home;



{/* <div id="outerBox" class="columns is-mobile">
<div id="picture" class="column is-3">
    <img src={imageSource} alt="didnt load" />
</div>
<div id="stats" class="column is-9">
    <div class="columns is-mobile">
        <div class="column is-half">
            <div class="columns is-mobile">
                <div class="column is-12">
                    <p class="title is-5">{driver.familyName}</p>       
                </div>
            </div>
            <div class="columns is-mobile">
                <div class="column is-12">
                    <p class="subtitle is-5">{driver.construction}</p>       
                </div>
            </div>
        </div>
        <div class="column is-half">
            <div class="columns is-mobile">def</div>
            <div class="columns is-mobile">saf</div>
        </div>
    </div>
</div>
</div> */}