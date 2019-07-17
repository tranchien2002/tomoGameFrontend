import React, { Component } from 'react';
import { Col, Button, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ReactCountdownClock from 'react-countdown-clock';
import * as tomoAction from 'actions/tomoAction';
import store from '../../store';
import { firestoreConnect } from 'react-redux-firebase';

import '../../style/App.css';

class QuesArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      time: 10,
      user_choice: {
        0: 25,
        1: 10,
        2: 6,
        3: 90
      }
    };

    this.click = this.click.bind(this);
    this.changeDisabled = this.changeDisabled.bind(this);
    this.countDown = this.countDown.bind(this);
    this.percent = this.percent.bind(this);
  }

  click(answer) {
    store.dispatch(tomoAction.answer(answer));
  }

  shouldComponentUpdate(nextProps) {
    // so sanh 2 last element cua object props.question
    if (
      this.props.question[Object.keys(this.props.question).slice(-1)[0]] ===
      nextProps.question[Object.keys(this.props.question).slice(-1)[0]]
    ) {
      return true;
    } else {
      this.setState({
        disabled: !this.state.disabled,
        time: this.state.time - 0.00000000001
      });
      return false;
    }
  }

  changeDisabled() {
    this.setState({ disabled: !this.state.disabled });
  }

  countDown() {
    // this.changeDisabled();
    return (
      <ReactCountdownClock
        seconds={this.state.time}
        color='#3c65a7'
        alpha={0.9}
        size={120}
        onComplete={(e) => this.changeDisabled()}
      />
    );
  }

  // Total calculation function
  sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b);

  percent(user_number) {
    if (this.sumValues(this.state.user_choice) !== 0) {
      return (user_number * 100) / this.sumValues(this.state.user_choice);
    } else {
      return 0;
    }
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
              <div className='question_position'>
                <h1 dangerouslySetInnerHTML={{ __html: qes[key].question }} />
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
                    <Progress value={this.percent(this.state.user_choice[key])}>
                      <div className='text_in_button'>{item}</div>
                      <div className='text_in_button user_number'>
                        {this.state.user_choice[key]}
                      </div>
                    </Progress>
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
  const question = state.firestore.data.current_question;
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
      collection: 'current_question'
    }
  ])
)(QuesArea);
