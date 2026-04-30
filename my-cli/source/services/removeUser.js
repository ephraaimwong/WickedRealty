import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
let rootDir = path.dirname(__filename);

// THE CLIMBER: Search for the directory containing users.json
while (rootDir !== path.parse(rootDir).root) {
    if (fs.existsSync(path.join(rootDir, 'users.json'))) break;
    rootDir = path.dirname(rootDir);
}

/**
 * Removes a user from the system after verifying the admin's credentials.
 * @param {string} targetUsername - The ID of the account to delete.
 * @param {string} adminPassword - The password of the IT Admin performing the action.
 * @param {string} currentAdminId - The ID of the currently logged-in Admin.
 */
export const removeUserAccount = (targetUsername, adminPassword, currentAdminId) => {
    try {
        const usersPath = path.join(rootDir, 'users.json');
        const userData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

        const lowerTarget = targetUsername.toLowerCase();
        const lowerAdmin = currentAdminId.toLowerCase();

        // 1. Verification: Does the target exist?
        if (!userData[lowerTarget]) {
            return { success: false, message: `Error: User "${targetUsername}" not found.` };
        }

        // 2. Safety: Prevent the IT Admin from deleting themselves
        if (lowerTarget === lowerAdmin) {
            return { success: false, message: "Error: Self-deletion is restricted." };
        }

        // 3. Authorization: Confirm the admin's password before proceeding
        if (userData[lowerAdmin].password !== adminPassword) {
            return { success: false, message: "Verification Failed: Incorrect Admin Password." };
        }

        // 4. Execution: Remove the record and persist to disk
        delete userData[lowerTarget];
        fs.writeFileSync(usersPath, JSON.stringify(userData, null, 4));

        return { success: true, message: `User "${targetUsername}" successfully removed.` };

    } catch (err) {
        return { success: false, message: `System Error: ${err.message}` };
    }
};