import React from 'react'
import {useMessagesContext} from '../context/MessagesContext'
import Message from './Message'
import MessageActionsPopup from './MessageActionsPopup'

export default function Messages(props) {
  const {messages} = useMessagesContext()

  function renderMessages() {
    return messages.map((message) => {
      return ( 
        <Message 
          key={message._id} 
          message={message} 
          activeMessage={props.activeMessage}
          setActiveMessage={props.setActiveMessage} 
        />
      )
    })
  }

  return (
    <div className="chat-with-people">
      {renderMessages()}
      <MessageActionsPopup activeMessage={props.activeMessage} setActiveMessage={props.setActiveMessage} />
    </div>
  )
}