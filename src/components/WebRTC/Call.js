import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../authContext";
import { socket } from "../../socket";

export default function Call(props) {

  let { selectedChat } = props
  let startButton = useRef(null);
  let hangupButton = useRef(null);
  let localVideo = useRef(null);
  let remoteVideo = useRef(null);

  let [localStream, setLocalStream] = useState(null)
  let [pc, setPc] = useState(null)

  console.log(selectedChat)

  useEffect(() => {
    // recuperer la liste des DM de l'utilisateur courant
    socket.on('webrtc:message', (message) => {
      if (!localStream) {
        console.log('not ready yet');
        return;
      }
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
          if (pc) {
            console.log('already in call, ignoring');
            return;
          }
          makeCall();
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
  }, [])

  async function hangup() {
    if (pc) {
      pc.close();
      pc = null
      setPc(null)
    }
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
    setLocalStream(null)
    startButton.current.disabled = false;
    hangupButton.current.disabled = true;
  };
  function createPeerConnection() {
    pc = new RTCPeerConnection();
    setPc(new RTCPeerConnection())
    pc.onicecandidate = e => {
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
    pc.ontrack = e => remoteVideo.current.srcObject = e.streams[0];
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  }
  async function makeCall() {
    await createPeerConnection();

    const offer = await pc.createOffer();
    socket.emit('webrtc:message', { type: 'offer', sdp: offer.sdp, chatId: selectedChat.chatId })
    await pc.setLocalDescription(offer);
  }

  async function handleOffer(offer) {
    if (pc) {
      console.error('existing peerconnection');
      return;
    }
    await createPeerConnection();
    await pc.setRemoteDescription(offer);

    const answer = await pc.createAnswer();
    socket.emit('webrtc:message', { type: 'answer', sdp: answer.sdp, chatId: selectedChat.chatId })
    await pc.setLocalDescription(answer);
  }

  async function handleAnswer(answer) {
    if (!pc) {
      console.error('no peerconnection');
      return;
    }
    await pc.setRemoteDescription(answer);
  }

  async function handleCandidate(candidate) {
    if (!pc) {
      console.error('no peerconnection');
      return;
    }
    if (!candidate.candidate) {
      await pc.addIceCandidate(null);
    } else {
      await pc.addIceCandidate(candidate);
    }
  }


  const startButtonClick = async function () {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    setLocalStream(localStream)
    localVideo.current.srcObject = localStream;


    startButton.current.disabled = true;
    hangupButton.current.disabled = false;

    socket.emit('webrtc:message', { type: 'ready', chatId: selectedChat.chatId });
  }

  const hangupButtonClick = async function () {
    hangup();
    socket.emit('webrtc:message', { type: 'bye', chatId: selectedChat.chatId })
  };

  return (
    <div>
      <video id="localVideo" ref={localVideo} playsInline={true} autoPlay={true} muted></video>
      <video id="remoteVideo" ref={remoteVideo} playsInline={true} autoPlay={true}></video>
      <div className="box">
        <button ref={startButton} id="startButton" onClick={startButtonClick}>Start</button>
        <button disabled={true} ref={hangupButton} onClick={hangupButtonClick} id="hangupButton">Hang Up</button>
      </div>

    </div>
  );
}
