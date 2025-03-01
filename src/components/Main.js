import React, { useContext } from "react";
import { MainContext } from "../Contexts/MainContext";
import {motion} from "framer-motion"

const Main = () => {

    const {
        list,
        dieElements,
        roll,
        tenzies,
        attempts,
        timer,
        resetButton,
        isBest,
        realTimer,
        bestRecord,
        backButton
    } = useContext(MainContext)

    const styles = {
        pointerEvents: timer ? "auto" : "none",
        backgroundColor: timer ? "#d48114" : "#d48114a6"
    }

    const backButtonStyles = {
        pointerEvents: timer || tenzies ? "none" : "auto"
    }

    return (
            <main className="main">
                <div className="header-container">
                    <motion.i onClick={backButton} whileHover={{rotate: 50}} className="fa fa-arrow-left" style={backButtonStyles}></motion.i>
                    <h1 className="title">Tenzies</h1>
                    <button onClick={resetButton} className="reset-button" style={styles}>Reset</button>
                </div>
                
                <p className="instructions"> Hi, {Object.keys(list).length !== 0 ? list.name : "Anonymous"}. Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
                <div className="time-container">  
                    <i className="fa fa-clock"></i> 
                    {realTimer}
                </div>
                {isBest && <div className="best-time"> 
                    <i className="fa fa-trophy"></i>
                    <span className="best-time-text">Best Time - </span>
                    {bestRecord}
                </div>}
                <div className="dice-container">
                    {dieElements}
                </div> 
                <div className="attempts-container">
                     <span> Attempts: </span>
                     <span>{attempts}</span>
                </div>
                <button className="roll-dice" onClick={roll} > {tenzies ? "New Game" : "Roll"} </button> 
            </main>
  
    )

}

export default Main
