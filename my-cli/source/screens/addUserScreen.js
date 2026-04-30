import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import { adduser } from '../../assets/adduser.js';
import { createNewUser } from '../services/addUser.js';

const AddUserScreen = ({ onDone }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [focus, setFocus] = useState('username');
    const [status, setStatus] = useState({ type: 'idle', message: '' });

    // Define the role options based on your roles.json keys
    const roleItems = [
        { label: 'Realtor Agent (RE)', value: 'RE' },
        { label: 'Operations Manager (MN)', value: 'MN' },
        { label: 'IT Admin (IT)', value: 'IT' },
        { label: 'Business Analyst (BA)', value: 'BA' }
    ];

    const handleSelectRole = (item) => {
        if (username && password) {
            const result = createNewUser(username, password, item.value);
            
            if (result.success) {
                setStatus({ type: 'success', message: result.message });
                setTimeout(onDone, 1500);
            } else {
                setStatus({ type: 'error', message: result.message });
                setFocus('username'); // Reset focus to let them fix errors
            }
        }
    };

    useInput((input, key) => {
        if (key.tab) {
            // Cycle: username -> password -> role-select
            if (focus === 'username') setFocus('password');
            else if (focus === 'password') setFocus('role');
            else setFocus('username');
            setStatus({ type: 'idle', message: '' });
        }

        if (key.escape) onDone();
    });

    return (
        <Box
            borderStyle="single"
            padding={1}
            flexDirection="column"
            alignItems="center"
            width={60}
        >
            <Text>{adduser}</Text>

            <Box marginTop={1} flexDirection="column" width="100%">
                <Box>
                    <Text color={focus === 'username' ? 'cyan' : 'white'}>Username: </Text>
                    <TextInput 
                        value={username} 
                        onChange={setUsername} 
                        focus={focus === 'username'} 
                    />
                </Box>
                
                <Box>
                    <Text color={focus === 'password' ? 'cyan' : 'white'}>Password: </Text>
                    <TextInput 
                        value={password} 
                        onChange={setPassword} 
                        focus={focus === 'password'} 
                        mask="*" 
                    />
                </Box>

                <Box marginTop={1} flexDirection="column">
                    <Text color={focus === 'role' ? 'cyan' : 'white'} bold>
                        {focus === 'role' ? '› Select Role:' : '  Role:'}
                    </Text>
                    
                    {focus === 'role' ? (
                        <Box marginLeft={2}>
                            <SelectInput items={roleItems} onSelect={handleSelectRole} />
                        </Box>
                    ) : (
                        <Text dimColor marginLeft={4}> (Press TAB to select role) </Text>
                    )}
                </Box>
            </Box>

            {status.message && (
                <Box marginTop={1}>
                    <Text color={status.type === 'success' ? 'green' : 'red'} bold>
                        {status.message}
                    </Text>
                </Box>
            )}

            <Box marginTop={1}>
                <Text dimColor>TAB: Switch Fields | ESC: Cancel</Text>
            </Box>
        </Box>
    );
};

export default AddUserScreen;