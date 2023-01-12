require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SocketServer = require("./socketServer");
const { ExpressPeerServer } = require("peer");
const path = require("path");

const app = express();
app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// Socket
const httpsocket = require("http").createServer(app);
const io = require("socket.io")(httpsocket,{
  cors: {
      origin: "*",
  }});

io.on("connection", (socket) => {
  SocketServer(socket);
});

// Create peer server
ExpressPeerServer(http, { path: "/" });
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Routes
app.use("/api", cors(),require("./routes/authRouter"));
app.use("/api",cors(), require("./routes/userRouter"));
app.use("/api",cors(), require("./routes/postRouter"));
app.use("/api",cors(), require("./routes/commentRouter"));
app.use("/api",cors(), require("./routes/notifyRouter"));
app.use("/api",cors(), require("./routes/messageRouter"));
app.use("/api",cors(), require("./routes/ecommerRouter"));

const URI = process.env.MONGODB_URL;

mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongodb");
  }
);



if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}


const port = process.env.PORT || 3000 ;
http.listen(port, () => {
  console.log("Server is running on port", port);
});
