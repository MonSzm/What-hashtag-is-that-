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
                        result = result + "\u00a0";
                    } else {
                        result = result + "_";
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

    revealLetter = (letter) => {
        let allLinesToShow = "";
        for (let i = 0; i < this.state.tag.length; i++) {
            if (this.state.tag[i] === letter) {
                allLinesToShow = allLinesToShow + letter;
            } else {
                allLinesToShow = allLinesToShow + this.state.lines[i];
            }
        }
        setTimeout(() => {
            this.setState({
                lines: allLinesToShow
            })

        }, 2500)
    };

    render() {
        let tagWithSpace = "";
        for (let i = 0; i < this.state.lines.length; i++) {
            tagWithSpace = tagWithSpace + this.state.lines[i] + " ";
        }
        if (!this.state.isReady) {
            return <h1>Hmm... Give me a second please</h1>
        } else {
            return (
                <>
                    <Letters tag={this.state.tag} lines={this.state.lines} revealLetter={this.revealLetter}/>
                    <h1>{tagWithSpace}</h1>
                    <img src={this.state.image}
                         alt="Oh... You should see the picture here. Something went wrong..."/>
                </>
            )
        }
    }
}

class Letters
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            letter: "",
            infoMessage: "",
            divIsShown: false
        }
    }

    provideLetter = event => {
        this.setState({letter: event.target.value});
    };

    componentDidMount() {
        document.addEventListener('keyup', (event) => {
            //console.log(event.keyCode,event.key);
            if (event.keyCode >= 65 && event.keyCode < 91) {
                console.log(event.key);
                this.setState({letter: event.key});
                this.submitLetter(event)
            }
        });
    }

    submitLetter = event => {
        event.preventDefault();
        console.log('The letter "' + this.state.letter + '" has been provided');
        let letterWasFound = false;
        let arrayWithLinesToShow = [];
        for (let i = 0; i < this.props.tag.length; i++) {
            if (this.props.tag[i] === this.state.letter) {
                letterWasFound = true;
                arrayWithLinesToShow.push(i);
                console.log(arrayWithLinesToShow);
                console.log("Great! This tag concerns letter " + this.state.letter);
                this.setState({
                    infoMessage: "Great! You are right!",
                    divIsShown: true
                })
            }
        }
        console.log(arrayWithLinesToShow);
        if (letterWasFound) {
            this.props.revealLetter(this.state.letter);
        } else {
            this.setState({
                infoMessage: "Ups! Try again!",
                divIsShown: true
            })
        }
        setTimeout(() => {
            this.setState({
                divIsShown: false
            })
        }, 1500)
    };

    render() {
        return (
            <>
                <Points letters={this.state.foundLetters}/>
                <div id="message" className={this.state.divIsShown ? "show" : "hide"}>
                    <p>{this.state.infoMessage}</p>
                    <h1>{this.state.letter}</h1>
                </div>
                <div>Letter provided: {this.state.letter}</div>
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