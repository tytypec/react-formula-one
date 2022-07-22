import React from "react";

class Header extends React.Component{
    render() {
        return(
            <div className="topBar">
                    {/* <a className="active" href="/">Home</a> */}
                    <a href="/">Home</a>
                    <a href="/Season">Season</a>
                    <a href="/Teams">Teams</a>

            </div>
        );

    }
}

export default Header;