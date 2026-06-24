const router   = require("express").Router();
const { createClient } = require("@supabase/supabase-js");
const { supabase, requireAuth } = require("../middleware/auth");

// Anon client — signUp() confirmation email için gerekli
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password, full_name, role_label, location, lat, lng } = req.body;
  if (!email || !password || !full_name)
    return res.status(400).json({ error: "Email, şifre ve isim zorunlu" });

  // signUp() kullan: Supabase otomatik doğrulama emaili gönderir (Resend SMTP üzerinden)
  // emailRedirectTo yok — Supabase Dashboard'daki Site URL kullanılır
  const { data: authData, error: authError } = await supabaseAnon.auth.signUp({
    email,
    password,
  });

  if (authError) return res.status(400).json({ error: authError.message });

  // Kullanıcı zaten var ama email doğrulanmamış — Supabase yeniden email gönderir
  if (authData.user?.identities?.length === 0) {
    return res.status(409).json({ error: "Bu email ile zaten bir hesap var. Lütfen e-postanızı kontrol edin." });
  }

  const userId  = authData.user.id;
  const parts   = full_name.trim().split(" ");
  const initials = parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);

  // Profili service role ile oluştur (RLS bypass)
  const { error: profileError } = await supabase.from("profiles").insert({
    id:         userId,
    full_name,
    short_name: parts[0],
    initials,
    role_label: role_label || "",
    location:   location   || "",
    lat:        lat        || null,
    lng:        lng        || null,
  });

  if (profileError) {
    // Profil zaten varsa (tekrar kayıt denemesi) sorun değil
    if (!profileError.message.includes("duplicate")) {
      return res.status(500).json({ error: profileError.message });
    }
  }

  res.status(201).json({
    pending: true,
    message: "Kayıt başarılı. E-posta adresinize doğrulama linki gönderildi.",
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // E-posta doğrulanmamış — özel hata kodu ile dön
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return res.status(401).json({
        error: "E-posta adresinizi henüz doğrulamadınız. Gelen kutunuzu kontrol edin.",
        code:  "EMAIL_NOT_CONFIRMED",
      });
    }
    return res.status(401).json({ error: "E-posta veya şifre hatalı" });
  }

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", data.user.id).single();

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
