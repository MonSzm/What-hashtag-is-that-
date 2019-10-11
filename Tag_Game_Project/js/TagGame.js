import React, {Component} from "react";
import ReactDOM from "react-dom";
import {HashRouter, Route, withRouter} from 'react-router-dom';

class WelcomePage extends Component {
    constructor(props) {
        super(props);
    }

    startGame = event => {
        event.preventDefault();
        this.props.history.push('/game');
    };

    render() {
        return (
            <div>
                <h1 className="welcomePage">What hashtag is that?</h1>
                <div className="rules">
                    <p className="description">As the name suggests this game is about hashtags. Try to guess the
                        hashtag
                        based on the picture.
                        Provide letters and see if you are right.</p>
                    <div><h3>THE MAIN RULES:</h3>
                        <ul>
                            <li>Only <span className="bold">three lifes</span> to guess the hashtag</li>
                            <li>Yes for <span className="bold">Polish signs</span></li>
                            <li>Yes for <span className="bold">Polish declension</span></li>
                            <li>Use input to provide whole hashtag. NO RISK, NO FUN!
                                <ul>
                                    <li><span className="bold">Good answer</span> -> <span
                                        className="bold">collect</span> extra points
                                    </li>
                                    <li><span className="bold">Wrong answer</span> -> <span
                                        className="bold">loose</span> extra points
                                    </li>
                                </ul>
                            </li>
                            <li>Use keyboard to provide letters</li>
                        </ul>
                    </div>
                </div>
                <div className="score">
                    <h3 className="point">SCORING RULES:</h3>
                    <ul className="points">Provide letters <span className="bold">ONE BY ONE</span>:
                        <li><span className="bold">Really good:</span> one point for every correct letter</li>
                        <li><span className="bold">Almost good:</span> one negative point for wrong letter</li>
                    </ul>
                    <ul className="points">Provide <span className="bold">WHOLE HASHTAG (without hashtag icon - it means "#")</span>:
                        <li><span className="bold">Really good:</span> double point for all hidden letters</li>
                        <li><span className="bold">Almost good:</span> double negative point for all hidden letters
                        </li>
                    </ul>
                </div>
                <div className="information">
                    <h2 className="info">Remember... you will not cheat the system.</h2>
                    <h2 className="goodLuck">GOOD LUCK!</h2>
                </div>
                <button className="startGame" onClick={this.startGame}>Start the game
                </button>
            </div>
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
            isGameActive: true,
            isGameStopped: false,
            imgIsReady: false
        };
        this.refreshGame = this.refreshGame.bind(this);
        this.stopGame = this.stopGame.bind(this);
    }

    stopGame = () => {
        this.setState({
            isGameActive: false
        });
        this.props.history.push('/stop');
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
                const lowerCase = theLongestTag.toLowerCase();
                const letters = "abcdefghijklmnopqrstuwvxyząćęłńóśźż ";
                for (let i = 0; i < lowerCase.length; i++) {
                    if (letters.indexOf(lowerCase[i]) >= 0) {
                        line += lowerCase[i] === " " ? " " : "_";
                    }
                }
                console.log('lines:', line);
                this.setState({
                    line: line,
                    tag: lowerCase,
                    image: data.hits[randomNumber].webformatURL,
                    isReady: true,
                    imgIsReady: true
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
                <div id="picture">
                    <div className={this.state.isGameActive ? "show" : "hide"}>
                        <div id="frame">
                            <div id="photo"></div>
                            <p id="nick">Really_nice_IT_girl</p>
                            <p id="profession">Trying to be a good front-end developer</p>
                            <p id="dots">...</p>
                            {(!this.state.imgIsReady) ? <p>Hmm... Give me a second please</p> :
                                <div id="image"><img className="img" src={this.state.image}
                                                     alt="Oh... You should see the picture here. Something went wrong..."/>
                                </div>}
                            <Letters stopGame={this.stopGame} tag={this.state.tag} line={this.state.line}
                                     refreshGame={this.refreshGame} image={this.state.image}
                                     isReady={this.state.isReady} game={this.state.isGameActive}
                                     stop={this.state.isGameStopped}/>
                            <div id="symbols">
                                <img className="symbol" src="../css/red_heart.png" alt="Likes"/>
                                <img className="symbol" src="../css/comment.png" alt="Comment option"/>
                                <img className="symbol" src="../css/share.png" alt="Share option"/>
                                <img className="symbol flag" src="../css/flag.png" alt="Flag"/>
                            </div>
                            <div id="info">
                                <p className="views">13.674 views</p>
                                <p id="name">Really_nice_IT_girl <span id="hashtags"> #whathashtagisthat #tryingtobedeveloper #frontend #JavaScript #React #ITgirl
                                        #womanspower #hardwork #magicweekendswithIT</span></p>
                                <p id="view">View all 131 comments</p>
                                <p id="when">13 DAYS AGO</p>
                            </div>
                        </div>
                    </div>
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
            clickedLetters: "",
            shouldRefresh: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.shouldRefresh === true && props.line !== state.line) {
            return {
                line: props.line,
                shouldRefresh: false,
                totalLettersToShow: 0,
                clickedLetters: ""
            }
        }
        return null;
    }

    componentDidMount() {
        const buttonGuess = document.getElementById('guess');
        const solution = document.getElementById('solution');
        const refresh = document.getElementById('refresh');
        const stop = document.getElementById('stop');
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

        console.log('Provided letters: ', this.state.clickedLetters);
        console.log('Check letter: ', this.state.clickedLetters.indexOf(this.state.letter));
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
        } else if (arrayWithLinesToShow.length === 0 && this.state.clickedLetters.indexOf(this.state.letter) === -1) {
            this.setState({
                infoMessage: "Ups! Try again!",
                divIsShown: true,
                points: this.state.points > 0 ? this.state.points - 1 : this.state.points
            })
        } else if (arrayWithLinesToShow.length > 0 && this.state.clickedLetters.indexOf(this.state.letter) >= 0) {
            this.setState({
                infoMessage: "Really?! Do you not remember? This letter has been already provided!",
                divIsShown: true,
                points: this.state.points
            })
        } else {
            this.setState({
                infoMessage: "Really?! Do you not remember? This letter has been already provided!",
                divIsShown: true,
                points: this.state.points
            })
        }
        setTimeout(() => {
            let allLinesToShow = "";
            for (let i = 0; i < this.props.tag.length; i++) {
                allLinesToShow += this.props.tag[i] === this.state.letter ? this.state.letter : this.state.line[i];
            }
            this.setState({
                line: allLinesToShow,
                divIsShown: false
            })
        }, 1000);
        console.log(this.state.numberOfLettersToShow);

        this.setState({
            clickedLetters: this.state.clickedLetters + this.state.letter
        });
    };

