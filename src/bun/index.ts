import { BrowserWindow, BrowserView, Utils, type RPCSchema } from "electrobun/bun";
import Database from "bun:sqlite";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";


const dataDir = Utils.paths.userData;
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, "drone_finder.db"), { create: true });

// Ініціалізація бази даних з даними із SOP
db.exec(`
    CREATE TABLE IF NOT EXISTS drone_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        control_freq_min REAL,
        control_freq_max REAL,
        video_freq_min REAL,
        video_freq_max REAL,
        modem_type TEXT,
        image_url TEXT
    )
`);

// Наповнення бази даними з документа 
const insert = db.prepare("INSERT INTO drone_profiles (name, control_freq_min, control_freq_max, video_freq_min, video_freq_max, modem_type, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");

const count = db.query("SELECT COUNT(*) as count FROM drone_profiles").get() as {count: number};
if (count.count === 0) {
    insert.run("Орлан-10 (30)", 894, 1020, 2300, 2700, "КТР-4.0/4.1", "https://example.com/orlan.jpg");
    insert.run("SuperCam (Скат/Альбатрос)", 840, 1020, 990, 1485, "Радіоміст/СД-3/СД-6", "https://example.com/supercam.jpg");
    insert.run("ZALA (Куб/Lancet)", 868, 915, 1200, 2395, "К-2/К-3 (TDD/FDD)", "https://example.com/zala.jpg");
    insert.run("Мерлін-ВР", 865, 1020, 2300, 2700, "Радіоміст", "https://example.com/merlin.jpg");
    insert.run("Гербера/Герань", 500, 3400, 500, 3400, "Airborne Mesh (ППРЧ)", "https://example.com/gerbera.jpg");
}

type Drone = {
    name: string;
    modem_type: string;
    image_url: string;
};

type DroneRPC = {
    bun: RPCSchema<{
        requests: {
            identify: { params: { freq: number }, response: Drone[] }
        }
    }>;
};

const droneRPC = BrowserView.defineRPC<DroneRPC>({
    handlers: {
        requests: {
            identify: ({ freq }) => {
                // Пошук дрона за частотою (якщо вона потрапляє в діапазон керування або відео)
                return db.query(`
                    SELECT name, modem_type, image_url 
                    FROM drone_profiles 
                    WHERE (? BETWEEN control_freq_min AND control_freq_max)
                       OR (? BETWEEN video_freq_min AND video_freq_max)
                `).all(freq, freq) as Drone[];
            }
        }
    }
});

const win = new BrowserWindow({
    title: "SOP Drone Identifier",
    url: "views://mainview/index.html",
    rpc: droneRPC,
    frame: { width: 800, height: 600 }
});