import React from 'react';
import {Box, Text, useInput} from 'ink';
import {loggedout} from '../../assets/loggedout.js';

const LogoutScreen = ({onDone}) => {
    useInput((input,key) =>{
        onDone(); //any button
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
                {loggedout}
            </Text>
            <Text color={'yellowBright'}>
                Press any Button to Continue
            </Text>
		</Box>
	);
};

export default LogoutScreen;
