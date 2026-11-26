export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const SUPABASE_URL = "https://djradeolrbjmgoxxbdlj.supabase.co"; 
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcmFkZW9scmJqbWdveHhiZGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1OTA0NDQsImV4cCI6MjExMTE2NjQ0NH0.RvLrul0eFafGUcOn_9ORB8xh3IaP4n1FAsEmqXnrXCA";

    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: "Username dan Password wajib diisi" });

        // Cari user di tabel web_config berdasarkan admin_user dan admin_pass
        const response = await fetch(`${SUPABASE_URL}/rest/v1/web_config?admin_user=eq.${username}&admin_pass=eq.${password}&select=web_id,admin_user`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        
        const data = await response.json();

        if (data && data.length > 0) {
            // Kalo ketemu, kirim web_id-nya ke dashboard
            return res.status(200).json({ 
                success: true, 
                web_id: data[0].web_id,
                username: data[0].admin_user 
            });
        } else {
            return res.status(401).json({ error: "Username atau Password salah!" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error server", message: error.message });
    }
}
