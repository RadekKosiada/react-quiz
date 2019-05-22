// Ctrl Shift F
import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import GameOverPopup from "./gameOverPopup";
import YouWonPopup from "./youWonPopup";
import Timer from "./timer";
//React component; glue for react & redux;
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux';

const store = createStore(() => [], {}, applyMiddleware());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allQuestions: [],
      correctAnswer: "",
      category: "",
      questionId: 0,
      question: "",
      questionValue: 0,
      value: "",
      score: 0,
      currentRoundPoints: 1,
      errorMessage: "",
      round: 1,
      showGameOverPopup: false,
      showYouWonPopup: false,
      time: 15,
      winCondition: 5,
      answeredQuestions: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    this.displayYouWonPopup = this.displayYouWonPopup.bind(this);
    this.countTime = this.countTime.bind(this);
  }
  getQuestion() {
    axios
      .get("http://jservice.io/api/random/?count=" + this.state.winCondition)
      .then(res => {
        //needs to change this to render
        console.log(res.data);
        const data = res.data;
        this.setState({
          allQuestions: data
        });
        console.log(this.state.correctAnswer);

        for (let i = 0; i < data.length; i++) {
          console.log(data[i].answer);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  restartGame() {
    console.log("fired");
    this.setState({
      showGameOverPopup: false,
      showYouWonPopup: false,
      round: 1,
      score: 0,
      value: "",
      time: 15,
      currentRoundPoints: 1,
      answeredQuestions: 0
    });
    this.getQuestion();
    this.countTime();
  }
  displayYouWonPopup() {
    this.setState({
      showYouWonPopup: true
    });
    clearInterval(this.interval);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleSubmit(event) {
    const currentQuestion = this.state.allQuestions[this.state.round - 1];
    console.log("A name was submitted: " + this.state.value);
    event.preventDefault();
    //if no answer
    if (!this.state.value) {
      this.setState({
        errorMessage: "*This is a required field"
      });
      //if correct answer
    } else if (
      currentQuestion.answer
        .toLowerCase()
        .includes(this.state.value.toLowerCase())
    ) {
      console.log("correct", this.state.answeredQuestions);
      this.setState({
        currentRoundPoints: this.state.currentRoundPoints * 2,
        round: this.state.round + 1,
        errorMessage: "",
        answeredQuestions: this.state.answeredQuestions + 1,
        time: 15
      });
      if (this.state.score === 0) {
        this.setState({
          score: +1
        });
      } else {
        this.setState({
          score: 2 * this.state.score
        });
      }
      //triggering popup after correctly answering required number of questions
      if (this.state.round === this.state.winCondition) {
        console.log("YOU WON!!!");
        this.displayYouWonPopup();
      }
      this.setState({
        value: ""
      });
      //  resetting all to 0 if wrong answer
    } else {
      this.setState({
        score: 0,
        round: this.state.round,
        showGameOverPopup: true,
        errorMessage: "",
        answeredQuestions: 0
      });
      clearInterval(this.interval);
    }
  }
  countTime() {
    this.interval = setInterval(() => {
      this.setState({
        time: this.state.time - 1
      });
      if (this.state.time === 0) {
        clearInterval(this.interval);
        this.setState({
          showGameOverPopup: true
        });
      }
    }, 1000);
  }
  componentDidMount() {
    this.getQuestion();
    this.countTime();
  }
  render() {
    const currentQuestion = this.state.allQuestions[this.state.round - 1];

    return (

      <Provider store={store}>
        <div className="App">
          <div className="main-container">
            <div className="quiz-container">
              <div className="questions-container">
                <p className="title">Round: </p>
                <p>{this.state.round}</p>

                <p className="title">Points for the current round: </p>
                <p className="current-points">
                  {this.state.currentRoundPoints}
                </p>

                <p className="title">Questions left to win: </p>
                <p>{this.state.winCondition - this.state.answeredQuestions}</p>

                <p className="title">Your score: </p>
                <p>{this.state.score}</p>

                <p className="title">Category: </p>
                {currentQuestion && <p>{currentQuestion.category.title}</p>}

                <p className="title">Question: </p>
                {currentQuestion && <p>{currentQuestion.question}</p>}
              </div>
              <p className="error-message">{this.state.errorMessage}</p>

              <form className="grid-form" onSubmit={this.handleSubmit}>
                Your answer:
                <input
                  type="text"
                  name="answer"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
                <input className="button" type="submit" value="Submit" />
              </form>
            </div>
            <Timer timeApp={this.state.time} />
          </div>

          {this.state.showGameOverPopup && (
            <GameOverPopup
              restartGameApp={this.restartGame}
              valueFromApp={this.state.value}
              correctAnswer={currentQuestion.answer}
              timeApp={this.state.time}
            />
          )}

          {this.state.showYouWonPopup && (
            <YouWonPopup
              restartGameApp={this.restartGame}
              scoreFromApp={this.state.score}
            />
          )}
        </div>
      </Provider>
    );
  }
}

export default App;
