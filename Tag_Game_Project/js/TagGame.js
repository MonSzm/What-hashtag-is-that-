import React, {Component} from "react";
import ReactDOM from "react-dom";

class App extends Component {
    render() {
        console.log("dziala");
        return <h1>Hello</h1>;
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));