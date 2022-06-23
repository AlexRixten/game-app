import React, { useEffect, useState } from 'react'
import './button.css'

export default function Button(props) {

    const [active, setActive] = useState(false)

    useEffect(() => {
        props.data.map(item => {
            if (item === props.title) {
                setActive(!active) 
            }
        })
    },[props.data])

    const handlerActive = () => {
        if (active) {
            props.setData(props.data.filter(item => item !== props.title))
            setActive(!active)
        }
        else {
            if (props.data.length < 8) {
                props.setData([...props.data, props.title])
                setActive(!active)

            } else {
                return
            }
        }
    }

    return (
        <button className={`btn ${active ? 'active' : ''}`} onClick={handlerActive}>{props.title}</button>
    )
}
