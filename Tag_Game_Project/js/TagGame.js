import React, {Component} from "react";
import ReactDOM from "react-dom";

class Picture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: false,
            // totalItems: null,
            tag: ""
        }
    }

    componentDidMount() {
        const randomPage = Math.floor(Math.random() * (500 / 20)) + 1;
        const link = `https://pixabay.com/api/?key=12966633-fd9ff535ce9bc796fb4579b12&image_type=photo&lang=pl&page=` + randomPage;
        console.log(link);
        const randomNumber = Math.floor(Math.random() * 20);
        console.log(randomNumber);
        fetch(link)
            .then(response => response.json())
            .then(data => this.setState({
                // totalItems: data.total,
                image: data.hits[randomNumber].webformatURL,
                tag: data.hits[randomNumber].tags
            })).catch(error => {
            console.log(error)
        });
    }

    render() {
        // const numberOfPages = Math.floor(this.state.totalItems / 20);
        // const randomPage = Math.floor(Math.random() * (500 / 20)) + 1;
        // console.log(randomPage);
        // const link = `https://pixabay.com/api/?key=12966633-fd9ff535ce9bc796fb4579b12&image_type=photo&lang=pl` + `&page=` + randomPage;
        // console.log(link);
        const tags = this.state.tag;
        console.log(tags);
        const arrayWithTags = tags.split(/\s*,\s*/);
        console.log(arrayWithTags);
        const sort = arrayWithTags.sort((a, b) => {
            return a.length - b.length
        });
        console.log(sort);
        const numberOfItemsInArray = arrayWithTags.length;
        console.log(numberOfItemsInArray);
        const theLongestTag = arrayWithTags[numberOfItemsInArray - 1];
        console.log(theLongestTag);
        if (!this.state.image) {
            return <h1>Hmm... Give me a second please</h1>
        }
        return (
            <>
                <p>{theLongestTag}</p>
                <img src={this.state.image} alt="Oh... You should see the picture here. Something went wrong..."/>
            </>
        )
    }
}

class App extends Component {
    render() {
        console.log("dziala");
        return <Picture/>;
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));