import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import QuesArea from './QuesArea';
import RankArea from './RankArea';
import store from 'store';
import * as tomoAction from 'actions/tomoAction';

import { Animated } from 'react-animated-css';
import '../../style/Sunfetti.css';
import '../../style/App.css';

class PlayerLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      balance: ''
    };
    this.placeABet = this.placeABet.bind(this);
    this.startPlay = this.startPlay.bind(this);
  }

  async componentDidMount() {
    this.interval = setInterval(() => {
      if (this.props.tomo.account !== null && this.props.tomo.game !== null) {
        store.dispatch(tomoAction.fetchWinCount());
        store.dispatch(tomoAction.getBalance());
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.game !== this.props.game && this.props.tomo.web3) {
      store.dispatch(tomoAction.updateNewGame(this.props.game[0].address));
    }
  }

  placeABet() {
    store.dispatch(tomoAction.sendMoneyToAlias());
  }

  startPlay() {
    store.dispatch(tomoAction.startPlay());
    // instantiateGame
  }

  withdraw() {
    store.dispatch(tomoAction.sendMoneyBack());
  }

  render() {
    const { rank } = this.props;
    const { question, questionCount } = this.props;
    const { wincount } = this.props;
    const { tomo } = this.props;

    return (
      <div>
        <Container>
          {tomo.web3 ? (
            tomo.isPlaying ? (
              question && questionCount < 10 ? (
                <Row className='set_height'>
                  <QuesArea ques={question} acc={this.props.tomo} />
                  <RankArea rank={rank} wincount={wincount} />
                </Row>
              ) : (
                <Row className='set_height'>
                  <Col className='box_color' xs='8'>
                    <div className='margin_box '>
                      <span> Waiting ...</span>
                    </div>
                  </Col>
                  <RankArea rank={rank} />
                </Row>
              )
            ) : (
              <Row className='set_height'>
                <Col className='box_color' xs='12'>
                  <Animated
                    className='set_full_height'
                    animationIn='bounceIn'
                    animationOut='bounceOut'>
                    <div className='margin_box '>
                      {tomo.aliasBalance > 30 ? (
                        <div>
                          <h1>Ban dang co {tomo.aliasBalance} tomo</h1>
                          <Button color='primary' onClick={(e) => this.startPlay()}>
                            Start
                          </Button>
                          <Button color='primary' onClick={(e) => this.withdraw()}>
                            WithDraw
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h1>ban phai dat cuoc 30 tomo de bat dau tro choi</h1>
                          <Button color='primary' onClick={(e) => this.placeABet()}>
                            Betting
                          </Button>
                        </div>
                      )}
                    </div>
                  </Animated>
                </Col>
              </Row>
            )
          ) : (
            <Row className='set_height'>
              <Col xs='12'>
                <div className='Sun_layer'>
                  <span className='Sun_text'>SUN*FETTI</span>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  const question = state.firestore.ordered.current_question;
  const game = state.firestore.ordered.current_game;
  return {
    game: game,
    question: question,
    rank: state.rank.ranking,
    wincount: state.tomo.winCount,
    questionCount: state.tomo.questionCount,
    tomo: state.tomo
  };
};

export default compose(
  connect(mapStatetoProps),
  firestoreConnect([
    {
      collection: 'current_question'
    },
    {
      collection: 'current_game'
    }
  ])
)(PlayerLayout);
