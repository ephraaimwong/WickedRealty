import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const ct =20000

// 1. Setup path resolution for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Resolve config.json by going UP one level from /temp
const configPath = path.join(__dirname, '..', 'config.json');

// 3. Load Config and Construct Paths
let CONFIG;
try {
    CONFIG = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} catch (err) {
    console.error(`CRITICAL ERROR: Could not read config.json at ${configPath}`);
    console.error(err.message);
    process.exit(1);
}

// Construction matches your config structure: /home/user/WickedRealty/DATASET
const TARGET_DIR = path.join(homedir(), CONFIG.user, CONFIG.baseFolder, CONFIG.datasetFolder);
const OUTPUT_FILE = path.join(TARGET_DIR, 'masterdata.csv');

// Configuration for realistic localized data
const locations = [
    { city: 'Norman', state: 'OK', zips: ['73069', '73071', '73072'], basePrice: 155, lotMin: 0.15, lotMax: 0.4 },
    { city: 'Noble', state: 'OK', zips: ['73068'], basePrice: 135, lotMin: 0.5, lotMax: 5.0 },
    { city: 'Oklahoma City', state: 'OK', zips: ['73139', '73159', '73160', '73170'], basePrice: 145, lotMin: 0.15, lotMax: 0.35 }
];

const streets = ["Main St", "Oak Ave", "Maple Ln", "Pine Rd", "Cedar Ct", "Washington Blvd", "Robinson St", "Classen Blvd", "Penn Ave", "Western Ave"];

// Helper for random integers
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function generateData(count) {
    const header = "PropertyID,Address,City,State,Zip,SqFt,LotSize_Acres,Bedrooms,Bathrooms,GarageSpaces,HasPool,HasPatio,HasDeck,YearBuilt,LastSoldPrice\n";
    let rows = header;

    let cityCounters = { 'Norman': 1, 'Noble': 1, 'Oklahoma City': 1 };

    for (let i = 0; i < count; i++) {
        const loc = locations[randInt(0, locations.length - 1)];
        const zip = loc.zips[randInt(0, loc.zips.length - 1)];
        
        // Property ID Logic (CitySTATE-###)
        const idCity = loc.city.replace(/\s+/g, ''); 
        const idNum = String(cityCounters[loc.city]++).padStart(3, '0');
        const propertyID = `${idCity}${loc.state}-${idNum}`;

        const address = `${randInt(100, 9999)} ${streets[randInt(0, streets.length - 1)]}`;
        const sqft = randInt(1100, 4500);
        const lotSize = (Math.random() * (loc.lotMax - loc.lotMin) + loc.lotMin).toFixed(2);
        
        const bedrooms = randInt(2, 5);
        const bathrooms = Math.max(1, bedrooms - randInt(0, 1)) + (Math.random() > 0.5 ? 0.5 : 0);
        const garageSpaces = randInt(0, 3);
        
        const hasPool = (sqft > 2200 && Math.random() > 0.7) ? 1 : 0;
        const hasPatio = Math.random() > 0.3 ? 1 : 0;
        const hasDeck = Math.random() > 0.6 ? 1 : 0;
        const yearBuilt = randInt(1960, 2023);

        let price = (sqft * loc.basePrice);
        price += (hasPool * 25000) + (garageSpaces * 8000) + (hasPatio * 3000);
        price -= ((2024 - yearBuilt) * 1000); 
        
        price += randInt(-15000, 15000);
        price = Math.max(80000, Math.round(price / 1000) * 1000);

        rows += `${propertyID},${address},${loc.city},${loc.state},${zip},${sqft},${lotSize},${bedrooms},${bathrooms},${garageSpaces},${hasPool},${hasPatio},${hasDeck},${yearBuilt},${price}\n`;
    }

    return rows;
}

// Logic to create directory if it doesn't exist and write the file
try {
    if (!fs.existsSync(TARGET_DIR)) {
        console.log(`Creating directory: ${TARGET_DIR}`);
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, generateData(ct));
    console.log(`Successfully generated ${ct} records at: ${OUTPUT_FILE}`);
} catch (err) {
    console.error("Error creating file:", err.message);
}