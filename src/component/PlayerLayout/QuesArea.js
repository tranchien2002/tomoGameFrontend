import React, { Component } from 'react';
import { Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ReactCountdownClock from 'react-countdown-clock';
import * as tomoAction from 'actions/tomoAction';
import store from '../../store';
import { firestoreConnect } from 'react-redux-firebase';
import '../App.css';

class QuesArea extends Component {
  // constructor(props) {
  //   super(props);
  // }

  click(answer) {
    store.dispatch(tomoAction.answer(answer));
  }

  changeDisabled() {
    this.setState({ disabled: !this.state.disabled });
  }

  countDown() {
    // this.changeDisabled();
    return (
      <ReactCountdownClock
        seconds={10}
        color='#2e2d55'
        alpha={0.9}
        size={120}
        onComplete={(e) => this.changeDisabled()}
      />
    );
  }

  render() {
    let acc = this.props.acc;
    let key = Object.keys(this.props.question).slice(-1)[0];
    let qes = this.props.question;
    return (
      <Col className='box_color' xs='8'>
        <div className='margin_box '>
          <div className='question'>
            <Col className='user_account'>
              <h5>
                <strong>Your account :</strong> {acc.account}
              </h5>
              <p>
                <strong>Balance :</strong> {this.props.balance} <strong>ETH</strong>
              </p>
            </Col>
            <Col className='question_box'>
              <div className='question'>
                <h3>{qes[key].question}</h3>
              </div>
              <div className='question center'>{this.countDown()}</div>
            </Col>
          </div>
          <Col className='question'>
            <div className='answer_position'>
              {qes[key].answer.map((item, key) => (
                <Col key={key}>
                  <Button
                    onClick={(e) => this.click(key)}
                    className='answer_box'
                    outline
                    color='primary'
                    disabled={this.state.disabled}
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

const mapStatetoProps = (state) => {
  const question = state.firestore.data.player_question;
  return {
    question: question,
    balance: state.tomo.balance,
    account: state.tomo.account
  };
};

export default compose(
  connect(mapStatetoProps),
  firestoreConnect([
    {
      collection: 'player_question'
    }
  ])
)(QuesArea);
