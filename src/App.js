
import React, { useState } from "react";
import axios from "axios"
import { IoMdColorWand, IoMdClose } from "react-icons/io";
import './App.css'
import Button from "./components/Button/Button";

const listNumber = (n) => Array.from({ length: n }, (v, k) => k + 1); // функция для создания кнопок

const randomNumber = (length, max) => [...new Array(length)]
  .map(() => Math.round(Math.random() * max)); // создание массивов с рандомными значениями

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

  const [result, setResult] = useState(false)
  const [resultText, setResultText] = useState('К сожалению, сегодня не ваш день!')

  const fieldOne = listNumber(19)
  const fieldTwo = listNumber(2)
  const randomNumberFieldOne = randomNumber(50, 100)
  const randomNumberFieldTwo = randomNumber(2, 6)

  const reportData = () => {
    const sumOne = intersect(randomNumberFieldOne, dataOne)
    const sumTwo = intersect(randomNumberFieldTwo, dataTwo)
    let win = false

    if (dataOne.length === 8 && dataTwo.length === 1) {
      if (sumOne >= 4 || (sumOne >= 3 && sumTwo >= 1)) {
        setResultText('Ого, вы выиграли! Поздравляем!')
        win = true
      }

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
          console.log(error);
        });

      setResult(!result)
    }
  }

  const magicClick = () => {
    if (dataOne.length > 0 || dataTwo.length > 0) {
      return
    } else {
      setDataOne(randomNumber(8, 19))
      setDataTwo(randomNumber(1, 2))
    }
  }

  return (
    <div className="App">
      {!result
        ? <div className="ticket">
          <div className="ticket_top">
            <h1 className="ticket_title">Билет 1</h1>
            <IoMdColorWand onClick={magicClick} className="ticket-magic" />
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
          <button className="ticket_result" onClick={reportData}>Показать результат</button>
        </div>
        : <div className="ticket">
          <div className="ticket_top">
            <h1 className="ticket_title">Билет 1</h1>
            <IoMdClose
              className="ticket-magic"
              onClick={() => {
                setResult(!result)
                setDataOne([])
                setDataTwo([])
              }}
            />
          </div>
          <p className="field_description">{resultText}</p>
        </div>
      }

    </div>
  );
}

export default App;
