import img from "../public/image.png";
import "../public/CSS/App.css";
import React, { useEffect, useState } from "react";

import { trackPromise, usePromiseTracker } from "react-promise-tracker";

import { makeFileObject } from "./Utils/filemaker";

import { Box, Typography } from "@mui/material"

//* Components
import EditProfile from "./User/editProfile";
import Messages from "./Chat/Messages";
import Peers from "./Chat/Peers";
import Channels from "./Chat/Channels";

//* Hooks
import { useName, useChannels, useWeb3 } from "./Hooks/appHooks";
import { textAlign } from "@mui/system";

function App({ profile, readProfile, haveAccount }) {
  //* Current message that displays in textarea
  const [value, setValue] = useState("Hello World!");

  //* Your current message that you've just sent
  const [message, setMessage] = useState({});

  //* List of connected peers
  const [peers, setPeers] = useState([]);
  const [channel, setChannel] = useState("example_topic");
  const [channels, setChannels] = useChannels(echo);

  //* Web3 stuff
  const [ipfs, web3, id, username, setUsername, color] = useWeb3(
    setChannels,
    echo
  );

  //* Ethereum wallet
  const [account] = useName(web3);

  //BasicProfile

  //* Color of your username that displays in chat

  //* callback when someone publishi in channel
  function echo(msg) {
    //* We have date here, but we don't use it now
    const d = new Date();
    let time = d.getTime();

    //* This is the way that we can read message from ipfs
    if (Buffer(msg.data).toString().length) {
      //* We are storing stringified JSON in message
      const message = JSON.parse(Buffer(msg.data).toString());
      //* Change message from state
      setMessage({
        username: message.username,
        message: message.value,
        color: message.color,
        channel: message.channel,
        time,
      });
    }
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //* Publich message to channel
    await ipfs.pubsub.publish(
      "example_topic",
      //* As I sad - stringified JSON

      profile.name ? ( JSON.stringify({
        username : profile.name,
        value,
        color,
        channel,
      }) ) : (
        JSON.stringify({
          username : `anonymous(${username})`,
          value,
          color,
          channel,
        })
      )
    );
  };

  return (
    <>
      <Box className="App" display="grid" gridTemplateColumns="repeat(12, 1fr)" >

        <Box className="NavBar" gridColumn="span 12" p={3} sx={{
          border: "1px solid black"
        }}>
          <Typography variant="h4">
            Sytime
          </Typography>

        </Box>

        <Box className="LeftSide" gridColumn="span 3" sx={{
          display: "flex",
          flexDirection: "column"
        }}>
          <Box className="logo">
            <img src={img} className="App-logo" alt="logo" />
          </Box>

          <Box className="Channels" sx={{
            maxHeight:"10vw",
            overflow:"auto"
          }}>
          <Channels
            channels={channels}
            currentChannel={channel}
            self={id}
            ipfs={ipfs}
            setChannel={setChannel}
          />
          </Box>
          <Box className="Peers" sx={{
            overflow:"auto"
          }}>
            <Peers
            peers={peers}
            id={id}
            self={username}
            ipfs={ipfs}
            color={color}
            echo={echo}
            setChannels={setChannels}
            />
          </Box>
        </Box>

        <Box className="ChatArea" gridColumn="span 9" sx={{
          display: "flex",
          flexDirection: "column"
        }}>
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)">
            <Box className="Chat" gridColumn="span 7" sx={{
              minHeight: "20vw",
              maxHeight:"40vw",
              overflow:"auto",
              border: "1px solid black",
              textAlign:"left"
            }}>
              <Messages
                channel={channel}
                message={message}
                ipfs={ipfs}
                setPeers={setPeers}
              />
            </Box>

          <Box className="profile" p={2} gridColumn="span 5" sx={{
            overflow:"auto"
          }}>
          <p>
              Simple test <code>ipfs-pubsub</code> with changing doc.
            </p>
            <p>Your wallet: {account}</p>
            <p>Your peer id: {id}</p>
            {haveAccount ? (
              <>
                <p>Your Profile Name: {profile.name}</p>
                <p>
                  Your Profile avatar: <img alt="avatar" src={profile.avatar} />
                </p>
                <p>Your Profile description: {profile.description}</p>
              </>
            ) : (
              <>
                <p> No Account connected</p>
              </>
            )}
            <EditProfile
              readProfile={readProfile}
              haveAccount={haveAccount}
              profile={profile}
            />
          </Box>

          </Box>
          <Box className="input" p={3} sx={{
            minHeight: "10vw",
            border: "1px solid black",
            textAlign:"left"
          }}>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  style={{ height: "20px" }}
                  type="text"
                  value={username}
                  onChange={handleChangeUsername}
                />
              </label>
              <br></br>
              Message:
              <input
                style={{ width: "75%", height: "30px" }}
                id="textfield"
                onChange={handleChange}
                value={value}
                type="text"
              />
              <button style={{ height: "30px" }}>Send message</button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
