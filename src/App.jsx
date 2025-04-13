import { useState, useEffect, useRef } from 'react';
import { Peer } from 'peerjs';

function App() {
  const [roomId, setRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Initialize PeerJS
  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', (peerId) => {
      console.log('PeerJS ID:', peerId);
    });

    // Handle incoming calls (for the creator)
    peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream); // Answer the call
          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            setIsCallActive(true);
          });
        });
    });

    return () => peer.destroy();
  }, []);

  const createRoom = () => {
    const id = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomId(id);
  };

  const joinRoom = () => {
    if (!inputRoomId) return;
    setRoomId(inputRoomId);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        // Call the creator's PeerJS ID (not the room ID)
        const call = peerRef.current.call(inputRoomId, stream); // BUG: Needs creator's PeerJS ID
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsCallActive(true);
        });
      });
  };

  return (
    <div className="app">
      {!roomId ? (
        <div className="home">
          <button onClick={createRoom}>Create Room</button>
          <div className="join-section">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
        </div>
      ) : (
        <div className="room">
          <h3>Room ID: {roomId}</h3>
          <div className="video-container">
            <video ref={localVideoRef} autoPlay playsInline muted></video>
            {isCallActive ? (
              <video ref={remoteVideoRef} autoPlay playsInline></video>
            ) : (
              <p>Waiting for connection...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;