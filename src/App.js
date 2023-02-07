
import { useState } from 'react';
import './App.css';
import React, { useRef, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import { hover } from '@testing-library/user-event/dist/hover';
const host = "http://localhost:3000";




function App() {
  //audio
  var clickbtn = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-casino-notification-211.mp3")
  var hoverbtn = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-click-900.mp3")
  const Ref = useRef(null);
  const [timer, setTimer] = useState('20:00');
  const [winner, setWinner] = useState(false)
  const [size, setSize] = useState(20)
  const [win, setWin] = useState(false)
  const [state, setState] = useState({
    player: "x",
    winner: null,
    data: new Array,
  });
  const messenger = []
  const [text, setText] = useState();
  const [myname, setMyname] = useState();
  const [id, setId] = useState();
  const [idclient, setIdclient] = useState();
  const [yourname, setYourname] = useState("");
  const [roomname, setRoomname] = useState(0);
  const [playgame, setPlaygame] = useState("no")
  const [note, setNote] = useState()
  const [notification, setNotification] = useState()
  const [shownoti, setShownoti] = useState("yes")
  const [mess, setMess] = useState();
  var pos;
  const buttons = new Array(0)
  for (let i = 1; i <= (size * size); i++) {
    buttons.push(i);
  }
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = socketIOClient.connect(host)
    socketRef.current.on('getId', data => {
      setIdclient(data)
      socketRef.current.emit('sendIdClient', data);
    })
    socketRef.current.on('sendIdServer', ids => {
      if (idclient != ids) { setId(ids) }
    }
    )
    socketRef.current.on('sendDataServer', dataGot => {
      setState(dataGot.data)
    })
  //   socketRef.current.on("sendtext", data => {
  //     messenger.push(data)
  // })
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (state !== null) {
      const msg = state
      socketRef.current.emit('sendDataClient', msg);
    }
  }
  function buttonclick(x) {
    if (id != idclient) {
      if (state.data[x] == null) {
        state.data[x] = state.player;
        state.player = state.player === "x" ? "o" : "x";
        setState({
          ...state,
          player: state.player,
          data: state.data,
        });
        sendMessage()
        pos = x;
        checkWin(pos);
        // console.log(win)
        // addarea(x);
        setturn();
        checkWinner(win)
      }
    };
  }
  function setturn() {
    socketRef.current.emit('sendIdClient', idclient);
  }
  function checkWinner(win) {
    if (win == true) {
      socketRef.current.emit("sendWinClient", win)
    }
    socketRef.current.on("sendWinSever", win => {
      setWinner(win)
    })
  }
  // function addarea(x) {
  //   const arr = new Array
  //   for (i = 1; i <= size; i++)
  //     arr.push(i);
  //   for (i = size + 1; i <= size * (size - 1) + 1; i = size + i)
  //     arr.push(i);
  //   for (i = 2 * size; i <= size * size; i = i + size)
  //     arr.push(i);
  //   for (i = size + 2; i < size * size; i++)
  //     arr.push(i);
  //   for (i = 1; i <= size * (size - 4); i++) {
  //     if (state.data[x] == arr[i])
  //       setSize(size + 5);
  //   }
  // }
  function checkWin(pos) {
    var addleft = 0, addright = 0, addup = 0, adddown = 0, addcheoup = 0, addcheodown = 0, addngcup = 0, addngcdown = 0;
    for (let i = 1; i <= 5; i++) {
      if (state.data[pos] == state.data[pos - i]) {
        addleft++;
      }
      else
        break;
    }
    for (let i = 1; i <= 5; i++) {
      if (state.data[pos] == state.data[i + pos]) {
        addright++;
      }
      else
        break;
    }
    for (let i = 1; i <= 5; i++) {
      if (state.data[pos] == state.data[i * size + pos]) {
        addup++;
      }
      else
        break;
    }
    for (let i = 1; i <= 5; i++) {
      if (state.data[pos] == state.data[pos - size * i]) {
        adddown++;
      }
      else
        break;
    }
    for (let i = 1; i <= 5; i++) {
      if (state.data[pos] == state.data[i * (size - 1) + pos]) {
        addcheodown++;
      }
      else
        break;
    }
    for (let i = 1; i <= 5; i++) {
      if (state.data[pos] == state.data[pos - (size - 1) * i]) {
        addcheoup++;
      }
      else
        break;
    }
    for (let i = 1; i <= 5; i++) {
      if (state.data[pos] == state.data[i * (size + 1) + pos]) {
        addngcdown++;
      }
      else
        break;
    }
    for (let i = 1; i <= 5; i++) {
      if (state.data[pos] == state.data[pos - i * (size + 1)]) {
        addngcup++;
      }
      else
        break;
    }
    var check1 = 0;
    var check2 = 0;
    if (state.data[pos] == "x") {
      if (addright + addleft >= 3) {
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos + (i + addright)] == "o")
            check1++;
        }
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos - (i + addleft)] == "o")
            check2++;
        }
        if (check1 + check2 > 1) {
          setWin(false);
          check1 = 0; check2 = 0;
        }
        else
          setWin(true);
      }
      else if (addup + adddown >= 3) {
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos - (i + addup) * size] == "o")
            check1++;
        }
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos + (i + adddown) * size] == "o")
            check2++;
        }
        if (check1 + check2 > 1) {
          setWin(false);
          check1 = 0; check2 = 0;
        }
        else
          setWin(true);
      }
      else if (addcheodown + addcheoup >= 3) {
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos - (i + addcheoup) * (size + 1)] == "o")
            check1++;
        }
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos + (i + addcheodown) * (size - 1)] == "o")
            check2++;
        }
        if (check1 + check2 > 1) {
          setWin(false);
          check1 = 0; check2 = 0;
        }
        else
          setWin(true);
      }
      else if (addngcdown + addngcup >= 3) {
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos - (i + addngcup) * (size + 1)] == "o")
            check1++;
        }
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos + (i + addngcdown) * (size + 1)] == "o")
            check2++;
        }
        if (check1 + check2 > 1) {
          setWin(false);
          check1 = 0; check2 = 0;
        }
        else
          setWin(true);
      }
    }

    if (state.data[pos] == "o") {
      if (addright + addleft >= 3) {
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos + (i + addright)] == "x")
            check1++;
        }
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos - (i + addleft)] == "x")
            check2++;
        }
        if (check1 + check2 > 1) {
          setWin(false);
          check1 = 0; check2 = 0;
        }
        else
          setWin(true);
      }
      else if (addup + adddown >= 3) {
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos - (i + addup) * size] == "x")
            check1++;
        }
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos + (i + adddown) * size] == "x")
            check2++;
        }
        if (check1 + check2 > 1) {
          setWin(false);
          check1 = 0; check2 = 0;
        }
        else
          setWin(true);
      }
      else if (addcheodown + addcheoup >= 3) {
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos - (i + addcheoup) * (size + 1)] == "x")
            check1++;
        }
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos + (i + addcheodown) * (size - 1)] == "x")
            check2++;
        }
        if (check1 + check2 > 1) {
          setWin(false);
          check1 = 0; check2 = 0;
        }
        else
          setWin(true);
      }
      else if (addngcdown + addngcup >= 3) {
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos - (i + addngcup) * (size + 1)] == "x")
            check1++;
        }
        for (let i = 1; i <= (size - 5); i++) {
          if (state.data[pos + (i + addngcdown) * (size + 1)] == "x")
            check2++;
        }
        if (check1 + check2 > 1) {
          setWin(false);
          check1 = 0; check2 = 0;
        }
        else
          setWin(true);
      }
    }
  }
  function Notice() {
    // if(win == winner)
    //   socketRef.current.emit("namewin", myname)
    return (
      <div className="notification">
        {/* {clearInterval(Ref.current)} */}
        {/* <h1>{timer}</h1> */}
        <span class='glowing-txt noti'>{win === winner ? "You win" : "You lose"}</span>
          <button className='glowing-btn ok' onClick={() => { window.location.reload(true) }}>Again</button>
      </div>
      
    )
  }
  function Countdown() {
    const getTimeRemaining = (e) => {
      const total = Date.parse(e) - Date.parse(new Date());
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / 1000 / 60 / 60) % 24);
      return {
        total, hours, minutes, seconds
      };
    }


    const startTimer = (e) => {
      let { total, hours, minutes, seconds }
        = getTimeRemaining(e);
      if (total >= 0) {
        setTimer(
          (minutes > 9 ? minutes : '0' + minutes) + ':'
          + (seconds > 9 ? seconds : '0' + seconds)
        )
      }
    }
    const clearTimer = (e) => {
      setTimer('20:00');
      if (Ref.current) clearInterval(Ref.current);
      const id = setInterval(() => {
        startTimer(e);
      }, 1000)
      Ref.current = id;
    }

    const getDeadTime = () => {
      let deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 1200);
      return deadline;
    }
    const onClickReset = () => {
      clearTimer(getDeadTime());

    }
    
    return (
      <div className="countdown">
        {/* <h2>{timer}</h2>
                <button className='button-54' onClick={onClickReset}>Start</button> */}
        
      </div>
    )
  }
  return (
    <div>
      {playgame == "no" && <Signin />}
      {playgame == "yes" && <Play />}
    </div>
  );
  function clicknoti() {
    clickbtn.play()
    setShownoti("no")
  }
  function Play() {
    socketRef.current.on("yourname", function (data) {
      if (data[0] != myname)
        setYourname(data[0])
      else
        setYourname(data[1])
    })
    socketRef.current.on("full", function (data) {
      if (yourname === "") {
        setPlaygame("no")
        setNote("note")
      }
      else
        setPlaygame("yes")
    })
    socketRef.current.on("notification", function (data) {
      setNotification(data)
    })
    function goout () {
      clickbtn.play()
      socketRef.current.emit("goout", myname)
      
    }
    socketRef.current.on("sendgoout", data => {
      if(data != myname)
          {
            setWin(true)
            setWinner(true)
          }
      else 
        window.location.reload(true)
    })
    function send(data) {
      socketRef.current.emit("send", data)
    }
  
    
    return (
      <div className='main'>
        <div className='app'>
          {winner === true && <Notice />}
          {buttons.map((x, index) => <button key={index} className="button-28" onClick={() => buttonclick(x)} style={{ color: state.data[x] === "x" ? "tomato" : "skyblue" }}>{state.data[x]}  </button>)}
        </div>
        <div className='infor'>
          <div className='chair'>
            <h1 className='roomname'><span class='glowing-txt'>MA<span class='faulty-letter'>TCH</span>{roomname}</span></h1>
            <div className='player'>
              <div className='player1'>
                <div className='name'>
                  <h2><span class='glowing-txt'>Y<span class='faulty-letter'>O</span>U</span></h2>
                  <h2><span class='glowing-txt'>{myname}</span></h2>
                </div>
              </div>
              <div className='player2'>
                <div className='name'>
                <h2><span class='glowing-txt'>RI<span class='faulty-letter'>VA</span>L</span></h2>
                <h2><span class='faulty-letter'>{yourname} </span></h2>
                </div>
              </div>
            </div>
            <button className='glowing-btn goout' onMouseEnter={()=> {hoverbtn.play()}}  onClick={() => goout()}><span class='glowing-txt'>Go<span class='faulty-letter'>O</span>ut</span></button>
          </div>
          {/* <div className='chair'>
            <h2 id='chat'><span class='glowing-txt'>CH<span class='faulty-letter'>A</span>T</span></h2>
            <div id='mess-container'>
              {messenger.map(item => 
                <h1>{item[1]}</h1>
                )}
            </div>
            <form><input type="text" placeholder='.........' id='mess' name='mess'></input></form>
            <button className='glowing-btn goout' onMouseEnter={()=> {hoverbtn.play()}}  onClick={() => send([myname, document.getElementById('mess').value])}><span class='glowing-txt'>Go<span class='faulty-letter'>O</span>ut</span></button>
          </div>  */}
        </div>
        {shownoti == "yes" ? <div className='notification'><span class='glowing-txt noti'>{notification}</span>
          <button className='glowing-btn ok' onMouseEnter={()=> {hoverbtn.play()}} onClick={() => clicknoti()}>OK</button>
        </div> : ""}
      </div>
    )
  }
  function Signin() {
    function joinroom(nameroom) {
      clickbtn.play()
      setPlaygame("yes");
      setMyname(nameroom[1]);
      setRoomname(nameroom[0]);
      socketRef.current.emit("joinroom", nameroom)
      
    } 
    return (  
      <div className='box'>
        
        <form>
          <h2>{note === "note" ? "Phong day" : ""}</h2>
          <h2>{note === "note1" ? "Ten da duoc su dung" : ""}</h2>
          <div class="form-control">
            <label for="username"><span class='glowing-txt'>US<span class='faulty-letter'>ER </span>NAME</span></label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username..."
            />
          </div>
          <div class="form-control">
            <label for="room"><span class='glowing-txt'>MA<span class='faulty-letter'>TCH </span>NAME</span></label>
            <input
              type="text"
              name="room"
              id="room"
              placeholder="Enter match..."
            />
          </div>
          <button class='glowing-btn' onMouseEnter={() => {hoverbtn.play()}} onClick={() => joinroom([document.getElementById("room").value, document.getElementById("username").value])}><span class='glowing-txt'>S<span class='faulty-letter'>T</span>ART</span></button>
          {/* <button type="submit" class="button-54" onClick={() => joinroom([document.getElementById("room").value, document.getElementById("username").value])}>Join Chat</button> */}
        </form>
      </div>
    )
  }

  
}

export default App;