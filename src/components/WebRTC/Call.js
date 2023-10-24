import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";

let localStream = null
let pcs = {}
setInterval(()=>{
  console.log(pcs)
}, 3000)
export default function Call(props) {

  let { selectedChat } = props
  const [startButtonEnabled, setStartButtonEnabled] = useState(true);
  const [hangupButtonEnabled, setHangupButtonEnabled] = useState(false);

  let localVideo = useRef(null);
  const video1 = useRef()
  const video2 = useRef()
  const video3 = useRef()
  const video4 = useRef()
  const video5 = useRef()
  const video6 = useRef()

  useEffect(() => {
    // recuperer la liste des DM de l'utilisateur courant
    socket.on('webrtc:message', (message) => {
      if (!localStream) {
        console.log('not ready yet');
        return;
      }

      switch (message.type) {
        case 'offer':
          handleOffer(message);
          break;
        case 'answer':
          handleAnswer(message);
          break;
        case 'candidate':
          handleCandidate(message);
          break;
        case 'ready':
          if (Object.keys(pcs) === 6) {
            console.log('already 7 persons in the room')
            return
          }
          // A second tab joined. This tab will initiate a call unless in a call already.
          makeCall(message.initiator);
          break;
        case 'bye':
          if (message.leaver && pcs[message.leaver]) {
            hangup(message.leaver);
          }
          break;
        default:
          console.log('unhandled', message);
          break;
      }
    })

    return () => {
      socket.off('webrtc:message');
    };
  }, [startButtonEnabled])

  async function hangup(leaver) {

    if (leaver == null) {
      for (const key of Object.keys(pcs)) {
        pcs[key].close()
      }
      pcs = {}
      localStream.getTracks().forEach(track => {track.stop()});
      localStream = null;
      setStartButtonEnabled(true)
      setHangupButtonEnabled(false)
      return
    }
    if (video1.current.peer === leaver) {
      delete video1.current.peer
    } else if (video2.current.peer === leaver) {
      delete video2.current.peer
    }
    else if (video3.current.peer === leaver) {
      delete video3.current.peer
    }
    else if (video3.current.peer === leaver) {
      delete video3.current.peer
    }
    else if (video4.current.peer === leaver) {
      delete video4.current.peer
    }
    else if (video5.current.peer === leaver) {
      delete video5.current.peer
    }
    else if (video6.current.peer === leaver) {
      delete video6.current.peer
    }
    pcs[leaver].close();
    delete pcs[leaver]
    if (Object.keys(pcs).length === 0) {
      localStream.getTracks().forEach(track => {track.stop()});
      localStream = null;
      
      setStartButtonEnabled(true)
      setHangupButtonEnabled(false)
    }
  };
  function createPeerConnection(peer) {
    pcs[peer] = new RTCPeerConnection({});
    pcs[peer].onicecandidate = e => {
      const message = {
        type: 'candidate',
        candidate: null,
        chatId: selectedChat.chatId,
        peer: socket.id
      };
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.sdpMid = e.candidate.sdpMid;
        message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }
      socket.emit('webrtc:message', message)
    };
    pcs[peer].ontrack = e => {
      if (video1.current.peer) {
        video1.current.srcObject = e.streams[0]
        video1.current.peer = peer
      }
      if (video2.current.peer) {
        video2.current.srcObject = e.streams[0]
        video2.current.peer = peer
      }
      if (video3.current.peer) {
        video3.current.srcObject = e.streams[0]
        video3.current.peer = peer
      }
      if (video4.current.peer) {
        video4.current.srcObject = e.streams[0]
        video4.current.peer = peer
      }
      if (video5.current.peer) {
        video5.current.srcObject = e.streams[0]
        video5.current.peer = peer
      }
      if (video6.current.peer) {
        video6.current.srcObject = e.streams[0]
        video6.current.peer = peer
      }
    };
    localStream.getTracks().forEach(track => pcs[peer].addTrack(track, localStream));
  }

  async function makeCall(initiator) {
    await createPeerConnection(initiator);

    const offer = await pcs[initiator].createOffer();
    socket.emit('webrtc:message', { type: 'offer', sdp: offer.sdp, chatId: selectedChat.chatId, initiator, responder: socket.id })
    await pcs[initiator].setLocalDescription(offer);
  }

  async function handleOffer(offer) {

    const {initiator, responder} = offer
    console.log('got offer from responder:' + responder)

    await createPeerConnection(responder);
    await pcs[responder].setRemoteDescription(offer);

    const answer = await pcs[responder].createAnswer();
    socket.emit('webrtc:message', { type: 'answer', sdp: answer.sdp, chatId: selectedChat.chatId, responder, initiator })
    await pcs[responder].setLocalDescription(answer);
  }

  async function handleAnswer(answer) {
 
    const {initiator} = answer

    console.log('got answer from initiator: '+initiator)
    await pcs[initiator].setRemoteDescription(answer);
  }

  async function handleCandidate(candidate) {
    if (!pcs[candidate.peer]) {
      console.error('no peerconnection with initiator:' + candidate.peer);
      return;
    }
    if (!candidate.candidate) {
      await pcs[candidate.peer].addIceCandidate(null);
    } else {
      await pcs[candidate.peer].addIceCandidate(candidate);
    }
  }


  const startButtonClick = async function () {
    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localVideo.current.srcObject = localStream;
    }

    setStartButtonEnabled(false)
    setHangupButtonEnabled(true)


    socket.emit('webrtc:message', { type: 'ready', chatId: selectedChat.chatId, initiator: socket.id });
  }

  const hangupButtonClick = async function () {
    hangup(null);
    socket.emit('webrtc:message', { type: 'bye', chatId: selectedChat.chatId, leaver: socket.id })
  };

  return (
    <div>
      <video id="localVideo" ref={localVideo} playsInline={true} autoPlay={true} muted></video>
      <video ref={video1} style={{display: pcs[Object.keys(pcs)[0]] ? 'block' : 'none' }} id='video1' playsInline={true} autoPlay={true}></video>
      <video ref={video2} style={{display: pcs[Object.keys(pcs)[1]] ? 'block' : 'none' }}  id='video2' playsInline={true} autoPlay={true}></video>
      <video ref={video3}  style={{display: pcs[Object.keys(pcs)[2]] ? 'block' : 'none' }} id='video3' playsInline={true} autoPlay={true}></video>
      <video ref={video4} style={{display: pcs[Object.keys(pcs)[3]] ? 'block' : 'none' }}  id='video4' playsInline={true} autoPlay={true}></video>
      <video ref={video5}  style={{display: pcs[Object.keys(pcs)[4]] ? 'block' : 'none' }} id='video5' playsInline={true} autoPlay={true}></video>
      <video ref={video6}  style={{display: pcs[Object.keys(pcs)[5]] ? 'block' : 'none' }}id='video6' playsInline={true} autoPlay={true}></video>

      <div className="box">
        <button  disabled={!startButtonEnabled} id="startButton" onClick={startButtonClick}>Start</button>
        <button disabled={!hangupButtonEnabled}  onClick={hangupButtonClick} id="hangupButton">Hang Up</button>
      </div>

    </div>
  );
}
