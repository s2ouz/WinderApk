require("dotenv").config();
const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const cors       = require("cors");
const { supabase } = require("./middleware/auth");

const app    = express();
const server = http.createServer(app);

// ─── CORS ─────────────────────────────────────────────────────────
// CLIENT_ORIGIN env'ine virgülle ayrılmış liste verilebilir
const allowedOrigins = [
  ...( process.env.CLIENT_ORIGIN || "http://localhost:3456" ).split(",").map(s => s.trim()),
  "http://localhost:3456",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "null",
];

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}));
app.use(express.json());

// ─── REST ROUTES ──────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/jobs",     require("./routes/jobs"));
app.use("/api/matches",  require("./routes/matches"));
app.use("/api/messages", require("./routes/messages"));

app.get("/health", (_, res) => res.json({ ok: true, ts: new Date() }));

// ─── SOCKET.IO ────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Socket bağlandı:", socket.id);

  socket.on("auth", async ({ token }) => {
    if (!token) return socket.disconnect();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return socket.disconnect();
    socket.userId = data.user.id;
    onlineUsers.set(socket.userId, socket.id);
    socket.emit("auth:ok", { userId: socket.userId });
    console.log("✅ Auth:", socket.userId);
  });

  socket.on("join:match", (matchId) => {
    socket.join(`match:${matchId}`);
    console.log(`📬 ${socket.userId} → match:${matchId}`);
  });

  socket.on("message:send", async ({ matchId, content }) => {
    if (!socket.userId || !content?.trim()) return;

    const { data: msg, error } = await supabase
      .from("messages")
      .insert({
        match_id:    matchId,
        sender_id:   socket.userId,
        sender_type: "user",
        content:     content.trim(),
      })
      .select()
      .single();

    if (error) { socket.emit("message:error", { error: error.message }); return; }

    io.to(`match:${matchId}`).emit("message:new", msg);

    const { data: match } = await supabase
      .from("matches")
      .select("company_id, companies(owner_id)")
      .eq("id", matchId)
      .single();

    if (match?.companies?.owner_id) {
      const targetSocketId = onlineUsers.get(match.companies.owner_id);
      if (targetSocketId) {
        io.to(targetSocketId).emit("notification:new", {
          type: "message", title: "Yeni mesaj",
          body: content.trim().slice(0, 80),
          data: { match_id: matchId },
        });
      }
    }
  });

  socket.on("typing:start", ({ matchId }) => {
    socket.to(`match:${matchId}`).emit("typing:start", { userId: socket.userId });
  });
  socket.on("typing:stop", ({ matchId }) => {
    socket.to(`match:${matchId}`).emit("typing:stop", { userId: socket.userId });
  });

  socket.on("call:start", ({ matchId, type, offer, caller }) => {
    if (!matchId || !offer || !["audio", "video"].includes(type)) return;
    const room  = `match:${matchId}`;
    const peers = io.sockets.adapter.rooms.get(room);
    if (!peers || peers.size < 2) {
      socket.emit("call:unavailable", { matchId, reason: "offline" });
      return;
    }
    socket.to(room).emit("call:incoming", { matchId, type, offer, caller, from: socket.id });
  });

  socket.on("call:accept", ({ matchId, answer }) => {
    if (!matchId || !answer) return;
    socket.to(`match:${matchId}`).emit("call:accepted", { matchId, answer, from: socket.id });
  });

  socket.on("call:ice", ({ matchId, candidate }) => {
    if (!matchId || !candidate) return;
    socket.to(`match:${matchId}`).emit("call:ice", { matchId, candidate, from: socket.id });
  });

  socket.on("call:reject", ({ matchId, reason = "rejected" }) => {
    if (!matchId) return;
    socket.to(`match:${matchId}`).emit("call:rejected", { matchId, reason });
  });

  socket.on("call:end", ({ matchId }) => {
    if (!matchId) return;
    socket.to(`match:${matchId}`).emit("call:ended", { matchId });
  });

  socket.on("disconnect", () => {
    if (socket.userId) onlineUsers.delete(socket.userId);
    console.log("❌ Ayrıldı:", socket.id);
  });
});

// ─── START ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`\n🚀 Matchwork Server → http://localhost:${PORT}`);
  console.log(`📡 Socket.io hazır`);
  console.log(`🗄️  Supabase: ${process.env.SUPABASE_URL || "(env yok)"}\n`);
});
