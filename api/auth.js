export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Isi dulu!" });

    const SUPABASE_URL = "https://djradeolrbjmgoxxbdlj.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcmFkZW9scmJqbWdveHhiZGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1OTA0NDQsImV4cCI6MjExMTE2NjQ0NH0.RvLrul0eFafGUcOn_9ORB8xh3IaP4n1FAsEmqXnrXCA";

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/web_config?admin_user=eq.${username}&admin_pass=eq.${password}&select=*`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const data = await response.json();

        if (data && data.length > 0) {
            return res.status(200).json({ success: true, web_id: data[0].web_id });
        } else {
            return res.status(401).json({ error: "Username / Password salah!" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
