import React, {Component} from "react";
import ReactDOM from "react-dom";

class Picture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: false
        }
    }

    componentDidMount() {
        fetch(`https://pixabay.com/api/?key=12966633-fd9ff535ce9bc796fb4579b12&q=people&image_type=photo&lang=${this.props.language}`)
            .then(response => response.json())
            .then(data => this.setState({
                image: data.hits[Math.floor(Math.random() * 20)].webformatURL
            })).catch(error => {
            console.log(error)
        });
    }

    render() {
        if (!this.state.image) {
            return <h1>Hmm... Give me a second please</h1>
        }
        return <img src={this.state.image} alt="Oh... You should see the picture here. Something went wrong..."/>
    }
}

class App extends Component {
    render() {
        console.log("dziala");
        return <Picture language='pl'/>;
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));