import React, { useState } from 'react';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';
import {login} from '../../assets/login.js';
import { authenticateUser } from '../services/auth.js';

const LoginScreen = ({onSuccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [focus, setFocus] = useState('username');
    const [error, setError] = useState(false);

    useInput((input,key) => {
        if (key.tab){
            setFocus(focus === 'username' ? 'password' : 'username');
            setError(false);
        }
        if (key.return && focus === 'password'){
            if (username && password){
                const user = authenticateUser(username, password);

                if (user) onSuccess(user);
                else {
                    setError(true);
                    setPassword(""); //reset password field on failure
                }
            }
        }
    });

	return (
		<Box
			borderStyle="single"
			padding={1}
			flexDirection="column"
			alignItems="center"
			width={60}
		>
			<Text>
                {login}
            </Text>
            <Box marginTop={1}>
                <Text>
                    username:
                </Text>
                <TextInput
                    value = {username}
                    onChange = {(val) => { setUsername(val); setError(false); }}
                    focus = {focus === 'username'}
                />
            </Box>

            <Box marginTop={1}>
                <Text>
                    password:
                </Text>
                <TextInput
                    value = {password}
                    onChange = {(val) => { setPassword(val); setError(false); }}
                    focus = {focus === 'password'}
                    mask="*" // Hides password characters for security
                />
            </Box>
            {/* Render Error Message */}
            {error && (
                <Box marginTop={1}>
                    <Text color="red" bold>
                        Invalid credentials. Please try again.
                    </Text>
                </Box>
            )}
            <Box margin={1}>
                <Text dimColor>
                    Press <Text color='cyan'>TAB</Text> to switch fields
                </Text>
            </Box>
		</Box>
	);
};

export default LoginScreen;