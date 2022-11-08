import React, { useState, useEffect, useCallback } from 'react'
import Slider from '@material-ui/core/Slider';
import './App.css';

import {russian} from './languages/russian'
import {slovakian} from './languages/slovakian'

function App() {

  const languages = {
    russian: {words: russian},
    slovakian: {words: slovakian},
  }

  const [language, setLanguage] = useState('slovakian');
  const [wordRange, setWordRange] = useState([0, languages[language].words.length]);

  const handleWordRangeChange = (event, newValue) => {
    setWordRange(newValue);
  };

  const [currentWord, setCurrentWord] = useState()
  const [previousWord, setPreviousWord] = useState()
  const [isCorrect, setIsCorrect] = useState(null)
  const [options, setOptions] = useState([])
  const [optionsLength, setOptionsLength] = useState(2)

  const getRandom = () => {
    const slicedWords = languages[language].words.slice(wordRange[0], wordRange[1])
    return slicedWords[Math.floor(Math.random() * slicedWords.length)];
  }

  const makeOptions = useCallback(() => {
    if(currentWord) {
      const array = Array.from(Array(optionsLength - 1)).map((_) => {
        const englishWord = getRandom()[1]
        return (
          englishWord
        )
      })
      array.push(currentWord[1])
      shuffle(array)
      setOptions(array)
    }
  }, [currentWord, setOptions, getRandom])

  useEffect(() => {
    if(!currentWord) {
      setCurrentWord(getRandom())
    }
  }, [makeOptions])

  useEffect(() => {
    makeOptions()
  }, [currentWord])

  const guess = (englishWord) => {

    if(englishWord === currentWord[1]) {
      setIsCorrect(true)
    } else {
      setIsCorrect(false)
    }

    setPreviousWord(currentWord)
    setCurrentWord(getRandom())

    makeOptions()
  }

  function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  if(!currentWord) return null

  return (
    <div style={{fontSize: '40px', display: 'flex', flexDirection: 'column', alignContent: 'justify-content', alignItems: 'center'}}>

      <div style={{marginBottom: '20px'}}>
        <a target="_blank" style={{textDecoration: 'none', color: 'black'}} href={`https://translate.google.com/?sl=auto&tl=en&text=${currentWord[0]}&op=translate`}>{currentWord[0]}</a>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', alignContent: 'justify-content', alignItems: 'center'}}>
        {options.map((option) => {
          return (
            <button style={{fontSize: '30px', marginBottom: '10px'}} onClick={() => guess(option)}>{option}</button>
          )
        })}

      </div>

      <div style={{fontSize: '20px', color: isCorrect ? 'green' : 'red', marginTop: '20px'}}>
        {isCorrect === true && <>True</>}
        {isCorrect === false && <>False</>}
      </div>

      <div style={{display: 'flex', fontSize: '20px', marginTop: '20px'}}>
        <div style={{marginRight: '12px'}}>
        <a target="_blank" style={{textDecoration: 'none', color: 'black'}} href={`https://translate.google.com/?sl=auto&tl=en&text=${previousWord?.[0]}&op=translate`}>{previousWord?.[0]}</a>
        </div>
        <div>{previousWord?.[1]}</div>
      </div>

      <div style={{display: 'flex', fontSize: '10px', marginTop: '20px', marginBottom: '20px', alignItems: 'center'}}>
        # Options: <input style={{marginLeft: '4px', width: '20px'}} onChange={(e) => setOptionsLength(e.target.value)} value={optionsLength} />
      </div>


      <Slider
        min={0}
        max={languages[language].words.length}
        style={{width: '300px'}}
        value={wordRange}
        onChange={handleWordRangeChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        // getAriaValueText={valuetext}
      />
      <div style={{display: 'flex', fontSize: '10px', marginTop: '20px', alignItems: 'center'}}>
        Word Range: {wordRange[0]} - {wordRange[1]}
      </div>

      <select value={language} style={{marginTop: '20px'}} onChange={(e) => {setLanguage(e.target.value) }}>
        {Object.keys(languages).map((key) => {
          return (
            <option key={key}>{key}</option>
          )
        })}
      </select>

    </div>
  );
}

export default App;
