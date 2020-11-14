import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {postData} from '../../redux/actions/actions.js'
import {POST_CHANNEL} from '../../redux/types.js'
import {SelectPeople} from '../SelectPeople/SelectPeople.jsx'
import './add-channel.sass'


export function AddChannel(props) {
  const dispatch = useDispatch()
  const newChannel = useSelector(state => state.newChannel)
  const userId = useSelector(state => state.login.userId)
  const token = useSelector(state => state.login.token)
  const {
    isNotMembers,
    setInvited,
    invited,
    setModalAddChannelIsOpen, 
    setListChannels, 
    createLinkChannel 
  } = props
  const [notInvited, setNotInvited] = useState([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [form, setForm] = useState({
    name: '', discription: '', isPrivate: false, members: []
  })
  const heightParrentDiv = 'set-channel__add_height'
  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    if (isNotMembers) { 
      setNotInvited(isNotMembers)
    }
}, [isNotMembers])

  useEffect(() => {
    if (newChannel) {
      const linkChannel = createLinkChannel(newChannel.channel)
      setListChannels(prevList => { return prevList.concat(linkChannel) })
    }
  }, newChannel)

  const doneCreate = async () => {
    const members = invited[0] ? invited.concat(userId) : [userId]
    await dispatch( postData(POST_CHANNEL, token, { ...form, creator: userId, members }, userId) )
    setModalAddChannelIsOpen(false)
  }

  function createForm(param) {
    const {...rest} = param
    return (
      <div className="set-channel-forms">
        <label className={param.labelClassName}>{param.labelName}</label>
        <input 
          placeholder={param.placeholder} 
          className={param.className}
          type="text"
          id={param.id}
          name={param.name}
          value={param.value}
          onChange={changeHandler} 
        />
      </div>
    )
  }

  function changeIsPrivate() {
    setForm(prev => {
      return { 
        ...prev, 
        isPrivate: !isPrivate 
      } 
    })
    setIsPrivate(!isPrivate)
  }

  function closeAddChannel() {
    setNotInvited(isNotMembers)
    setInvited([])
    setModalAddChannelIsOpen(false)
  }


  return (
    <div className="set-channel">
      <label>Create a channel</label>
      <p className="set-channel__discription-create">
        Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.
      </p>

      <form>
        {createForm({
          labelName: "Name", 
          labelClassName: "set-channel-forms__label",
          placeholder: "input name channel", 
          className: "set-channel-forms__input",
          id: "name", 
          name: "name", 
          value: form.name
        })}

        <div className="set-channel-forms">
          <label className="set-channel-forms__label">Discription</label>
          <input 
            placeholder="input description channel" 
            className="set-channel-forms__input"
            type="text"
            id="discription"
            name="discription"
            value={form.discription}
            onChange={changeHandler} 
          />
        </div>

        <SelectPeople 
          isNotMembers={isNotMembers}
          invited={invited}
          setInvited={setInvited}
          notInvited={notInvited}
          setNotInvited={setNotInvited}
          heightParrentDiv={heightParrentDiv}
        />

        <div className="set-channel-forms" id="add-private-channel">
          <label className="set-channel-forms__label" >Private channel</label>
          <input 
            className="set-channel-forms__input set-channel-forms__input_width" 
            type="checkbox" 
            id="checkbox" 
            name="checkbox" 
            onClick={changeIsPrivate}
          />
        </div>
      </form>

      <button className="set-channel__button" onClick={closeAddChannel}>Close</button>
      <button className="set-channel__button" onClick={doneCreate}>Create</button>
    </div>
  )
}

const mapDispatchToProps = {
  postData 
}

export default connect(null, mapDispatchToProps)(AddChannel)