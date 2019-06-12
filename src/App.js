// Ctrl Shift F
import React, { Component } from "react";
import axios from "axios";
import "./App.scss";
import GameOverPopup from "./components/gameOverPopup";
import YouWonPopup from "./components/youWonPopup";
import Timer from "./components/timer";
import { isRegExp } from "util";

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
      time: 30,
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
  componentWillMount() {
    this.countTime();
    this.getQuestion();
  }
  getQuestion() {
    axios
      .get("http://jservice.io/api/random/?count=" + this.state.winCondition)
      .then(res => {
        //needs to change this to render
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
      time: 30,
      currentRoundPoints: 1,
      answeredQuestions: 0,
      errorMessage: ""
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
    this.setState({ 
      value: event.target.value,
      errorMessage: ""
     });
  }
  handleSubmit(event) {
    console.log(this.state.allQuestions, this.state.round);
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
        .replace(/(<([^>]+)>)/ig,"")
        .toLowerCase()
        .includes(this.state.value.toLowerCase())
    ) {
      console.log("correct", this.state.answeredQuestions);
      this.setState({
        currentRoundPoints: this.state.currentRoundPoints * 2,
        round: this.state.round + 1,
        errorMessage: "",
        answeredQuestions: this.state.answeredQuestions + 1,
        time: 60
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
  render() {
    const currentQuestion = this.state.allQuestions[this.state.round - 1];
    let alert = '';
    if (this.state.errorMessage) {
      alert = 'input-alert';
    }

    // if (currentQuestion) {
    return (
      <div className="App">
        <div className="main-container">
         
          <div className="quiz-container">
            <h1>Quiz*</h1>
            <div className="questions-container">
              <p className="title">Round: </p>
              <p>{this.state.round}</p>

              <p className="title">Points for the current round: </p>
              <p className="current-points">{this.state.currentRoundPoints}</p>

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
            {/* <Question getQuestions={this.getQuestions} /> */}
            <form className="grid-form" onSubmit={this.handleSubmit}>
              <span className="title">Your answer:</span>
              <input
                type="text"
                name="answer"
                className={alert}
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
            correctAnswer={currentQuestion.answer.replace(/(<([^>]+)>)/ig,"")}
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
    );
  }
}

export default App;
