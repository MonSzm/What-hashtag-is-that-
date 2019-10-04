import React, {Component} from "react";
import ReactDOM from "react-dom";

class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGameStarted: false
        }
    }

    startGame = event => {
        event.preventDefault();
        this.setState({
            isGameStarted: true
        })
    };

    render() {
        return (
            <>
                <div className={this.state.isGameStarted ? "hide" : "show"}>
                    <h1>What hashtag is that?</h1>
                    <p>As the name suggests this game is about hashtags. Try to guess the hashtag based on the picture.
                        Provide letters and see if you are right.</p>
                    <ul>The main rules:
                        <li>Only three lifes to guess the hashtag</li>
                        <li>Yes for Polish signs</li>
                        <li>Be ahead and provide to input whole hashtag. But there is risk, there is fun!
                            Good answer -> collect extra points
                            Wrong answer -> loose extra points
                        </li>
                        <li>Use keyboard to provide letters</li>
                    </ul>
                    <div>Scoring rules
                        <ul>Provide letters one by one:
                            <li>Really good: one point for every correct letter</li>
                            <li>Almost good: one negative point for wrong letter</li>
                        </ul>
                        <ul>Provide whole hashtag:
                            <li>Really good: double point for all hidden letters</li>
                            <li>Almost good: double negative point for all hidden letters</li>
                        </ul>
                    </div>
                    <p>Remember... you will not cheat the system</p>
                    <p>GOOD LUCK!</p>
                    <button onClick={this.startGame}>Start the game
                    </button>
                </div>
                <div className={this.state.isGameStarted ? "show" : "hide"}>
                    <Picture/>
                </div>
            </>
        )
    }
}

class Picture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            tag: "",
            line: "",
            isReady: false,
            isGameActive: true
        };
        this.refreshGame = this.refreshGame.bind(this);
        this.stopGame = this.stopGame.bind(this);
    }

    stopGame = () => {
        this.setState({
            isGameActive: false
        })
    };

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
                console.log('lines:', line);
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
                <div className={this.state.isGameActive ? "show" : "hide"}>
                    <h2 style={{backgroundColor: "pink"}}>{this.state.tag}</h2>
                    <Letters onClick={this.stopGame} tag={this.state.tag} line={this.state.line}
                             refreshGame={this.refreshGame} image={this.state.image}
                             isReady={this.state.isReady} game={this.state.isGameActive}/>
                    <img src={this.state.image}
                         alt="Oh... You should see the picture here. Something went wrong..."/>
                </div>
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
            continueIsShown: false,
            stop: false,
            totalLettersToShow: 0,
            clickedLetters: ""
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
        let arrayWithLinesToShow = [];
        for (let i = 0; i < this.props.tag.length; i++) {
            if (this.props.tag[i] === this.state.letter) {
                arrayWithLinesToShow.push(i);
                console.log("Great! This tag concerns letter " + this.state.letter);
            }
        }
        this.setState({
            clickedLetters: this.state.clickedLetters + this.state.letter
        });
        console.log('Provided letters: ', this.state.clickedLetters);
        console.log('check letter: ', this.state.clickedLetters.indexOf(this.state.letter));
        this.setState({
            totalLettersToShow: this.state.totalLettersToShow + arrayWithLinesToShow.length
        });
        console.log(arrayWithLinesToShow);
        console.log('Total letters to show:', this.state.totalLettersToShow);
        if (arrayWithLinesToShow.length > 0 && this.state.clickedLetters.indexOf(this.state.letter) === -1) {
            this.setState({
                infoMessage: "Great! You are right!",
                divIsShown: true,
                numberOfLettersToShow: arrayWithLinesToShow,
                points: this.state.points + arrayWithLinesToShow.length
            })
        } else if (arrayWithLinesToShow.length === 0) {
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
        let counter = 0;
        for (let i = 0; i < this.props.tag.length; i++) {
            if (this.props.tag[i] === " ") {
                counter++;
            }
        }
        if (this.state.solution === this.props.tag) {
            this.setState({
                line: this.props.tag,
                h1IsShown: true,
                infoAboutSolution: "Jeah! You are right! The hashtag is correct! +" + ((this.props.tag.length - this.state.totalLettersToShow - counter) * 2) + " point(s)",
                solve: false,
                inputIsShown: false,
                buttonIsShown: false,
                continueIsShown: true,
                points: this.state.points + ((this.props.tag.length - this.state.totalLettersToShow - counter) * 2)
            });
        } else {
            let negativePoints = (this.props.tag.length - this.state.totalLettersToShow - counter) * 2;
            if ((this.state.points - negativePoints) < 0) {
                this.setState({
                    infoAboutSolution: "Ups... You are wrong! The correct hashtag: " + this.props.tag.toUpperCase() + " You lost all points"
                })
            } else {
                this.setState({
                    infoAboutSolution: "Ups... You are wrong! The correct hashtag: " + this.props.tag.toUpperCase() + "-" + negativePoints + "point(s)",
                });
            }
            this.setState({
                h1IsShown: true,
                line: this.props.tag,
                solve: false,
                inputIsShown: false,
                buttonIsShown: false,
                continueIsShown: true,
                points: (this.state.points - (negativePoints) > 0 ? (this.state.points - (negativePoints)) : 0)
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
            // image: this.state.image,
            // tag: this.state.tag,
            // isReady: this.state.isReady
        })
    };

    // stopGame = event => {
    //     event.preventDefault();
    //     this.setState({
    //         stop: true,
    //         game: false
    //     });
    // };

    render() {
        console.log(this.props);
        const {onClick} = this.props;
        return (
            <>
                <h1 className="spaces">{this.state.line}</h1>
                <h4>Your points: {this.state.points}</h4>
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
                            // this.refreshStates(event);
                        }}>Continue the game
                </button>
                <button className={this.state.continueIsShown ? "show" : "hide"}
                        onClick={onClick}>Stop the game
                </button>
                {this.state.stop && <Stop/>}
                <div id="message" className={this.state.divIsShown ? "show" : "hide"}>
                    <p>{this.state.infoMessage}</p>
                    <h1>{this.state.letter}</h1>
                </div>
                <div>Letter provided: {this.state.letter}</div>
            </>
        )
    }
}

class Stop extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    render() {
        return (
            <>
                <p>Hope that it was nice time for you and you like this hashtag game.</p>
                <p>Your points: {this.props.points}</p>
                <p>See you!!!</p>
            </>
        )
    }
}

class App
    extends Component {
    render() {
        return (
            <>
                <WelcomePage/>
            </>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));