    provideLetter = event => {
        console.log(event.target.value);
        this.setState({solution: event.target.value});
    };

    solveTheTag = () => {
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
                infoAboutSolution: "Yeah! You are right! +" + ((this.props.tag.length - this.state.totalLettersToShow - counter) * 2) + " point(s)",
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
                    infoAboutSolution: "Ups... You are wrong! You have lost all points!"
                })
            } else {
                this.setState({
                    infoAboutSolution: "Ups... You are wrong!" + negativePoints + "point(s)",
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
            shouldRefresh: true
        })
    };

    stopGame = () => {
        this.setState({
            stop: true,
            game: false
        });
    };

    render() {
        return (
            <>
                <div id="lines">
                    <h1 className="tag"><span id="hashtagSymbol">#</span>{this.state.line}</h1>
                    <h4 className="points">YOUR SCORE: <span id="totalPoints">{this.state.points} point(s)</span></h4>
                    <button id="solveTag" className={this.state.buttonIsShown ? "show" : "hide"}
                            onClick={this.solveTheTag}>Solve the tag
                    </button>
                </div>
                <div id="infoAboutSolution" className={this.state.h1IsShown ? "show" : "hide"}>
                    <h2>{this.state.infoAboutSolution}</h2>
                </div>
                <div id="provideSolution">
                    <form className={this.state.inputIsShown ? "show" : "hide"}>
                        <label id="answer"> Provide your solution of this tag:
                            <input id="solve" type="text" minLength="2" onChange={this.provideLetter}/>
                        </label>
                        <div className="checkButtons">
                            <button id="solution" onClick={this.state.checkSolution}>Check my solution</button>
                            <button id="guess" onClick={this.state.guessLetters}>No idea... Still guess letters</button>
                        </div>
                    </form>
                </div>
                <div id="continueOrStop">
                    <button id="refresh" className={this.state.continueIsShown ? "show" : "hide"}
                            onClick={() => {
                                this.props.refreshGame();
                                this.setState({
                                    imgIsReady: false
                                })
                            }}>Continue the game
                    </button>
                    <button id="stop" className={this.state.continueIsShown ? "show" : "hide"}
                            onClick={() => {
                                this.stopGame();
                                this.props.stopGame()
                            }}>Stop the game
                    </button>
                </div>
                <div id="message" className={this.state.divIsShown ? "show" : "hide"}>
                    <p>{this.state.infoMessage}</p>
                    <h1>{this.state.letter}</h1>
                </div>
            </>
        )
    }
}

class Stop
    extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    startAgain = event => {
        event.preventDefault();
        this.props.history.push('/');
    };

    render() {
        return (
            <>
                <p>Hope that it was nice time for you and you like this hashtag game.</p>
                <p>Your points: {this.props.points}</p>
                <p>See you!!!</p>
                <button onClick={this.startAgain}>Start the game again</button>
            </>
        )
    }
}

class App
    extends Component {
    render() {
        return (
            <HashRouter>
                <>
                    <div id="welcome"><Route exact path='/' component={withRouter(WelcomePage)}/></div>
                    <div id="startGame"><Route path='/game' component={withRouter(Picture)}/></div>
                    <div id="finish"><Route path='/stop' component={withRouter(Stop)}/></div>
                </>
            </HashRouter>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));