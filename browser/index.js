const level = require('level')
const hyperlog = require('hyperlog')
const yo = require('yo-yo')
const wswarm = require('webrtc-swarm')
const signalhub = require('signalhub')
const concat = require('concat-stream')

const hubs = ['10.0.0.166:10000'] // put whatever hubs you want here
const swarm = wswarm(signalhub('wow', hubs))
const db = level('db')
const log = hyperlog(db, {
  valueEncoding: 'json'
})

const root = document.getElementById('app')
const state = {
  pubs: []
}

root.appendChild(render(state))
read()

log.on('add', () => read())

swarm.on('peer', (peer, id) => {
  peer.pipe(log.replicate({live: true}).pipe(peer))
})

function read () {
  log.createReadStream().pipe(concat(body => {
    console.log('body', body)
    state.pubs = body
    yo.update(root, render(state))
  }))
}

function render (state) {
  return yo`
    <div id='app'>
      <h1>pubs</h1>
      <form onsubmit=${function (e) {
        e.preventDefault()
        log.append(this.elements.publish.value, err => {
          if (err) console.error(err)
          e.target.reset()
        })
      }}>
        <input type='text' name='publish' placeholder='publish some words'>
        <button type='submit'>publish</button>
      </form>
      <ul>
        ${state.pubs.map(pub => {
          return yo`<li>${pub.value}</li>`
        })}
      </ul>
    </div>`
}

