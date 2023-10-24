import { useContext, useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import AuthContext from '../../authContext'

let pc, localStream = null
let pcs = [null, null, null, null, null, null]
let index = 0
let calls = []
export default function Call(props) {

  let { selectedChat } = props
  const [startButtonEnabled, setStartButtonEnabled] = useState(true);
  const [hangupButtonEnabled, setHangupButtonEnabled] = useState(false);
  const authContext = useContext(AuthContext)

  let localVideo = useRef(null);
  const video1 = useRef()
  const video2 = useRef()
  const video3 = useRef()
  const video4 = useRef()
  const video5 = useRef()
  const video6 = useRef()
  setInterval(()=>{
    console.log('index:' + index)
    if (calls.length) {
      const currentMessage = calls.shift()
      makeCall(currentMessage.initiator)
    }

  }, 3000)
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
          // A second tab joined. This tab will initiate a call unless in a call already.
          if (index >= pcs.length) {
            console.log('already in call, ignoring');
           // return;
          }
          calls.push(message)
          //makeCall(message.initiator);
          break;
        case 'bye':
          if (pc) {
            hangup();
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

  async function hangup() {
      //pc.close();
    for (let pc of pcs) {
      pc.close()
      pc = null
    }
    
    localStream.getTracks().forEach(track => {track.stop()});
    localStream = null;
    
    setStartButtonEnabled(true)
    setHangupButtonEnabled(false)
  };
  function createPeerConnection() {
    pcs[index] = new RTCPeerConnection();
    pcs[index].onicecandidate = e => {
      const message = {
        type: 'candidate',
        candidate: null,
        chatId: selectedChat.chatId
      };
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.sdpMid = e.candidate.sdpMid;
        message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }
      socket.emit('webrtc:message', message)
    };
    pcs[index].ontrack = e => {
      if (index === 0)
        video1.current.srcObject = e.streams[0]
        if (index === 1)
        video2.current.srcObject = e.streams[0]
        if (index === 2)
        video3.current.srcObject = e.streams[0]
        if (index === 3)
        video4.current.srcObject = e.streams[0]
        if (index === 4)
        video5.current.srcObject = e.streams[0]
        if (index === 5)
        video6.current.srcObject = e.streams[0]
    };
    localStream.getTracks().forEach(track => pcs[index].addTrack(track, localStream));
    setTimeout(()=>{
      index++
    }, 3000)
  }
  async function makeCall(initiator) {
    await createPeerConnection();

    const offer = await pcs[index].createOffer();
    socket.emit('webrtc:message', { type: 'offer', sdp: offer.sdp, chatId: selectedChat.chatId, initiator, responder: socket.id })
    await pcs[index].setLocalDescription(offer);
  }

  async function handleOffer(offer) {
    if (index >= pcs.length) {
      console.error('existing peerconnection');
      return;
    }
    console.log('got offer')

    await createPeerConnection();
    await pcs[index].setRemoteDescription(offer);

    const answer = await pcs[index].createAnswer();
    socket.emit('webrtc:message', { type: 'answer', sdp: answer.sdp, chatId: selectedChat.chatId, responder: offer.responder })
    await pcs[index].setLocalDescription(answer);
  }

  async function handleAnswer(answer) {
    if (!pcs[index]) {
      console.error('no peerconnection');
      return;
    }
    console.log('got answer')
    console.log(index)
    await pcs[index].setRemoteDescription(answer);
  }

  async function handleCandidate(candidate) {
    if (!pcs[index]) {
      console.error('no peerconnection with index:' + index);
      return;
    }
    console.log(index);
    if (!candidate.candidate) {
      await pcs[index].addIceCandidate(null);
    } else {
      await pcs[index].addIceCandidate(candidate);
    }
    lock = false
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
    hangup();
    socket.emit('webrtc:message', { type: 'bye', chatId: selectedChat.chatId })
  };

  return (
    <div>
      <video id="localVideo" ref={localVideo} playsInline={true} autoPlay={true} muted></video>
      <video ref={video1}  id='video1' playsInline={true} autoPlay={true}></video>
      <video ref={video2}  id='video2' playsInline={true} autoPlay={true}></video>
      <video ref={video3}  id='video3' playsInline={true} autoPlay={true}></video>
      <video ref={video4}  id='video4' playsInline={true} autoPlay={true}></video>
      <video ref={video5}  id='video5' playsInline={true} autoPlay={true}></video>
      <video ref={video6}  id='video6' playsInline={true} autoPlay={true}></video>

      <div className="box">
        <button  disabled={!startButtonEnabled} id="startButton" onClick={startButtonClick}>Start</button>
        <button disabled={!hangupButtonEnabled}  onClick={hangupButtonClick} id="hangupButton">Hang Up</button>
      </div>

    </div>
  );
}
