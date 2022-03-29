const app_id = '0c313de6efdc4ded9e4901752859b779'
const channel = 'main'
const token = '0060c313de6efdc4ded9e4901752859b779IAB21e21ArhkExYSTP/ESeekTezvGzo/c64/wRuTuw8wFmTNKL8AAAAAEADR1hyrKDZEYgEAAQAnNkRi'
let uid

const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})
let localTracks = []
let remoteUsers = {}

let displayLocalStream = async () => {
    client.on('user-published', handleUserJoin)
    client.on('user-left', handleUserLeft)

    uid = await client.join(app_id, channel, token, null)
    localTracks =  await AgoraRTC.createMicrophoneAndCameraTracks()

    let videoPlayer = `<div class="video-container" id="user-container-${uid}">
                            <div class="username-wrappper"><span class="user-name">My name</span></div>
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

        videoPlayer = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="username-wrappper"><span class="user-name">My name</span></div>
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

document.getElementById('leave-btn').addEventListener('click', leaveStream)
document.getElementById('cam-btn').addEventListener('click', toogleCamera)
document.getElementById('mic-btn').addEventListener('click', toogleVoice)


displayLocalStream()