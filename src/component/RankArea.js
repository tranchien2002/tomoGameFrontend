import React from 'react'
import { Col } from 'reactstrap'
import '../App.css';

const RankArea = ({rank}) => {
    return (
        <Col className = "box_color" xs="4">
            <div className="ranking margin_box" >
                {/* Ranking */}
                <div className = "ranking_title">
                    <h1>Ranking</h1>
                </div>
                {/* member ranking */}
                <div className = "person_rank_box">
                    {
                        rank.map(rank => (
                            <div key={rank.account} className = "person_rank">
                                <p className = "user_account">
                                    <span className = "ellipsis">{rank.account}</span>
                                    <span className = "indent">{rank.account}</span>                                        
                                </p>
                                <p>
                                    {rank.correct}/10
                                </p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Col>
    )
}

export default RankArea;