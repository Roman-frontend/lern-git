import React from 'react'
import './OpinShareCSS.css'
import contacts from './contacts.png'
import apps from './apps.png'
import files from './files.png'

export default class PeopleAppsFiles extends React.Component {
	render () {
		return(
			<div className="state-info">
			  <b className="set-info-user">Get user</b>
			  <p className="set-text-get-user all-done">All done</p>
			  <img src={contacts} className="sets-img-get-user icon-contacts"/>
			  <p className="set-text-get-user people">People</p>
			  <img src={apps} className="sets-img-get-user icon-apps"/>
			  <p className="set-text-get-user apps-get-user">Apps</p>
			  <img src={files} className="sets-img-get-user icon-files"/>
			  <p className="set-text-get-user files">Files</p>
			</div>
		)
	}
}