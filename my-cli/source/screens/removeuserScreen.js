import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { removeuser } from '../../assets/removeuser.js'; 
import { removeUserAccount } from '../services/removeUser.js';

const RemoveUserScreen = ({ user, onDone }) => {
    const [targetUser, setTargetUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [focus, setFocus] = useState('target');
    const [status, setStatus] = useState({ type: 'idle', message: '' });

    useInput((input, key) => {
        // TAB: Switch focus between the target user and admin password fields
        if (key.tab) {
            setFocus(focus === 'target' ? 'password' : 'target');
            setStatus({ type: 'idle', message: '' });
        }

        // ENTER: Trigger the removal process if both fields are populated
        if (key.return && focus === 'password') {
            if (targetUser && adminPass) {
                const result = removeUserAccount(targetUser, adminPass, user.id);
                
                if (result.success) {
                    setStatus({ type: 'success', message: result.message });
                    setTimeout(onDone, 1500); // Return to menu after success
                } else {
                    setStatus({ type: 'error', message: result.message });
                    setAdminPass(''); // Security: Reset admin password field on failure
                }
            }
        }

        // ESC: Cancel the operation and return to menu
        if (key.escape) onDone();
    });

    return (
        <Box
            borderStyle="single"
            padding={1}
            flexDirection="column"
            alignItems="center"
            width={70}
        >
            <Text color="red">{removeuser}</Text>

            <Box marginTop={1} flexDirection="column">
                <Box>
                    <Text>User to Remove: </Text>
                    <TextInput 
                        value={targetUser} 
                        onChange={setTargetUser} 
                        focus={focus === 'target'} 
                        placeholder="username"
                    />
                </Box>
                <Box marginTop={1}>
                    <Text>Your Admin Pass: </Text>
                    <TextInput 
                        value={adminPass} 
                        onChange={setAdminPass} 
                        focus={focus === 'password'} 
                        mask="*" 
                    />
                </Box>
            </Box>

            {status.message && (
                <Box marginTop={1}>
                    <Text color={status.type === 'success' ? 'green' : 'red'} bold italic>
                        {status.message}
                    </Text>
                </Box>
            )}

            <Box marginTop={1} flexDirection="column" alignItems="center">
                <Text dimColor>TAB: Switch | ENTER: Confirm Removal | ESC: Cancel</Text>
            </Box>
        </Box>
    );
};

export default RemoveUserScreen;