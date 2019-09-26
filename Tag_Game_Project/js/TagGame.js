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
            isReady: false,
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
                    <Letters tag={this.state.tag} lines={this.state.lines}/>
                    <h1>{this.state.lines}</h1>
                    <img src={this.state.image}
                         alt="Oh... You should see the picture here. Something went wrong..."/>
                </>
            )
        }
    }
}

class Letters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            letter: "",
            infoMessage: "",
            foundLetters: ""
        }
    }

    provideLetter = event => {
        this.setState({letter: event.target.value});
    };

    submitLetter = event => {
        event.preventDefault();
        console.log('The letter "' + this.state.letter + '" has been provided');
        let letterWasFound = false;
        let arrayWithLinesToShow = [];
        for (let i = 0; i < this.props.tag.length; i++) {
            if (this.props.tag[i] === this.state.letter) {
                letterWasFound = true;
                arrayWithLinesToShow.push(i);
                console.log("Great! This tag concerns letter " + this.state.letter);
                this.setState({
                    infoMessage: "Great! This tag concerns this letter",
                    letter: ""
                });
            }
            console.log(arrayWithLinesToShow);
        }
        if (letterWasFound) {
            for (let j = 0; j < arrayWithLinesToShow.length; j++) {
                this.props.lines[j] = this.state.letter;
            }
            this.setState({
                foundLetters: linesToChange
            })
        } else {
            this.setState({
                infoMessage: "Ups! Something went wrong. Try again!",
                letter: ""
            });
        }
    };

    render() {
        return (
            <>
                <form onSubmit={this.submitLetter}>
                    <h3>{this.state.infoMessage}</h3>
                    <label>
                        Write only one single letter:
                        <input type="text" letter="letter" maxLength="1" pattern="[A-Za-z]" value={this.state.letter}
                               onChange={this.provideLetter}/>
                    </label>
                    <input type="submit" value="Check my letter"/>
                </form>
                <Points letters={this.state.foundLetters}/>
            </>
        )
    }
}

class Points extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: 0
        }
    }

    addPoint = event => {
        event.preventDefault();
        let sumOfPoints = 0;
        if (this.props.foundLetters > 0) {
            sumOfPoints = sumOfPoints + (this.props.foundLetters.length + 1);
        } else {
            sumOfPoints = sumOfPoints - 1;
            if (sumOfPoints < 0) {
                sumOfPoints = 0;
            }
        }
    };

    render() {
        return (
            <>
                <h4>Your points:</h4>
                <p>{this.state.points}</p>
            </>
        )
    }
}

class Puzzle extends Component {
    render() {
        return
    }
}

class App
    extends Component {
    render() {
        console.log("dziala");
        return (
            <>
                <Picture/>
            </>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));