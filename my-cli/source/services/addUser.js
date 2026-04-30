import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
let rootDir = path.dirname(__filename);

// THE CLIMBER: Find the root directory for users.json
while (rootDir !== path.parse(rootDir).root) {
    if (fs.existsSync(path.join(rootDir, 'users.json'))) break;
    rootDir = path.dirname(rootDir);
}

export const createNewUser = (username, password, role) => {
    try {
        const usersPath = path.join(rootDir, 'users.json');
        const rolesPath = path.join(rootDir, 'roles.json');
        
        const userData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const roleData = JSON.parse(fs.readFileSync(rolesPath, 'utf-8'));

        const lowerUser = username.toLowerCase();

        // 1. Conflict Check: Does user already exist?
        if (userData[lowerUser]) {
            return { success: false, message: `Conflict: User "${username}" already exists.` };
        }

        // 2. Validation: Is the role valid?
        if (!roleData.roles[role.toUpperCase()]) {
            return { success: false, message: `Invalid Role: ${role}. Use RE, MN, IT, or BA.` };
        }

        // 3. Update the Object
        userData[lowerUser] = {
            password: password,
            role: role.toUpperCase()
        };

        // 4. Write back to disk
        fs.writeFileSync(usersPath, JSON.stringify(userData, null, 4));
        
        return { success: true, message: `User "${username}" created successfully.` };

    } catch (err) {
        return { success: false, message: `System Error: ${err.message}` };
    }
};