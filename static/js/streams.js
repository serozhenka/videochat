const app_id = '0c313de6efdc4ded9e4901752859b779'
const channel = sessionStorage.getItem('room')
const token = sessionStorage.getItem('token')
let uid = Number(sessionStorage.getItem('uid'))
let username = sessionStorage.getItem('username')

const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})
let localTracks = []
let remoteUsers = {}

let displayLocalStream = async () => {
    document.getElementById('room-name').innerText = channel

    client.on('user-published', handleUserJoin)
    client.on('user-left', handleUserLeft)

    try {
      await client.join(app_id, channel, token, uid)
    } catch(error) {
        window.open('/', '_self')
        console.error('error', error)
    }
    localTracks =  await AgoraRTC.createMicrophoneAndCameraTracks()
    let member = await createMember()

    let videoPlayer = `<div class="video-container" id="user-container-${uid}">
                            <div class="username-wrappper"><span class="user-name">${member.name}</span></div>
                            <div class="video-player" id="user-${uid}"></div>
                        </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', videoPlayer)
    localTracks[1].play(`user-${uid}`)

    await client.publish([localTracks[0], localTracks[1]])
}

let handleUserJoin = async function(user, mediaType) {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if (mediaType === 'video') {
        let videoPlayer = document.getElementById(`user-container-${user.uid}`)
        if (videoPlayer) {
            videoPlayer.remove()
        }

        let member = await getMember(user)
        videoPlayer = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="username-wrappper"><span class="user-name">${member.name}</span></div>
                        <div class="video-player" id="user-${user.uid}"></div>
                    </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', videoPlayer)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === "audio") {
        user.audioTrack.play()
    }
}

let handleUserLeft = async function(user) {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveStream = async function() {
    for(let i = 0; i < localTracks.length; ++i) {
        localTracks[i].stop()
        localTracks[i].close()
    }

    await deleteMember()
    await client.leave()
    window.open('/', '_self')
}

let toogleVoice = async function(e) {
    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    } else {
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgba(255, 80, 80, 1)'
    }
}

let toogleCamera = async function(e) {
    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    } else {
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgba(255, 80, 80, 1)'
    }
}

let createMember = async function() {
    let response = await fetch('/create-member/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'name': username, 'room_name': channel, 'uid': uid})
    })
    return await response.json()
}

let getMember = async function(user) {
    let response = await fetch(`/get-member/?uid=${user.uid}&room_name=${channel}`)
    return await response.json()
}

let deleteMember = async function() {
    let response = await fetch('/delete-member/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'name': username, 'room_name': channel, 'uid': uid})
    })
    return await response.json()
}

window.addEventListener('beforeunload', deleteMember)
document.getElementById('leave-btn').addEventListener('click', leaveStream)
document.getElementById('cam-btn').addEventListener('click', toogleCamera)
document.getElementById('mic-btn').addEventListener('click', toogleVoice)


displayLocalStream()