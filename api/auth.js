export default async function handler(req, res) {
    // Cuma nerima method POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username dan password wajib diisi!" });
    }

    // Kredensial Supabase lu
    const SUPABASE_URL = "https://djradeolrbjmgoxxbdlj.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcmFkZW9scmJqbWdveHhiZGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1OTA0NDQsImV4cCI6MjExMTE2NjQ0NH0.RvLrul0eFafGUcOn_9ORB8xh3IaP4n1FAsEmqXnrXCA";

    try {
        // Nembak ke database buat ngecek user & pass
        const response = await fetch(`${SUPABASE_URL}/rest/v1/web_config?admin_user=eq.${username}&admin_pass=eq.${password}&select=*`, {
            method: "GET",
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        // Kalo datanya ketemu (ada isinya)
        if (data && data.length > 0) {
            return res.status(200).json({ 
                success: true, 
                web_id: data[0].web_id 
            });
        } else {
            // Kalo ga ketemu
            return res.status(401).json({ error: "Username / Password salah!" });
        }

    } catch (err) {
        // Kalo ada error sistem
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
}
