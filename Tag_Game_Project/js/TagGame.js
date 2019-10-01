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
        }
    }

    componentDidMount() {
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
    }

    render() {
        console.log("Picture:", this.state.line, this.revealLetter);
        if (!this.state.isReady) {
            return <h1>Hmm... Give me a second please</h1>
        } else {
            return (
                <>
                    <h2 style={{backgroundColor: "pink"}}>{this.state.tag}</h2>
                    <Letters tag={this.state.tag} line={this.state.line}/>
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
            solve: false
        }
    }

    componentDidMount() {
        document.addEventListener('keyup', (event) => {
            if (event.keyCode >= 65 && event.keyCode < 91 && this.state.solve === false) {
                console.log("Key:", event.key);
                this.setState({letter: event.key});
                this.submitLetter(event);
                // this.solveTheTag(event);
                // this.checkSolution(event);
            }
        });
        document.addEventListener('submit', (event) => {
            // document.removeEventListener('keyup', (event) => {
            //     this.submitLetter(event);
            // });
            this.solveTheTag(event);
            this.checkSolution(event);
        })
    }

    // componentDidUpdate() {
    //     document.addEventListener('submit', (event) => {
    //         this.solveTheTag(event);
    //         this.checkSolution(event);
    //     })
    // }

    // componentDidUpdate() {
    //     console.log("letters update");
    // }

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
        }, 1500);
        console.log(this.state.numberOfLettersToShow);
    };

    provideLetter = event => {
        console.log(event.target.value);
        this.setState({solution: event.target.value});
    };

    solveTheTag = event => {
        this.setState({
            inputIsShown: !this.state.inputIsShown,
            solve: true,
        })
    };

    checkSolution = event => {
        event.preventDefault();
        if (this.state.solution === this.props.tag) {
            this.state.solution = this.props.tag;
            // for (let i = 0; i < this.props.tag.length; i++) {
            //     this.props.tag[i] = this.state.solution[i];
            // }
            alert("ok");
        } else {
            alert("not ok");
        }
        // for (let i = 0; this.state.checkSolution; i++) {
        //     if (this.state.checkSolution.length === this.props.tag.length
        //         && this.state.checkSolution[i] === this.props.tag[i]) {
        //         console.log('Brawo');
        //     }
        // }
    };

    render() {
        return (
            <>
                <h1 className="spaces">{this.state.line}</h1>
                <Points lettersToShow={this.state.numberOfLettersToShow} letter={this.state.letter}
                        points={this.state.points}/>
                <button onClick={this.solveTheTag}>Solve the tag</button>
                <form className={this.state.inputIsShown ? "show" : "hide"}>
                    <label> Provide your solution of this tag
                        <input id="solve" type="text"
                               onChange={this.provideLetter}/>
                    </label>
                    <input type="submit" value="Check my solution" onClick={this.state.checkSolution}/>
                    <input type="submit" value="Hmm... guess letters"/>
                </form>
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