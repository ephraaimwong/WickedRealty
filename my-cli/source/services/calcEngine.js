import fs from 'fs'; 
import fsPromises from 'fs/promises'; 
import path from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const __filename = fileURLToPath(import.meta.url);
let currentPath = path.dirname(__filename);
let rootDir = null;

console.log(`\n--- CLIMBER TRACE START ---`);
console.log(`Starting search from: ${currentPath}`);

// 1. THE CLIMBER: Search upwards for config.json
while (currentPath !== path.parse(currentPath).root) {
    const checkPath = path.join(currentPath, 'config.json');
    console.log(`Checking for config at: ${checkPath}`);
    
    if (fs.existsSync(checkPath)) {
        console.log(`>>> SUCCESS: Found config.json in ${currentPath}`);
        rootDir = currentPath;
        break; 
    }
    currentPath = path.dirname(currentPath);
}
console.log(`--- CLIMBER TRACE END ---\n`);

if (!rootDir) {
    throw new Error("Climber reached the system root without finding config.json.");
}

const configPath = path.join(rootDir, 'config.json');
const adjPath = path.join(rootDir, 'adjustments.json');

export async function runFVECalculation() {
    // 2. Load and Inspect Config
    const configRaw = await fsPromises.readFile(configPath, 'utf-8');
    const CONFIG = JSON.parse(configRaw);
    
    console.log(`Loaded Config Keys: ${Object.keys(CONFIG).join(', ')}`);

    const ADJ = JSON.parse(await fsPromises.readFile(adjPath, 'utf-8'));

    // 3. Verify Config Keys
    const required = ['user', 'baseFolder', 'inputFolder', 'datasetFolder', 'fveoutputFolder'];
    for (const key of required) {
        if (!CONFIG[key]) {
            throw new Error(`Config Error: Key [${key}] is missing in the file found at ${configPath}`);
        }
    }

    // 4. Path Construction
    const targetUser = process.env.HOST_USER || CONFIG.user;
    const BASE_DIR = path.join(homedir(), targetUser, CONFIG.baseFolder);
    const PATHS = {
        input: path.join(BASE_DIR, CONFIG.inputFolder),
        dataset: path.join(BASE_DIR, CONFIG.datasetFolder),
        output: path.join(BASE_DIR, CONFIG.fveoutputFolder)
    };

    console.log(`Targeting Input: ${PATHS.input}`);

    // 5. Run FS Operations
    await fsPromises.mkdir(PATHS.output, { recursive: true });

    const inputFiles = await fsPromises.readdir(PATHS.input);
    const targetFile = inputFiles.find(f => f.toLowerCase().endsWith('.csv'));
    const masterPath = path.join(PATHS.dataset, 'masterdata.csv');

    if (!targetFile) throw new Error(`No CSV found in ${PATHS.input}`);

    // 6. Processing Logic
    const subjectData = parse(await fsPromises.readFile(path.join(PATHS.input, targetFile), 'utf-8'), { 
        columns: true, 
        trim: true 
    });
    const compsData = parse(await fsPromises.readFile(masterPath, 'utf-8'), { 
        columns: true,
        trim: true
    });

    const results = subjectData.map(subject => {
        const subSqFt = Number(subject.SqFt);
        const filteredComps = compsData.filter(comp => {
            const compSqFt = Number(comp.SqFt);
            return comp.Zip === subject.Zip && 
                   compSqFt >= subSqFt * (1 - (ADJ.sqftTolerance || 0.2)) && 
                   compSqFt <= subSqFt * (1 + (ADJ.sqftTolerance || 0.2)) &&
                   comp.PropertyID !== subject.PropertyID;
        });

        if (filteredComps.length === 0) return { ...subject, FVE: 'N/A', Status: 'Insufficient Comps' };

        const adjustedPPSqFtList = filteredComps.map(comp => {
            let price = Number(comp.LastSoldPrice);
            price += (Number(subject.HasPool) - Number(comp.HasPool)) * ADJ.poolValue;
            price += (Number(subject.GarageSpaces) - Number(comp.GarageSpaces)) * ADJ.garageSpaceValue;
            price += (Number(subject.HasDeck) - Number(comp.HasDeck)) * ADJ.deckValue;
            price += (Number(subject.HasPatio) - Number(comp.HasPatio)) * ADJ.patioValue;
            price += (Number(subject.YearBuilt) - Number(comp.YearBuilt)) * ADJ.yearBuiltPremium;
            return price / Number(comp.SqFt);
        });

        const avgPPSqFt = adjustedPPSqFtList.reduce((a, b) => a + b, 0) / adjustedPPSqFtList.length;
        
        return {
            ...subject,
            FVE: Math.round(avgPPSqFt * subSqFt),
            CompCount: filteredComps.length,
            Confidence: filteredComps.length >= 5 ? 'High' : 'Medium'
        };
    });

    const reportName = `FVE_Report_${targetFile}`;
    await fsPromises.writeFile(path.join(PATHS.output, reportName), stringify(results, { header: true }));

    return {
        status: 'success',
        message: `Processed ${results.length} properties. Report saved to ${CONFIG.fveoutputFolder}.`
    };
}