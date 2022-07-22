import React from "react";

class Header extends React.Component{
    render() {
        return(
            <div className="topBar">
                    {/* <a className="active" href="/">Home</a> */}
                    <a href="/">Home</a>
                    <a href="/Customs">Customs</a>
                    <a href="/interchange">Interchange</a>
                    <a href="/lighthouse">Lighthouse</a>
                    <a href="/reserve">Reserve</a>
                    <a href="/shoreline">Shoreline</a>
                    <a href="/woods">Woods</a>
                    <a href="https://www.tyler-pecora.com/">Back to Portfolio</a>
            </div>
        );

    }
}

export default Header;