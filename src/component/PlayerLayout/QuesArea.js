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
      time: 10
    };

    this.click = this.click.bind(this);
    this.changeDisabled = this.changeDisabled.bind(this);
    this.countDown = this.countDown.bind(this);
    this.percent = this.percent.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    // so sanh 2 last element cua object props.question
    if (this.props.question[0].question === nextProps.question[0].question) {
      return true;
    } else {
      this.setState({
        disabled: !this.state.disabled,
        time: this.state.time - 0.00000000001
      });
      return false;
    }
  }

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
    if (this.sumValues(this.props.question[0].user_choice) !== 0) {
      return (user_number * 100) / this.sumValues(this.props.question[0].user_choice);
    } else {
      return 0;
    }
  }

  render() {
    let acc = this.props.acc;
    let qes = this.props.question;
    return (
      <Col className='box_color' xs={{ size: 12 }} md={{ size: 8, offset: 0 }}>
        <div className='margin_box'>
          <div className='question'>
            <Col className='user_account'>
              <p>
                <strong>Your account :</strong> {acc.account}
              </p>
              <p>
                <strong>Balance :</strong> {this.props.balance} <strong>TOMO</strong>
              </p>
            </Col>
            <Col className='question_box'>
              <div className='question_position'>
                <span dangerouslySetInnerHTML={{ __html: qes[0].question }} />
              </div>
              <div className='question center'>{this.countDown()}</div>
            </Col>
          </div>
          <Col className='question'>
            <div className='answer_position'>
              {qes[0].answer.map((item, key) => (
                <Col key={key}>
                  <Button
                    onClick={(e) => this.click(key)}
                    className='answer_box'
                    outline
                    color='primary'
                    disabled={this.state.disabled}
                  >
                    <Progress value={this.percent(qes[0].user_choice[key])}>
                      <div className='text_in_button'>{item}</div>
                      <div className='text_in_button user_number'>{qes[0].user_choice[key]}</div>
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
  const question = state.firestore.ordered.current_question;
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
