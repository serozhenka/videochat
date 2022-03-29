const app_id = '0c313de6efdc4ded9e4901752859b779'
const channel = 'main'
const token = '0060c313de6efdc4ded9e4901752859b779IAB21e21ArhkExYSTP/ESeekTezvGzo/c64/wRuTuw8wFmTNKL8AAAAAEADR1hyrKDZEYgEAAQAnNkRi'
let uid

const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})
let localTracks = []
let remoteUsers = {}

let displayLocalStream = async () => {
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

displayLocalStream()