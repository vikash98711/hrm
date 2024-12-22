import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./Chat.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { SidebarContext } from "../../../context/sidebarContext";
import { format } from "date-fns";

const Chat = () => {
  const { user } = useContext(SidebarContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState("audio"); // audio or video call
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null); // Stores incoming call info
  const [isRinging, setIsRinging] = useState(false); // Ringing status for outgoing call

  const profileImage = sessionStorage.getItem("profile");
  const username = sessionStorage.getItem("name");
  const userId = sessionStorage.getItem("id");
  const [searchQuery, setSearchQuery] = useState("");
  const localVideoRef = useRef(null); // Video ref for local stream
  const remoteVideoRef = useRef(null); // Video ref for remote stream

  useEffect(() => {
    const socketInstance = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socketInstance.emit("register_user", userId);

    socketInstance.on("receive_message", (messageData) => {
      if (messageData.receiverId === selectedUser?._id) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId: messageData.senderId, message: messageData.message },
        ]);
      }
    });

    // Incoming call event listener
    socketInstance.on("call_user", (data) => {
      console.log("Incoming call data received:", data);
      setIncomingCall(data); 
    });

    socketInstance.on("ice_candidate", (candidate) => {
      if (peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socketInstance.on("end_call", (data) => {
      if (data.receiverId === userId) {
        handleEndCall();
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [selectedUser, userId, peerConnection]);

  const fetchMessages = async (selected) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/messages/chat/${userId}/${selected._id}`
      );
      setMessages(response.data);
    } catch (err) {
      console.log("Error fetching messages:", err);
    }
  };

  const handleSelectUser = (selected) => {
    setSelectedUser(selected);
    setMessages([]);
    fetchMessages(selected);
  };

  const startCall = (callerId, type) => {
    setIsCalling(true);
    setIsRinging(true); // Start ringing status
    setCallType(type);
    // Create peer connection
    const peer = new RTCPeerConnection();
    setPeerConnection(peer);

    // Get user media (audio or video)
    const mediaConstraints = type === "video" ? { video: true, audio: true } : { audio: true };

    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((stream) => {
        setLocalStream(stream);
        const tracks = stream.getTracks();
        tracks.forEach((track) => peer.addTrack(track, stream));

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create offer and send to the receiver
        peer.createOffer().then((offer) => {
          peer.setLocalDescription(offer);
          socket.emit("call_user", {
            receiverId: callerId,
            callerId: userId,
            offer,
            callType: type,
            callerName: username,
          });
        });
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
      });
  };

  const handleAcceptCall = (callerId, callType) => {
    setIncomingCall(null); // Clear the incoming call notification
    setIsRinging(false); // Stop the ringing animation
    startCall(callerId, callType); // Proceed with the call process
  };

  const handleRejectCall = () => {
    setIncomingCall(null); // Clear the incoming call notification
    setIsRinging(false); // Stop the ringing animation
  };

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        setRemoteStream(null);
      }
      setIsInCall(false);
      setIsCalling(false);
      setIsRinging(false); // Reset ringing status when call ends
    }

    socket.emit("end_call", {
      callerId: userId,
      receiverId: selectedUser._id,
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const messageData = {
        senderId: userId,
        receiverId: selectedUser._id,
        message: newMessage,
        senderImage: profileImage,
      };

      socket.emit("send_message", messageData);

      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: userId, message: newMessage, senderImage: profileImage },
      ]);
      setNewMessage("");
    }
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
