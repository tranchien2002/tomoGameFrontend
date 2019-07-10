import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import QuesArea from "./QuesArea";
import RankArea from "./RankArea";
import store from "store";
import * as tomoAction from "actions/tomoAction";

import "../App.css";

class PlayerLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      balance: ""
    };
  }

  async componentDidMount() {
    this.interval = setInterval(() => {
      // console.log(this.props.tomo);
      if (this.props.tomo.account) {
        store.dispatch(tomoAction.fetchWinCount());
        store.dispatch(tomoAction.getBalance());
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { rank } = this.props;
    const { question } = this.props;
    const { wincount } = this.props;
    console.log("player", this.props);
    if (question != null) {
      return (
        <div>
          <Container>
            <Row className="set_height">
              <QuesArea ques={question} acc={this.props.tomo} />
              <RankArea rank={rank} wincount={wincount} />
            </Row>
          </Container>
        </div>
      );
    } else {
      return (
        <div>
          <Container>
            <Row className="set_height">
              <Col className="box_color" xs="8">
                <div className="margin_box ">
                  <h1> Waiting ...</h1>
                </div>
              </Col>
              <RankArea rank={rank} />
            </Row>
          </Container>
        </div>
      );
    }
  }
}

const mapStatetoProps = state => {
  const question = state.firestore.data.player_question;
  // console.log(state.tomo)
  return {
    question: question,
    rank: state.rank.ranking,
    wincount: state.tomo.winCount,
    tomo: state.tomo
  };
};

export default compose(
  connect(mapStatetoProps),
  firestoreConnect([
    {
      collection: "player_question"
    }
  ])
)(PlayerLayout);
