import { useEffect, useState } from "react";
import { socket } from "../../socket";

let localStream = null

export default function Call(props) {

  let { chatId, event, callbackWhenUserLeaves, updateStreams, callbackWhenCallStarts, callbackWhenCallStops, setIsCallRunning, setLocalStreamInfos } = props

  let [pcs, setPcs] = useState({})

  useEffect(()=>{
    switch(event) {
      case 'startCall':
        startButtonClick()
        break;
      case 'stopCall':
        hangupButtonClick()
        break;
      default:
        break;
    }
  }, [event])

  useEffect(() => {
    // recuperer la liste des DM de l'utilisateur courant
    socket.on('webrtc:message', (message) => {
      if (!localStream) {
        console.log('not ready yet');
        return;
      }
      if (message.chatId != chatId)
        return

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
          makeCall(message);
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
  }, [])

  async function hangup(leaver) {

    if (leaver == null) {
      for (const key of Object.keys(pcs)) {
        pcs[key].close()
      }
      pcs = {}
      setPcs({})
      localStream.getTracks().forEach(track => {track.stop()});
      localStream = null;
 
      callbackWhenCallStops()

      return
    }
    callbackWhenUserLeaves(leaver)

    pcs[leaver].close();
    delete pcs[leaver]
    setPcs({...pcs})
    if (Object.keys(pcs).length === 0) {
      localStream.getTracks().forEach(track => {track.stop()});
      localStream = null;
      callbackWhenCallStops()

    }
  };
  function createPeerConnection(peer, userId) {
    pcs[peer] = new RTCPeerConnection({});
    pcs[peer].onicecandidate = e => {
      const message = {
        type: 'candidate',
        candidate: null,
        chatId,
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

      let streams = {}
      streams[peer] = e.streams[0];
      
      updateStreams({
        peer,
        userId,
        stream: e.streams[0], 
        video: streams[peer].getVideoTracks().length > 0 ? true : false, 
        audio: streams[peer].getVideoTracks().length > 0 ? true : false
      })
    };
    localStream.getTracks().forEach(track => pcs[peer].addTrack(track, localStream));
    setPcs({...pcs})
  }

  async function makeCall({initiator, userId}) {
    await createPeerConnection(initiator, userId);

    const offer = await pcs[initiator].createOffer();
    socket.emit('webrtc:message', { type: 'offer', sdp: offer.sdp, chatId, initiator, responder: socket.id })
    await pcs[initiator].setLocalDescription(offer);
  }

  async function handleOffer(offer) {

    const {initiator, responder, userId} = offer
    console.log('got offer from responder:' + responder)

    await createPeerConnection(responder, userId);
    await pcs[responder].setRemoteDescription(offer);

    const answer = await pcs[responder].createAnswer();
    socket.emit('webrtc:message', { type: 'answer', sdp: answer.sdp, chatId, responder, initiator })
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
      let mediaStreamConstraints
      try {
        mediaStreamConstraints = { audio: true, video: { width: 150, height: 150 } }
        localStream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
        setLocalStreamInfos(mediaStreamConstraints)
      } catch (e) {
        console.log(e)
        mediaStreamConstraints = { video: false, audio: true }
        localStream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
        setLocalStreamInfos(mediaStreamConstraints)

      }
    }
    callbackWhenCallStarts(localStream)
    setIsCallRunning(true)


    socket.emit('webrtc:message', { type: 'ready', chatId, initiator: socket.id });
  }

  const hangupButtonClick = async function () {
    hangup(null);
    socket.emit('webrtc:message', { type: 'bye', chatId, leaver: socket.id })
  };
}
