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
  const [callType, setCallType] = useState("video"); // Default to video call
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isRinging, setIsRinging] = useState(false);

  const profileImage = sessionStorage.getItem("profile");
  const username = sessionStorage.getItem("name");
  const userId = sessionStorage.getItem("id");
  const [searchQuery, setSearchQuery] = useState("");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const ringingAudioRef = useRef(new Audio("/callingsound.mp3")); // Path to ringing sound

  // Initialize socket and set up event listeners
  useEffect(() => {
    const socketInstance = io("https://backfile-h9t9.onrender.com", {
      transports: ["websocket"],
    });

    socketInstance.emit("register_user", userId); // Register user with the server

    // Handle incoming call event from server
    socketInstance.on("call_user", (data) => {
      console.log("Incoming call:", data);
      setIncomingCall(data); // Store the incoming call details
      setIsRinging(true); // Show ringing state
      ringingAudioRef.current.play().catch((err) => console.error("Audio play error:", err)); // Play the ringing sound
    });

    // Handle call acceptance
    socketInstance.on("accept_call", (data) => {
      const { answer } = data;
      if (peerConnection && answer) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        setIsInCall(true); // Set the call as active after accepting
      }
    });

    // Handle ICE candidate exchange
    socketInstance.on("ice_candidate", (candidate) => {
      if (peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Handle call end event
    socketInstance.on("end_call", () => handleEndCall());

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [selectedUser, userId, peerConnection]);

  const fetchMessages = async (selected) => {
    try {
      const response = await axios.get(
        `https://backfile-h9t9.onrender.com/api/messages/chat/${userId}/${selected._id}`
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

  const initializePeerConnection = () => {
    const peer = new RTCPeerConnection();
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          candidate: event.candidate,
          receiverId: selectedUser._id,
        });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStream((prevStream) => {
        const newStream = prevStream || new MediaStream();
        newStream.addTrack(event.track);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = newStream;
        }
        return newStream;
      });
    };

    setPeerConnection(peer);
    return peer;
  };

  // Start the call (send offer)
  const startCall = (receiverId) => {
    setIsCalling(true);

    const mediaConstraints = { video: true, audio: true };

    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peer = initializePeerConnection();
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));

        peer.createOffer().then((offer) => {
          peer.setLocalDescription(offer);
          socket.emit("call_user", {
            receiverId,
            callerId: userId,
            offer,
            callType: "video", // Always video call
            callerName: username,
          });
        });
      })
      .catch((err) => console.error("Error accessing media devices:", err));
  };

  // Accept the incoming call
  const handleAcceptCall = () => {
    if (incomingCall) {
      const { offer, callerId, callType } = incomingCall;
      setCallType(callType);
      setIncomingCall(null);
      setIsRinging(false);
      ringingAudioRef.current.pause();

      const peer = initializePeerConnection();
      peer.setRemoteDescription(new RTCSessionDescription(offer));

      const mediaConstraints = { video: true, audio: true };

      navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then((stream) => {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          stream.getTracks().forEach((track) => peer.addTrack(track, stream));

          peer.createAnswer().then((answer) => {
            peer.setLocalDescription(answer);
            socket.emit("accept_call", {
              callerId,
              receiverId: userId,
              answer,
            });
          });
        })
        .catch((err) => console.error("Error accessing media devices:", err));
    }
  };

  // End the call
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
    setIsInCall(false);
    setIsCalling(false);
    setIsRinging(false);
    socket.emit("end_call", {
      receiverId: selectedUser?._id,
      callerId: userId,
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
    <div className="container chat-component">
      {/* Chat UI */}
      <div className="row">
        {/* User List */}
        <div className="col-lg-4 col-md-3 user-list">
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
                  <button className="btn btn-primary ms-2" onClick={() => startCall(selectedUser._id)}>Video Call</button>
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
              <video ref={localVideoRef} autoPlay muted></video>
              <video ref={remoteVideoRef} autoPlay></video>
            </>
          ) : (
            <div className="chat-placeholder text-center">
              <h4>Select a user to start chatting</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
