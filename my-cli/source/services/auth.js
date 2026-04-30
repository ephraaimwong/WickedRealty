import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
let rootDir = path.dirname(__filename);

// THE CLIMBER: Search for the directory containing the JSON configs
while (rootDir !== path.parse(rootDir).root) {
    if (fs.existsSync(path.join(rootDir, 'users.json'))) break;
    rootDir = path.dirname(rootDir);
}

export const authenticateUser = (username, password) => {
    try {
        const usersPath = path.join(rootDir, 'users.json');
        const rolesPath = path.join(rootDir, 'roles.json');

        const userData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const roleConfig = JSON.parse(fs.readFileSync(rolesPath, 'utf-8'));

        // 1. Normalize input for case-insensitive lookup
        const lowerUser = username.toLowerCase();
        const userRecord = userData[lowerUser];

        // 2. Validate Credential Match
        if (userRecord && String(userRecord.password) === String(password)) {
            const roleCode = userRecord.role;
            
            // 3. Construct the Full Session Object
            return {
                id: lowerUser,
                roleCode: roleCode,
                roleName: roleConfig.roles[roleCode],
                permissions: roleConfig.permissions[roleCode] || []
            };
        }
    } catch (err) {
        // Silently return null on missing files or malformed JSON
        return null;
    }

    return null; // Auth failed
};