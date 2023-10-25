import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";

let localStream = null

export default function Call(props) {

  let { selectedChat } = props
  const [startButtonEnabled, setStartButtonEnabled] = useState(true);
  const [hangupButtonEnabled, setHangupButtonEnabled] = useState(false);

  let [pcs, setPcs] = useState({})
  let localVideo = useRef(null);

  const recipientsVideos = [useRef({}), useRef({}), useRef({}), useRef({}), useRef({}), useRef({})]

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
      setPcs({})
      localStream.getTracks().forEach(track => {track.stop()});
      localStream = null;
      setStartButtonEnabled(true)
      setHangupButtonEnabled(false)
      for (const recipient of recipientsVideos)
          delete recipient.current.peer
      
      return
    }
    for (const recipient of recipientsVideos) {
      if (recipient.current.peer === leaver) {
        delete recipient.current.peer
        break
      }
    }

    pcs[leaver].close();
    delete pcs[leaver]
    setPcs({...pcs})
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

      for (const recipient of recipientsVideos) {
        if (!recipient.current.peer || recipient.current.peer === peer) {
          recipient.current.srcObject = e.streams[0]
          recipient.current.peer = peer
          break
        }
      }
    };
    localStream.getTracks().forEach(track => pcs[peer].addTrack(track, localStream));
    setPcs({...pcs})
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
    console.log('new icecandidate')
    if (!pcs[candidate.peer]) {
      console.error('no peerconnection with initiator:' + candidate.peer);
      return;
    }
    if (!candidate.candidate) {
      await pcs[candidate.peer].addIceCandidate(null);
    } else {
      await pcs[candidate.peer].addIceCandidate(candidate);
    }
    setPcs({...pcs})
  }


  const startButtonClick = async function () {
    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: {width: 150, height: 150} });
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

  console.log(pcs)
  console.log(recipientsVideos)
  return (
    <div>
      <div>
      <video style={{display:localStream ? 'inline-block' : 'none', padding: '10px' }} id="localVideo" ref={localVideo} playsInline={true} autoPlay={true} muted></video>

      {(new Array(recipientsVideos.length)).fill(1).map((_, index) => {
        return (
          <video key={index} ref={recipientsVideos[index]}  style={{display:recipientsVideos[index].current.peer  ? 'inline-block' : 'none', padding: '10px' }} id={'video'+index} playsInline={true} autoPlay={true}></video>
        )
      })}
      </div>
      <div>
      <div className="box">
        <button  disabled={!startButtonEnabled} id="startButton" onClick={startButtonClick}>Start</button>
        <button disabled={!hangupButtonEnabled}  onClick={hangupButtonClick} id="hangupButton">Hang Up</button>
      </div>

      </div>
    </div>
  );
}
