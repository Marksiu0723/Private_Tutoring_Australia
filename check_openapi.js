import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const url = process.env.VITE_SUPABASE_URL + '/rest/v1/?apikey=' + process.env.VITE_SUPABASE_ANON_KEY;
  const res = await (await fetch(url)).json();
  console.log(Object.keys(res.definitions || {}));
}
run();
