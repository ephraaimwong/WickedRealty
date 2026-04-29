import React, { useState } from 'react';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';
import {login} from '../assets/login.js';

const LoginScreen = ({onSuccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [focus, setFocus] = useState('username');

    useInput((input,key) => {
        if (key.tab){
            setFocus(focus === 'username' ? 'password' : 'username');
        }
        if (key.return && focus === 'password'){
            if (username && password) onSuccess();
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
                    onChange = {setUsername}
                    focus = {focus === 'username'}
                />
            </Box>

            <Box marginTop={1}>
                <Text>
                    password:
                </Text>
                <TextInput
                    value = {password}
                    onChange = {setPassword}
                    focus = {focus === 'password'}
                />
            </Box>
            <Box margin={1}>
                <Text dimColor>
                    Press <Text color='cyan'>TAB</Text> to switch fields
                </Text>
            </Box>
		</Box>
	);
};

export default LoginScreen;