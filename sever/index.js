var express = require('express')
const http = require("http");
const { io } = require('socket.io-client');
var app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
  });
const roomplayer = [];
var checkroom = 1;
var pos;
socketIo.on("connection", (socket) => {
  socket.emit("getId", socket.id);
  socket.on("joinroom", function(roomname) {
    for(let i=0; i < roomplayer.length ;i=i+3) {
      if(roomname[0] == roomplayer[i])
        {
          checkroom = 0;
          pos = i
        }
      else
        checkroom = 1
    }
    //Phong khong ton tai
    if(checkroom == 1)
      {
        //Tao phong
        roomplayer.push(roomname[0])       
        //Tham gia phòng
        socket.join(roomname[0]);
        roomplayer.push(roomname[1])
        roomplayer.push(0)
        //Trả lại thông báo 
        socketIo.to(roomname[0]).emit("notification", "Create Match Successful")
        socket.on("sendIdClient", ids => {
          socketIo.to(roomname[0]).emit("sendIdServer", ids );
        })
        socket.on("sendWinClient", win => {
          socketIo.to(roomname[0]).emit("sendWinSever", win)
        })
        socket.on("sendDataClient", function(data) {
          socketIo.to(roomname[0]).emit("sendDataServer", { data });
        })
      }
      // Phong ton tai
      else
       {
        if(roomplayer[pos+2] == 0)
        {     
            //Tham gia phòng
            socket.join(roomname[0]);
            roomplayer[pos + 2] = roomname[1]
            //Trả lại thông báo 
            socketIo.to(roomname[0]).emit("notification", roomname[1] + " was joined " + roomname[0]);
            //Gui ten
            const name = [roomplayer[pos+1],roomplayer[pos+2]]
            socketIo.to(roomname[0]).emit("yourname", name);
            socket.on("sendIdClient", ids => {
              socketIo.to(roomname[0]).emit("sendIdServer", ids );
            })
            socket.on("sendWinClient", win => {
              socketIo.to(roomname[0]).emit("sendWinSever", win)
            })
            socket.on("sendDataClient", function(data) {
              socketIo.to(roomname[0]).emit("sendDataServer", { data });
            })
        }
        else
          socketIo.emit("full", "Phong Day")
       }    
  //Go out
  socket.on("goout", data => {
    socketIo.to(roomname[0]).emit("sendgoout", data)
  })
  //Chat
  socket.on("send", data => {
    socketIo.to(roomname[0]).emit("sendtext", data)
  })
    });
})
socketIo.on("disconnect", () => {
    console.log("Client disconnected");
  })
server.listen(3000, () => {
    console.log('Server đang chay tren cong 3000');
})