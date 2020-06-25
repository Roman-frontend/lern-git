import React, {useContext} from 'react'
import {Context} from '../context/context'
import EditMessage from './EditMessage'
import iconPeople from '../images/icon-people.png'

export default function Message(props) {
  const {message} = props
  const {username, text, createdAt, id, listAction, reply} = props.message
  const {messages, setMessages} = useContext(Context)

  function moreEdit(id) {
    let changeMas = messages.map(message => {
      if (message.id === id) {
        message.listAction = !message.listAction 
        return message
      } else {
        message.listAction = false
        return message
      }
    })
    setMessages(changeMas)
  }

  function createMessageReply() {
    if (message.reply) return <div className="reply"><p>&#8593; {message.reply}</p></div>
    return true
  }


  return (
    <div 
    className={ message.reply ? "container-reply" : "container" } 
    onClick={id => moreEdit(message.id)}>
      <div className="icon">
        <img src={iconPeople} alt="icon-user"/>
      </div>

      <div className="messager"><p>{username}</p></div>
      <div className="date"><p>{createdAt}</p></div>

      <div className="more">
        <EditMessage 
          message={props.message}
         />
      </div>

      <div className="message">
        <p>{text}</p>
      </div>

      {createMessageReply()}
    </div>
  )
}