const router = require("express").Router();
const { requireAuth, supabase } = require("../middleware/auth");

// GET /api/jobs?lat=40.99&lng=29.02&radius=5000&type=&q=
router.get("/", requireAuth, async (req, res) => {
  const { lat, lng, radius = 5000, type, q } = req.query;

  if (lat && lng) {
    const uLat = parseFloat(lat);
    const uLng = parseFloat(lng);
    const radM = parseFloat(radius);

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        id, title, description, location, lat, lng,
        salary_min, salary_max, currency, period, type,
        schedule, tags, requirements, benefits,
        companies ( id, name, initials, verified )
      `)
      .eq("active", true);

    if (error) return res.status(500).json({ error: error.message });

    function hsDist(lat1, lng1, lat2, lng2) {
      const R = 6371000;
      const dL = (lat2 - lat1) * Math.PI / 180;
      const dN = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dL / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dN / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    const nearby = (data || [])
      .filter(j => j.lat && j.lng && hsDist(uLat, uLng, j.lat, j.lng) <= radM)
      .sort((a, b) => hsDist(uLat, uLng, a.lat, a.lng) - hsDist(uLat, uLng, b.lat, b.lng));

    return res.json(nearby);
  }

  // Standart filtreleme
  let query = supabase
    .from("jobs")
    .select(`
      id, title, description, location, lat, lng,
      salary_min, salary_max, currency, period, type,
      schedule, tags, requirements, benefits,
      companies ( id, name, initials, verified )
    `)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (type) query = query.eq("type", type);
  if (q)    query = query.ilike("title", `%${q}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/jobs/:id — tek ilan detayı
router.get("/:id", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      companies ( id, name, initials, description, location, verified, avatar_url )
    `)
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: "İlan bulunamadı" });
  res.json(data);
});

// POST /api/jobs/:id/swipe  { direction: "left"|"right" }
router.post("/:id/swipe", requireAuth, async (req, res) => {
  const { direction } = req.body;
  if (!["left", "right"].includes(direction))
    return res.status(400).json({ error: "Geçersiz yön" });

  const userId = req.user.id;
  const jobId  = req.params.id;

  // Swipe kaydet (upsert — aynı ilanı tekrar swiplayabilir)
  const { error: swipeError } = await supabase
    .from("swipes")
    .upsert({ user_id: userId, job_id: jobId, direction }, { onConflict: "user_id,job_id" });

  if (swipeError) return res.status(500).json({ error: swipeError.message });

  // Sağa swipe → match oluştur
  if (direction === "right") {
    // İlanın company_id'sini al
    const { data: job } = await supabase
      .from("jobs").select("company_id").eq("id", jobId).single();

    if (!job) return res.status(404).json({ error: "İlan bulunamadı" });

    // Match skoru hesapla
    const { data: score } = await supabase
      .rpc("calc_match_score", { p_id: userId, j_id: jobId });

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .upsert({
        user_id: userId,
        job_id: jobId,
        company_id: job.company_id,
        match_score: score || 72,
      }, { onConflict: "user_id,job_id" })
      .select()
      .single();

    if (matchError) return res.status(500).json({ error: matchError.message });

    // Bildirim oluştur
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "match",
      title: "Yeni Eşleşme!",
      body: "Bir işverene ilgi gösterdin.",
      data: { match_id: match.id },
    });

    return res.json({ matched: true, match });
  }

  res.json({ matched: false });
});

module.exports = router;
