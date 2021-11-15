import img from "../public/image.png";
import "../public/CSS/App.css";
import Peer from "./User/Peer";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";

//* node and _web3 is promises now, because we can't
//* await them in different file :(
//* check getWeb3.js and ipfs.js
import node from "../decent_network/ipfs";
import _web3 from "../decent_network/getWeb3";
import React, { useEffect, useState } from "react";

function App() {
  //^ Promise Tracker Attempt

  const { promiseInProgress } = usePromiseTracker(node);
  //* Current message that displays in textarea
  const [value, setValue] = useState("Hello World!");

  //* List of all messages
  const [messages, setMessages] = useState([]);

  //* Your current message that you've just sent
  const [message, setMessage] = useState({});

  //* ipfs node
  const [ipfs, setIpfs] = useState(null);

  //* connection to wallet via web3
  const [web3, setWeb3] = useState(null);

  const [username, setUsername] = useState("");

  //* List of connected peers
  const [peers, setPeers] = useState([]);
  const [id, setId] = useState("");

  //* Ethereum wallet
  const [account, setAccount] = useState(
    "You are not connected to your ethereum wallet"
  );

  //* Color of your username that displays in chat
  const [color, setColor] = useState(
    Math.floor(Math.random() * 16777215).toString(16)
  );

  useEffect(() => {
    (async () => {
      const _ipfs = await node;

      //* setting global state
      setIpfs(await _ipfs);
      setWeb3(await _web3);
      setId((await _ipfs.id()).id);

      //* callback that calls every time a message thrown in chat
      async function echo(msg) {
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
            time,
          });
        }

        //* I know - it's bad sync all peers every time message is thrown
        //* It's just for now
        setPeers([...peers, (await _ipfs.pubsub.peers("example_topic"))[0]]);
        //* It will not display you on your end (idk why)
      }

      //* Subscribe your browser to topic
      await _ipfs.pubsub.subscribe("example_topic", echo);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (ipfs && id) {
        await ipfs.pubsub.subscribe(id, () => {
          console.log("something");
        });
      }
    })();
  }, [ipfs, id]);
  //* Setting up Ethereum wallet
  useEffect(() => {
    (async () => {
      if (web3) {
        setAccount((await web3.eth.getAccounts())[0]);
        setUsername((await web3.eth.getAccounts())[0]);
      }
    })();
  }, [web3]);

  //* Updating local messages list every time message changes
  useEffect(() => {
    (async () => {
      if (message.message) {
        setMessages([
          ...messages,
          {
            message: message.message,
            username: message.username,
            color: message.color,
          },
        ]);
      }
    })();
  }, [message]);

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
      JSON.stringify({ username, value, color })
    );
  };

  console.log(peers);
  return (
    <div className="App">
      <img src={img} className="App-logo" alt="logo" />
      <p>
        Simple test <code>ipfs-pubsub</code> with changing doc.
      </p>
      <p>Your wallet: {account}</p>
      <p>Your peer id: {id}</p>
      {/* <h1>{me}</h1> */}
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h3>Messages</h3>
          <ul>
            {messages.map((message, key) => {
              return (
                <div key={key}>
                  <span style={{ color: `#${message.color}` }}>
                    {message.username}
                  </span>
                  : {message.message}
                </div>
              );
            })}
          </ul>
        </div>
        <div>
          <h3>Peers</h3>
          <ul>
            {peers.map((peer, key) => {
              return (
                <div key={key}>
                  <Peer peer={peer} self={id} ipfs={ipfs} />
                </div>
              );
            })}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={username} onChange={handleChangeUsername} />
        </label>
        <textarea
          style={{ width: "100%", height: "500px" }}
          id="textfield"
          onChange={handleChange}
          value={value}
        ></textarea>
        <button>Send message</button>
      </form>
    </div>
  );
}

export default App;