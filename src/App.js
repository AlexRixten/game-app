
import React, { useState, useEffect } from "react";
import axios from "axios"
import { IoMdColorWand, IoMdClose, IoMdRefresh } from "react-icons/io";
import './App.css'
import Button from "./components/Button/Button";

const listNumber = (n) => Array.from({ length: n }, (v, k) => k + 1); // функция для создания кнопок

// const randomNumber = (length, max) => [...new Array(length)]
//   .map(() => 1 + (Math.round(Math.random() * max))); // создание массивов с рандомными значениями

const randomNumberArr = (len, max) => {
  var numReserve = []
  while (numReserve.length < len) {
    var randomNumber = Math.ceil(Math.random() * max);
    var found = false;
    for (var i = 0; i < numReserve.length; i++) {
      if (numReserve[i] === randomNumber) {
        found = true;
        break;
      }
    }
    if (!found) { numReserve[numReserve.length] = randomNumber; }
  }

  return numReserve
}

const intersect = (arr1, arr2) => { // функция для поиска совпадений
  let result = []

  let map = arr1.reduce((acc, i) => {
    acc[i] = acc[i] ? acc[i] + 1 : 1;
    return acc
  }, {})

  for (let i = 0; i < arr2.length; i++) {
    const current = arr2[i];
    let count = map[current];

    if (count && count > 0) {
      result.push(current);
      map[current] -= 1;
    }
  }

  return result.length
}

function App() {
  const [dataOne, setDataOne] = useState([])
  const [dataTwo, setDataTwo] = useState([])

  const [errorObj, setErrorObj] = useState('')

  const [result, setResult] = useState(false)
  const [resultText, setResultText] = useState('К сожалению, сегодня не ваш день!')

  const fieldOne = listNumber(19)
  const fieldTwo = listNumber(2)
  const randomNumberFieldOne = randomNumberArr(8, 40)
  const randomNumberFieldTwo = randomNumberArr(1, 2)

  useEffect(() => {
    if (dataOne.length <= 8 || dataTwo.length <= 1) {
      setErrorObj('')
      setResultText('К сожалению, сегодня не ваш день!')
    }
  }, [setErrorObj, dataOne, dataTwo])

  const postData = (url, dataOne, dataTwo, win) => {
    axios.post('url', {
      selectedNumber: {
        firstField: dataOne,
        secondField: dataTwo
      },
      isTicketWon: win,
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        if (error.response) {
          setTimeout(() => {
            axios.post('url', {
              selectedNumber: {
                firstField: dataOne,
                secondField: dataTwo
              },
              isTicketWon: win,
            })
          }, 2000)
        }
      });
  }

  const reportData = () => {
    const sumOne = intersect(randomNumberFieldOne, dataOne)
    const sumTwo = intersect(randomNumberFieldTwo, dataTwo)
    let win = false

    const url = 'http://api/stoLoto/v1/';

    if (dataOne.length === 8 && dataTwo.length === 1) {

      if (sumOne >= 4 || (sumOne >= 3 && sumTwo >= 1)) {
        setResultText('Ого, вы выиграли! Поздравляем!')
        win = true
      }

      postData(url, dataOne, dataTwo, win)
      setResult(!result)
    }
    else {
      setErrorObj('Вам необходимо отметить все поля')
      setResultText('К сожалению, сегодня не ваш день!')
    }
  }

  const magicClick = () => {
    if (dataOne.length > 0 || dataTwo.length > 0) {
      return
    } else {
      setDataOne(randomNumberArr(8, 19))
      setDataTwo(randomNumberArr(1, 2))
    }
  }

  return (
    <div className="App">
      {!result
        ? <div className="ticket">
          <div className="ticket_top">
            <h1 className="ticket_title">Билет 1</h1>
            <div className="ticket_magic_btns">
              <IoMdRefresh
                className="ticket_magic refresh"
                onClick={() => {
                  setDataOne([])
                  setDataTwo([])
                }}
              />
              <IoMdColorWand onClick={magicClick} className="ticket_magic" />
            </div>
          </div>
          <div className="field">
            <div className="field_title">
              <h3 className="field_subtitle">Поле 1</h3>
              <p className="field_description">Отметьте 8 чисел.</p>
            </div>
            <div className="field_btns">
              {fieldOne.map((item, index) => (
                <Button
                  key={index}
                  title={item}
                  data={dataOne}
                  setData={setDataOne}
                />
              ))}
            </div>
          </div>
          <div className="field">
            <div className="field_title">
              <h3 className="field_subtitle">Поле 2</h3>
              <p className="field_description">Отметьте 1 число.</p>
            </div>
            <div className="field_btns">
              {fieldTwo.map((item, index) => (
                <Button
                  key={index}
                  title={item}
                  data={dataTwo}
                  setData={setDataTwo}
                />
              ))}
            </div>
          </div>
          <div>
            <button className="ticket_result" onClick={reportData}>Показать результат</button>
            {errorObj ? <p style={{ color: 'red', fontSize: 10, textAlign: 'center', marginTop: 10 }}>{errorObj}</p> : null}
          </div>
        </div>
        : <div className="ticket">
          <div className="ticket_top">
            <h1 className="ticket_title">Билет 1</h1>
            <div className="ticket_magic_btns">
              <IoMdClose
                className="ticket_magic"
                onClick={() => {
                  setResult(!result)
                  setDataOne([])
                  setDataTwo([])
                }}
              />
            </div>

          </div>
          <p className="field_description">{resultText}</p>
        </div>
      }

    </div>
  );
}

export default App;
