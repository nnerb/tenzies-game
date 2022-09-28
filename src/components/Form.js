import React, { useContext } from "react";
import { FormContext } from "../Contexts/FormContext";
import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'

const Form = () => {

    const {start, isFilled, handleChange,name} = useContext(FormContext)
    
    return(
            <LayoutGroup>   
                <motion.form layout className="form" onSubmit={start}>
                    <motion.p layout className="p--header"> Hi there! What should we call you? </motion.p>
                    <AnimatePresence>
                    {isFilled && 
                        <motion.p
                        key="p1"
                        layout
                        initial={{x: -150, scale: 0}}
                        animate={{x:0, scale: 1, transition: {duration: 0.5, type: "spring"}}}
                        exit={{x: -115, scale: 0}}
                        className="validation">
                            Name is required
                        </motion.p>
                    }
                    </AnimatePresence>
                    
                    <motion.input
                        layout
                        className="Name"
                        placeholder="Cardo Dalithay"
                        name="name"
                        onChange={handleChange}
                        autoComplete="off"
                        values={name}
                    />
                    <motion.button layout className="start--button">Start Playing</motion.button>
                </motion.form>
            </LayoutGroup>
    )
}

export default Form