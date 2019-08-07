import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import QuesArea from './QuesArea';
import RankArea from './RankArea';
import Message from '../Message';
import store from 'store';
import data from '../data.json';
import * as tomoAction from 'actions/tomoAction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Animated } from 'react-animated-css';
import '../../style/Sunfetti.css';
import '../../style/App.css';

class PlayerLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'en'
    };

    this.placeABet = this.placeABet.bind(this);
    this.startPlay = this.startPlay.bind(this);
    this.changeLang = this.changeLang.bind(this);
  }

  async componentDidMount() {
    this.interval = setInterval(() => {
      if (this.props.tomo.account !== null && this.props.tomo.game !== null) {
        store.dispatch(tomoAction.fetchWinCount());
        store.dispatch(tomoAction.getBalance());
        store.dispatch(tomoAction.getAliasBalance());
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

  notifyInfo = (message) => {
    toast.info(message);
  };
  changeLang(lang) {
    this.setState({ lang });
  }

  render() {
    const { rank } = this.props;
    const { question, questionCount } = this.props;
    const { wincount } = this.props;
    const { tomo } = this.props;

    const msgs = data;
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
                  <Col className='box_color' xs='12' md='8'>
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
                    animationOut='bounceOut'
                  >
                    <div className='margin_box '>
                      {parseFloat(tomo.aliasBalance) > 30 ? (
                        <div>
                          <span>You have {tomo.aliasBalance} Tomo</span>
                          <Button
                            color='success'
                            className='button-start'
                            onClick={(e) => this.startPlay()}
                          >
                            Start
                          </Button>
                          <Button
                            color='none'
                            className='button-withdraw'
                            onClick={(e) => {
                              this.withdraw();
                              this.notifyInfo('Withdrawing...', { autoClose: 1000 });
                            }}
                          >
                            WithDraw
                          </Button>
                          <ToastContainer className='toast-info' />
                        </div>
                      ) : (
                        <div className='container'>
                          <span>SUN*FETTI</span>
                          <div className='langButton'>
                            <Button color='primary' onClick={(e) => this.changeLang('en')}>
                              EN
                            </Button>
                            <Button color='primary' onClick={(e) => this.changeLang('vn')}>
                              VN
                            </Button>
                            <Button color='primary' onClick={(e) => this.changeLang('jp')}>
                              JP
                            </Button>
                          </div>
                          <div className='rule-container'>
                            {msgs.map((msg, index) => {
                              return <Message key={index} rule={msg} lang={this.state.lang} />;
                            })}
                          </div>

                          <Button
                            className='send-tomo'
                            color='primary'
                            onClick={(e) => this.placeABet()}
                          >
                            Send
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
