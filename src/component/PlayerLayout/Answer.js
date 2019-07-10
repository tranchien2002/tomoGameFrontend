import React from "react";
import { Button } from "reactstrap";
import * as actions from "../../actions/quesAction";
import * as tomoAction from "actions/tomoAction";
import store from "../../store";
import "../App.css";

function click(answer) {
  store.dispatch(tomoAction.answer(answer));
}

const Answer = answer => {
  return (
    <Button
      onClick={e => click(answer)}
      className="answer_box"
      outline
      color="primary"
    >
      {answer}
    </Button>
  );
};

export default Answer;
