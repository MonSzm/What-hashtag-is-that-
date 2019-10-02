import React, {Component} from "react";
import ReactDOM from "react-dom";

class Picture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            // totalItems: null,
            tag: "",
            line: "",
            isReady: false,
        };
        this.refreshGame = this.refreshGame.bind(this);
    }

    componentDidMount() {
        this.refreshGame();
    }

    refreshGame = () => {
        const randomPage = Math.floor(Math.random() * (500 / 20)) + 1;
        const link = `https://pixabay.com/api/?key=12966633-fd9ff535ce9bc796fb4579b12&image_type=photo&lang=pl&page=` + randomPage;
        const randomNumber = Math.floor(Math.random() * 20);
        console.log(randomNumber);
        fetch(link)
            .then(response => response.json())
            .then(data => {
                const tags = data.hits[randomNumber].tags;
                console.log("Tags:", tags);
                const arrayWithTags = tags.split(/\s*,\s*/);
                const sort = arrayWithTags.sort((a, b) => a.length - b.length);
                console.log("Sorted:", sort);
                const theLongestTag = arrayWithTags[arrayWithTags.length - 1];
                console.log("Longest:", theLongestTag);
                let line = "";
                for (let i = 0; i < theLongestTag.length; i++) {
                    line += theLongestTag[i] === " " ? "\u00a0" : "_";
                }
                this.setState({
                    line: line,
                    tag: theLongestTag,
                    image: data.hits[randomNumber].webformatURL,
                    isReady: true
                })
            }).catch(error => {
            console.log(error)
        });
    };

    render() {
        console.log("Picture:", this.state.line);
        if (!this.state.isReady) {
            return <h1>Hmm... Give me a second please</h1>
        } else {
            return (
                <>
                    <h2 style={{backgroundColor: "pink"}}>{this.state.tag}</h2>
                    <Letters tag={this.state.tag} line={this.state.line} refreshGame={this.refreshGame}
                             image={this.state.image} isReady={this.state.isReady}/>
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
            line: this.props.line,
            letter: "",
            infoMessage: "",
            divIsShown: false,
            numberOfLettersToShow: [],
            points: 0,
            inputIsShown: false,
            solution: "",
            solve: false,
            infoAboutSolution: "",
            h1IsShown: false,
            buttonIsShown: true,
            continueIsShown: false
        }
    }

    componentDidMount() {
        const buttonGuess = document.getElementById('guess');
        const solution = document.getElementById('solution');
        const refresh = document.getElementById('refresh');
        document.addEventListener('keyup', (event) => {
            if (event.keyCode >= 65 && event.keyCode < 91 && this.state.solve === false) {
                console.log("Key:", event.key);
                this.setState({letter: event.key});
                this.submitLetter(event);
            }
        });
        solution.addEventListener('click', (event) => {
            this.solveTheTag(event);
            this.checkSolution(event);
        });
        buttonGuess.addEventListener('click', (event) => {
            this.guessLetters(event);
        });
        refresh.addEventListener('click', (event) => {
            this.refreshStates(event);
        });
    }

    submitLetter = event => {
        console.log("Letters props: ", this.props);
        event.preventDefault();
        console.log('The letter "' + this.state.letter + '" has been provided');
        //let letterWasFound = false;
        let arrayWithLinesToShow = [];
        console.log(this.props.tag.length);
        for (let i = 0; i < this.props.tag.length; i++) {
            if (this.props.tag[i] === this.state.letter) {
                //letterWasFound = true;
                arrayWithLinesToShow.push(i);
                console.log("Great! This tag concerns letter " + this.state.letter);
            }
        }
        console.log(arrayWithLinesToShow);
        if (arrayWithLinesToShow.length > 0) {
            this.setState({
                infoMessage: "Great! You are right!",
                divIsShown: true,
                numberOfLettersToShow: arrayWithLinesToShow,
                points: this.state.points + arrayWithLinesToShow.length
            })
        } else {
            this.setState({
                infoMessage: "Ups! Try again!",
                divIsShown: true,
                points: this.state.points > 0 ? this.state.points - 1 : this.state.points
            })
        }
        setTimeout(() => {
            let allLinesToShow = "";
            console.log("submit letter:", this.props.tag, this.state.letter);
            for (let i = 0; i < this.props.tag.length; i++) {
                allLinesToShow += this.props.tag[i] === this.state.letter ? this.state.letter : this.state.line[i];
            }
            this.setState({
                line: allLinesToShow,
                divIsShown: false
            })
        }, 1000);
        console.log(this.state.numberOfLettersToShow);
    };

    provideLetter = event => {
        console.log(event.target.value);
        this.setState({solution: event.target.value});
    };

    solveTheTag = event => {
        this.setState({
            inputIsShown: !this.state.inputIsShown,
            buttonIsShown: false,
            solve: true
        })
    };

    checkSolution = event => {
        event.preventDefault();
        if (this.state.solution === this.props.tag) {
            this.setState({
                line: this.state.solution,
                h1IsShown: true,
                infoAboutSolution: "You are right!!! The tag is correct!",
                solve: false,
                inputIsShown: false,
                buttonIsShown: false,
                continueIsShown: true
            });
        } else {
            this.setState({
                h1IsShown: true,
                infoAboutSolution: "You are wrong!!!",
                solve: false,
                inputIsShown: false,
                buttonIsShown: false,
                continueIsShown: true
            });
        }
    };

    guessLetters = event => {
        console.log('guessLetters', event);
        event.preventDefault();
        this.setState({
            solve: false,
            inputIsShown: false,
            infoAboutSolution: "",
            buttonIsShown: true
        })
    };

    refreshStates = event => {
        event.preventDefault();
        this.setState({
            infoAboutSolution: "",
            buttonIsShown: true,
            continueIsShown: false,
            line: this.props.line,
            image: this.state.image,
            tag: this.state.tag,
            isReady: this.state.isReady
        })
    };

    stopGame = event => {
        event.preventDefault();

    };

    render() {
        return (
            <>
                <h1 className="spaces">{this.state.line}</h1>
                <Points lettersToShow={this.state.numberOfLettersToShow} letter={this.state.letter}
                        points={this.state.points}/>
                <button className={this.state.buttonIsShown ? "show" : "hide"} onClick={this.solveTheTag}>Solve the tag
                </button>
                <div className={this.state.h1IsShown ? "show" : "hide"}>
                    <h1>{this.state.infoAboutSolution}</h1>
                </div>
                <form className={this.state.inputIsShown ? "show" : "hide"}>
                    <label> Provide your solution of this tag
                        <input id="solve" type="text" minLength="2" onChange={this.provideLetter}/>
                    </label>
                    <input id="solution" type="submit" value="Check my solution" onClick={this.state.checkSolution}/>
                    <button id="guess" onClick={this.state.guessLetters}>Guess letters</button>
                </form>
                <button id="refresh" className={this.state.continueIsShown ? "show" : "hide"}
                        onClick={() => {
                            this.props.refreshGame();
                            this.refreshStates(event);
                        }}>Continue the game
                </button>
                <button className={this.state.continueIsShown ? "show" : "hide"} onClick={this.stopGame}>Stop
                    the game
                </button>
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
        console.log("Points constructor");
        super(props);
        this.state = {
            points: 0
        }
    }

    render() {
        return (
            <>
                <h4>Your points: {this.props.points}</h4>
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