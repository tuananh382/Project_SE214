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
const nameplayer = [];
var checkroom = 1;
var checkplayer = 1;
var pos;
socketIo.on("connection", (socket) => {
  socket.emit("getId", socket.id);
  socket.on("joinroom", function(roomname) {
    for(let i = 0; i <nameplayer.length;i++)
    {
      if(nameplayer[i] == roomname[1])
        checkplayer = 0
      else if (roomname[1] == "")
        checkplayer = 2
    }
    if(checkplayer == 0)
    {
      socket.join("samename")
      socketIo.to("samename").emit("same", "Username was created")
      checkplayer = 1
    }
    // else if(checkplayer == 2)
    // {
    //   socket.join("samename")
    //   socketIo.to("samename").emit("same", "Username dosen't null")
    //   checkplayer = 1
    // }
    else 
    {
      for(let i=0; i < roomplayer.length ;i=i+3) {
        if(roomname[0] == roomplayer[i])
          {
            checkroom = 0;
            pos = i
          }
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
          nameplayer.push(roomname[1])
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
              nameplayer.push(roomname[1])
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
          checkroom = 1
         }    
    }
    
  //Go out
  socket.on("goout", data => {
    socketIo.to(roomname[0]).emit("sendgoout", data)
  })
  //Chat
  socket.on("send", data => {
    socketIo.to(roomname[0]).emit("sendtext", data)
  })
  //reload
  socket.on("reload", data => {
    delete roomplayer[data[0]]
    delete roomplayer[data[0] + 1]
    delete roomplayer[data[0] + 2]
    delete nameplayer[data[1]]
  })
    });
})
socketIo.on("disconnect", () => {
    console.log("Client disconnected");
  })
server.listen(3000, () => {
    console.log('Server đang chay tren cong 3000');
})