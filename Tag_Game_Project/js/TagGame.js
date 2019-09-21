import React, {Component} from "react";
import ReactDOM from "react-dom";

class Picture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            // totalItems: null,
            tag: "",
            lines: "",
            isReady: false
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
            .then(data => {
                const tags = data.hits[randomNumber].tags;
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

                let result = "";
                for (let i = 0; i < theLongestTag.length; i++) {
                    if (theLongestTag[i] === " ") {
                        result = result + "\u00a0\u00a0"
                    } else {
                        result = result + "_ ";
                    }
                }
                console.log(result);
                this.setState({
                    // totalItems: data.total,
                    lines: result,
                    tag: theLongestTag,
                    image: data.hits[randomNumber].webformatURL,
                    isReady: true
                })
            }).catch(error => {
            console.log(error)
        });
    }

    render() {
        if (!this.state.isReady) {
            return <h1>Hmm... Give me a second please</h1>
        } else {
            return (
                <>
                    <h1>{this.state.lines}</h1>
                    <img src={this.state.image}
                         alt="Oh... You should see the picture here. Something went wrong..."/>
                </>
            )
        }
    }
}

class App
    extends Component {
    render() {
        console.log("dziala");
        return <Picture/>;
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));