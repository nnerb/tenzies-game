import React, { useContext } from "react";
import { DieContext } from "../Contexts/DieContext";

const Die = () => {

    const {value, isHeld, toggle,tenzies} = useContext(DieContext)
    
    const styles = {
        color: isHeld ? "#59E391" : "#ca4545",
        pointerEvents: tenzies ? "none" : "auto"
    }

    return(
        <i className={`fa-solid fa-dice-${value} die-face shaking`} style={styles} onClick={toggle}></i> 
    )

}

export default Die