import React, { Component } from "react";
import { Col, Button } from "reactstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import * as tomoAction from "actions/tomoAction";
import store from "../../store";
import "../App.css";

class QuesArea extends Component {
  // const key = Object.keys(ques).slice(-1)[0];
  // const answer = ques[key].correct;
  constructor(props) {
    super(props);
    this.state = {
      key: Object.keys(props.ques).slice(-1)[0],
      acc: props.acc,
      qes: props.ques
    };
  }

  click(answer) {
    store.dispatch(tomoAction.answer(answer));
  }

  render() {
    let acc = this.state.acc;
    let key = this.state.key;
    let qes = this.state.qes;
    return (
      <Col className="box_color" xs="8">
        <div className="margin_box ">
          <div className="question">
            <Col className="user_account">
              <h5>
                <strong>Your account :</strong> {acc.account}
              </h5>
              <p>
                <strong>Balance :</strong> {this.props.balance}{" "}
                <strong>ETH</strong>
              </p>
            </Col>
            <Col className="question_box">
              <div className="question_position">
                <h1>{qes[key].question}</h1>
              </div>
            </Col>
          </div>
          <Col className="question">
            <div className="answer_position">
              {qes[key].answer.map((item, key) => (
                <Col key={key}>
                  <Button
                    onClick={e => this.click(key)}
                    className="answer_box"
                    outline
                    color="primary"
                  >
                    {item}
                  </Button>
                </Col>
              ))}
            </div>
          </Col>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => {
  return {
    balance: state.tomo.balance,
    account: state.tomo.account
  };
};

export default compose(connect(mapStateToProps))(QuesArea);
