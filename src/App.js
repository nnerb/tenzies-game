import React, { useEffect, useState} from "react";
import {nanoid} from "nanoid"
import Confetti from "react-confetti";

/* COMPONENTS */
import Header from "./components/Header";
import Main from "./components/Main";
import Die from "./components/Die";
import Form from "./components/Form";
import Footer from "./components/Footer";

/* Contexts */
import { MainContext} from "./Contexts/MainContext";
import { FormContext } from "./Contexts/FormContext";
import { DieContext } from "./Contexts/DieContext";

/* Animations */
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";


const App = () => {

  const generateNewDie = () => {
    const diceValue = ["one","two","three","four","five","six"]
    const randomDiceValue = Math.floor(Math.random() * diceValue.length)
    return{
        id: nanoid(),
        value: diceValue[randomDiceValue],
        isHeld: false
    }
  }

  const allNewDice = () => {
    const newDice = []
    for (let i = 0; i < 10; i++){
        newDice.push(generateNewDie())
    }
    return newDice
  }

    // STATES
  const [dice,setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [modal,setModal] = useState(true)
  const [name,setName] = useState({
    id: nanoid(),
    name: "",
    highest: 0,
  }) 
  const [list, setList] = useState(JSON.parse(localStorage.getItem("list")) || {})
  const [isFilled, setIsFilled] = useState(false)

  const [time, setTime] = useState(0)
  const [timer, setTimer] = useState(false)

  const [attempts, setAttempts] = useState(0)

  const [windowsDimension, setWindowsDimension] = useState({width: window.innerWidth, height: window.innerHeight})

  const [isBest, setIsBest] = useState(false)

  const detectSize = () => {
    setWindowsDimension({width: window.innerWidth, height: window.innerHeight})
  }

  useEffect(() => {
    window.addEventListener("resize", detectSize)
    return () => window.removeEventListener("resize", detectSize)
  },[windowsDimension])


  const handleOnchange = (event) => {
      const {name,value} = event.target
      setName(prevSetPlayers => {
          return {
              ...prevSetPlayers,
              [name]: value
          }
      })
  }

  const clearName = () => {
    setName(prevName => {
      return {
        ...prevName,
        name: ""
      }
    })
  }

  const validationFade = () => {
    return new Promise((resolve) => {
      setTimeout(() =>{
        resolve(setIsFilled(false))
      },5000)
    })
  }   

  const triggerValidationFade = async () => {
    await validationFade()
  }

  const insertLocal = (e) => {
    e.preventDefault()
    if(name.name !== "" && list.highest > 0 ){
      setList(prevList => {
        return {
          ...prevList,
          name: name.name
        }
      })
      clearName()
    }
    else if(name.name !== "") {
      setList(prevSetList => {
        return {
          ...prevSetList,
          ...name,
          name: name.name
        }
      })
      clearName()
    }
    else{
      setIsFilled(true)
      triggerValidationFade()
    }
  }

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list))
  },[list])

  useEffect(() => {
      const allHeld = dice.every(die => die.isHeld)
      const firstValue = dice[0].value
      const allSameValue = dice.every(die => die.value === firstValue)

      if (allHeld && allSameValue){
        setTenzies(true)
        setTimer(false)
      }
  },[dice]) 

  
  const roll = () => {

    if(!tenzies){
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
               die :
               generateNewDie()
      }))
      
      if (timer) setAttempts(prevAttempt => prevAttempt + 1)
      else return timer
    }
    else{
      resetButton()
      const getHighest = list.highest
      if((getHighest === 0) || getHighest>time){
       setList(prevList => {
        return {
          ...prevList,
          highest: time          
        }
       })
      }
      else{
        return list
      }
    }
  }


  const toggle = (id) => {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
       {...die, isHeld: !die.isHeld} : 
       die
    }))
    setTimer(true)
  } 
  const dieElements = dice.map(die => {
    return <DieContext.Provider  key={die.id} value={{
            value: die.value,
            isHeld: die.isHeld,
            toggle: () => toggle(die.id),
            tenzies
    }}>
            <Die
              key={die.id}
            />
          </DieContext.Provider>
  })

 
  useEffect(() => {
  let interval = null

  if(timer){ 
    interval = setInterval(() => {
      setTime(prevTime => prevTime + 10)
    }, 10)
    setTimer(true)
  }
  else{
    clearInterval(interval)
  }

  return () => clearInterval(interval)

  },[timer])


  const resetButton = () => {
      setTenzies(false)
      setDice(allNewDice())
      setTime(0)
      setTimer(false)
      setAttempts(0)
 }

  useEffect(() => {
    list.name === "" || Object.keys(list).length === 0 ? setModal(true) : setModal(false)
  },[list])

 const bestTime = list.highest

 useEffect(() => {
  list.highest > 0 ? setIsBest(true) : setIsBest(false)
 },[list])

 const timeComputation = (value) => {
  return <>
          <span>{("0" + Math.floor((value / 60000) % 60 )).slice(-2)}:</span>
          <span>{("0" + Math.floor((value / 1000) % 60 )).slice(-2)}:</span>
          <span>{("0" + ((value / 10) % 100 )).slice(-2)}</span>
         </>
}

const realTimer = timeComputation(time)
const bestRecord = timeComputation(bestTime)

const backButton = () => {
  setList(prevList => {
   return {
    ...prevList,
    name:""
   } 
  })
}

  return (

    <div className="App">

      {tenzies && <Confetti width={windowsDimension.width} height={windowsDimension.height} tweenDuration={1000}/>}
        <Header/>
        <LayoutGroup>
          <AnimatePresence>
            {modal ? 
              <motion.div
                layout
                key="div"
                initial={{y: -100, scale: 0}}
                animate={{y:0, scale: 1, transition: {duration: 1.5, type: "spring"}}}
                exit={{scale: 0}}
                className="main--form">
                <FormContext.Provider value={
                  {
                    name,
                    handleChange: (event)=>handleOnchange(event),
                    start: (e) => insertLocal(e),
                    isFilled
                  }
                }>
                    <Form/>
                </FormContext.Provider>
              </motion.div>
              :
              <motion.div layout 
              initial={{y: -100, scale: 0}}
              animate={{y:0, scale: 1, transition: {duration: 1.5, type: "spring"}}}
              exit={{scale: 0}}
              className="main--container"
              >
                <MainContext.Provider value={
                  {
                    list,
                    dieElements,
                    roll,
                    tenzies,
                    time,
                    attempts,
                    timer,
                    resetButton,
                    bestTime,
                    isBest,
                    realTimer,
                    bestRecord,
                    backButton
                  }
                }
                >
                  <Main/>
                </MainContext.Provider>
              </motion.div>
              }
          </AnimatePresence>
        </LayoutGroup>
        <Footer/>
    </div>
  );
}
export default App;
