import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).end();

    let d = req.body;
    if (typeof d === "string") d = JSON.parse(d);

    const { username, password } = d;

    if (!username || !password) {
        return res.status(400).json({ error: "Isi dulu!" });
    }

    const supabaseUrl = "https://djradeolrbjmgoxxbdlj.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcmFkZW9scmJqbWdveHhiZGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1OTA0NDQsImV4cCI6MjExMTE2NjQ0NH0.RvLrul0eFafGUcOn_9ORB8xh3IaP4n1FAsEmqXnrXCA";
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error } = await supabase
            .from('web_config')
            .select('*')
            .eq('admin_user', username)
            .eq('admin_pass', password)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: "Username / Password salah!" });
        }

        return res.status(200).json({ success: true, web_id: data.web_id });

    } catch (err) {
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
}
