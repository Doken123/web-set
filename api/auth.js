export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
    // Set CORS biar ga diblokir browser
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).end();

    let d = req.body;
    if (typeof d === "string") d = JSON.parse(d);

    const username = d.username;
    const password = d.password;

    if (!username || !password) {
        return res.status(400).json({ error: "Username dan password wajib diisi!" });
    }

    const SUPABASE_URL = "https://djradeolrbjmgoxxbdlj.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcmFkZW9scmJqbWdveHhiZGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1OTA0NDQsImV4cCI6MjExMTE2NjQ0NH0.RvLrul0eFafGUcOn_9ORB8xh3IaP4n1FAsEmqXnrXCA";

    try {
        const url = `${SUPABASE_URL}/rest/v1/web_config?admin_user=eq.${encodeURIComponent(username)}&admin_pass=eq.${encodeURIComponent(password)}&select=*`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data && data.length > 0) {
            return res.status(200).json({ success: true, web_id: data[0].web_id });
        } else {
            return res.status(401).json({ error: "Username / Password salah!" });
        }

    } catch (err) {
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
}
