import React from 'react';
//import logo from './logo.svg';
import './App.css';




function App() {
  return (
    //<div className="App">
      <body id="App-header">
        <div id="messages"></div>
        <div id="members"></div>
        <input id="write" placeholder="Write message"/>
        <input id="name" placeholder="Your Alias"/>
      </body>
    //</div>
  );
}
const fetchGET = async function(uri) {
    const request = await fetch(uri)
    const text = await request.text()
    let json
    try {
        json = JSON.parse(text)
    } catch (e) { /* ignore */ }
    return json || text
}

const fetchPOST = async function(uri, content) {
    const request = await fetch(uri, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(content)
    })
    const text = await request.text()
    let json
    try {
        json = JSON.parse(text)
    } catch (e) { /* ignore */ }
    return json || text
}

async function populate() {
    const messages = await fetchGET("https://app.koodikool.ee/sdb/chatapp-messages")
    if (!messages.length) {
        fetchPOST("https://app.koodikool.ee/sdb/chatapp-messages", {user: "Krister", message: "Tere!"})
    }

}
populate()
window.onload = function(){
const input = document.querySelector('#write')
const nameInput = document.querySelector('#name')
const messagesDiv = document.querySelector('#messages')
const membersDiv = document.querySelector('#members')

//input.focus()

input.onkeyup = function(event){
    if (event.key === 'Enter') {
        const data = {
            user: nameInput.value,
            message: input.value
        }
        fetchPOST('https://app.koodikool.ee/sdb/chatapp-messages', data)
        input.value = ''
        //window.location.reload()
        
    
}
    
}
 
async function getMessages(){
    const messages = await fetchGET('https://app.koodikool.ee/sdb/chatapp-messages')
    messagesDiv.innerHTML = ''
    for (const message of messages) {
        const messageHTML = '<p>' + message.user + ': ' + message.message + '</p>'
        messagesDiv.innerHTML = messagesDiv.innerHTML + messageHTML
    }
    const members = []
    for (const message of messages) {
        if(!members.includes(message.user)) {
            members.push(message.user)
            
        }
    }
    
    let membersHTML = ''
    for (const newMember of members) {
        const newMemberHTML = '<p>' + newMember + '</p>'
        membersHTML = membersHTML + newMemberHTML
        
    }
    
    membersDiv.innerHTML = membersDiv.innerHTML + membersHTML
    window.scrollTo(0, document.body.scrollHeight); 
     
}

getMessages()
const fetchDelayMilliseconds = 5000
setInterval(getMessages, fetchDelayMilliseconds)
}

export default App;
