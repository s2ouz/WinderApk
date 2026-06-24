const router   = require("express").Router();
const { supabase, requireAuth } = require("../middleware/auth");

// POST /api/auth/register — artık kullanılmıyor (frontend direkt Supabase'e gidiyor)
// Eski endpoint'i kaldırmak yerine 410 Gone döndürüyoruz
router.post("/register", (req, res) => {
  res.status(410).json({ error: "Kayıt artık doğrudan istemci tarafından yapılıyor." });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return res.status(401).json({
        error: "E-posta adresinizi henüz doğrulamadınız. Gelen kutunuzu kontrol edin.",
        code:  "EMAIL_NOT_CONFIRMED",
      });
    }
    return res.status(401).json({ error: "E-posta veya şifre hatalı" });
  }

  // Profili çek; yoksa user_metadata'dan oluştur
  let { data: profile } = await supabase
    .from("profiles").select("*").eq("id", data.user.id).single();

  if (!profile) {
    const meta      = data.user.user_metadata || {};
    const full_name = meta.full_name || email.split("@")[0];
    const parts     = full_name.trim().split(" ");
    const initials  = parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);

    const { data: newProfile } = await supabase.from("profiles").insert({
      id:         data.user.id,
      full_name,
      short_name: parts[0],
      initials,
      role_label: meta.role_label || "",
      location:   "",
      lat:        null,
      lng:        null,
    }).select().single();

    profile = newProfile;
    console.log("[login] Profil oluşturuldu:", data.user.id);
  }

  res.json({
    access_token:  data.session.access_token,
    refresh_token: data.session.refresh_token,
    user:          data.user,
    profile:       profile || null,
  });
});

// POST /api/auth/refresh
router.post("/refresh", async (req, res) => {
  const { refresh_token } = req.body;
  const { data, error } = await supabase.auth.refreshSession({ refresh_token });
  if (error) return res.status(401).json({ error: error.message });
  res.json({
    access_token:  data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
});

// GET /api/auth/profile — giriş yapmış kullanıcının profili
router.get("/profile", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("profiles").select("*").eq("id", req.user.id).single();
  if (error) return res.status(404).json({ error: "Profil bulunamadı" });
  res.json(data);
});

module.exports = router;
