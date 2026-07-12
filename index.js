import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import extract from 'extract-zip';

// Konfigirasyon
const DOWNLOAD_URL = 'URL_ZIP_ISIT'; // Mete link zip ou an la
const TEMP_DIR = path.resolve('./temp_bot');
const EXTRACT_DIR = path.resolve('./N-main'); // Katab kote kòd la pral ye

async function runBot() {
    // 1. Kreye katab si li pa egziste
    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);
    
    // 2. Telechaje dosye a
    console.log("Telechajman an kòmanse...");
    const response = await axios({ url: DOWNLOAD_URL, method: 'GET', responseType: 'stream' });
    const writer = fs.createWriteStream(path.join(TEMP_DIR, 'bot.zip'));
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });

    // 3. Ekstrè dosye a
    console.log("Ekstraksyon fini!");
    await extract(path.join(TEMP_DIR, 'bot.zip'), { dir: EXTRACT_DIR });

    // 4. Kouri bot la
    console.log("Bot la ap demare...");
    const child = spawn('node', [path.join(EXTRACT_DIR, 'index.js')], {
        stdio: 'inherit',
        env: process.env
    });

    child.on('exit', (code) => {
        console.log(`Bot la fèmen ak kòd: ${code}`);
    });
}

runBot().catch(console.error);
