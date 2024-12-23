import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { SidebarContext } from "../../../context/sidebarContext";
import "./Chat.css";

const Chat = () => {
  const { user } = useContext(SidebarContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const userId = sessionStorage.getItem("id");

  useEffect(() => {
    const socketInstance = io("https://backfile-h9t9.onrender.com", {
      transports: ["websocket"],
    });

    socketInstance.emit("register_user", userId);

    socketInstance.on("receive_message", (messageData) => {
      if (messageData.receiverId === selectedUser?._id) {
        setMessages((prev) => [
          ...prev,
          { senderId: messageData.senderId, message: messageData.message },
        ]);
      }
    });

    socketInstance.on("call_user", (data) => {
      console.log("Incoming call:", data);
      setIncomingCall(data);
    });

    socketInstance.on("accept_call", (data) => {
      peerConnection
        .setRemoteDescription(new RTCSessionDescription(data.answer))
        .catch((err) => console.error("Error setting remote description:", err));
    });

    socketInstance.on("ice_candidate", (candidate) => {
      if (peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socketInstance.on("end_call", () => {
      handleEndCall();
    });

    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, [selectedUser, userId, peerConnection]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user);
  };

  const fetchMessages = async (user) => {
    try {
      const res = await axios.get(
        `https://backfile-h9t9.onrender.com/api/messages/chat/${userId}/${user._id}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const messageData = {
      senderId: userId,
      receiverId: selectedUser._id,
      message: newMessage,
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  const startCall = async (receiverId, type) => {
    setIsCalling(true);

    const peer = new RTCPeerConnection();
    setPeerConnection(peer);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });

      setLocalStream(stream);
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("call_user", {
        receiverId,
        callerId: userId,
        offer,
        callType: type,
      });

      peer.ontrack = (event) => {
        const remoteStream = new MediaStream();
        event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice_candidate", {
            candidate: event.candidate,
            receiverId,
          });
        }
      };
    } catch (err) {
      console.error("Error starting call:", err);
    }
  };

  const acceptCall = async (callerId, offer) => {
    const peer = new RTCPeerConnection();
    setPeerConnection(peer);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: incomingCall.callType === "video",
      });

      setLocalStream(stream);
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("accept_call", {
        callerId,
        receiverId: userId,
        answer,
      });

      peer.ontrack = (event) => {
        const remoteStream = new MediaStream();
        event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice_candidate", {
            candidate: event.candidate,
            receiverId: callerId,
          });
        }
      };
    } catch (err) {
      console.error("Error accepting call:", err);
    }

    setIncomingCall(null);
  };

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    setIsCalling(false);
    setIncomingCall(null);
    socket.emit("end_call", { callerId: userId, receiverId: selectedUser?._id });
  };

  return (
    <>
      <div className="container chat-component">
        <div className="row">
          {/* User List */}
          <div className="col-lg-4 col-md-3 user-list">
            {/* User Profile & Search */}
            <div className="d-flex align-items-center justify-content-between p-3 mb-3" style={{ backgroundColor: '#3b2895ba' }}>
              <h4 className="text-white"><i className="fa-regular fa-circle-user"></i> {username}</h4>
              <div className="profile-container">
                {profileImage ? (
                  <div className="image-with-icon">
                    <img src={profileImage} className="user-avatar ms-3" alt="User" />
                    <span className="online-icon"></span>
                  </div>
                ) : (
                  <div className="no-image-found ms-3">No image found</div>
                )}
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ul className="list-group">
              {user.filter(value => value.firstName.toLowerCase().includes(searchQuery.toLowerCase()) && value._id !== userId).map(value => (
                <li
                  key={value._id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${selectedUser?._id === value._id ? "active" : ""}`}
                  onClick={() => handleSelectUser(value)}
                  style={{ cursor: "pointer", border: "none" }}
                >
                  <div className="d-flex align-items-center">
                    <img src={value.profileImage.url} alt={value.firstName} className="user-avatar me-3" />
                    <span>{value.firstName}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Window */}
          <div className="col-lg-8 col-md-9 chat-window">
            {selectedUser ? (
              <>
                <div className="chat-header d-flex align-items-center">
                  <img src={selectedUser.profileImage.url} alt="No image Found" className="user-avatar me-3" />
                  <h5 className="text-primary m-0">Chat with {selectedUser.firstName}</h5>
                  <div className="call-buttons ms-auto">
                    <button className="btn btn-primary" onClick={() => startCall(selectedUser._id, "audio")}>Audio Call</button>
                    <button className="btn btn-primary ms-2" onClick={() => startCall(selectedUser._id, "video")}>Video Call</button>
                  </div>
                </div>
                <div className="chat-body">
                  {messages.map((msg, index) => (
                    <div key={index} className={`chat-bubble ${msg.senderId === userId ? "sent" : "received"}`}>
                      <img src={msg.senderId === userId ? profileImage : msg.senderImage} alt="Avatar" className="chat-avatar" />
                      <div className="chat-text">{msg.message}</div>
                      <div className="chat-timestamp ms-3">
                        {msg.timestamp ? format(new Date(msg.timestamp), "dd MMM yyyy, hh:mm a") : "Invalid Date"}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="chat-footer d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button className="btn btn-success" onClick={handleSendMessage}>Send</button>
                </div>
              </>
            ) : (
              <div className="chat-placeholder text-center">
                <h4>Select a user to start chatting</h4>
              </div>
            )}
          </div>
        </div>

        {/* Audio/Video Call Controls */}
        {(isInCall || isCalling || isRinging) && (
          <div className="call-controls position-fixed top-0 end-0 p-3" style={{ zIndex: '9999' }}>
            {isRinging && <span>Ringing...</span>}
            <button className="btn btn-danger" onClick={handleEndCall}>End Call</button>
          </div>
        )}

        {/* Incoming Call Modal */}
        {incomingCall && (
          <div className="incoming-call-modal">
            <p>{incomingCall.callerName} is calling you!</p>
            <button className="btn btn-success" onClick={() => handleAcceptCall(incomingCall.callerId, incomingCall.callType)}>Accept</button>
            <button className="btn btn-danger" onClick={handleRejectCall}>Reject</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
