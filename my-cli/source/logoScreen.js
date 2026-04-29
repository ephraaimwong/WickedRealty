import React from 'react';
import {Box, Text, useInput} from 'ink';
import {logo} from '../assets/logo.js';

const LogoScreen = ({onDone}) => {
    useInput((input,key) =>{
        if (key.return || input === " ") onDone();
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
                {logo}
            </Text>
            <Text color={'yellowBright'}>
                Press Enter or Space to Continue
            </Text>
		</Box>
	);
};

export default LogoScreen;
