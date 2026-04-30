import React from 'react';
import {Box, Newline, Text, useInput} from 'ink';
import {appversion} from '../../assets/appversion.js';

const AppVersionScreen = ({onDone}) => {
    useInput((input,key) =>{
        if (key.return || input === " ") onDone();
    });
	return (
		<Box
			borderStyle="single"
			padding={1}
			flexDirection="column"
			alignItems="center"
			justifyContent='center'
			width={60}
		>
			<Text>
                {appversion}
				<Newline/>
				BETA v0.0.1
            </Text>
            <Text color={'yellowBright'}>
                Press Enter or Space to Continue
            </Text>
		</Box>
	);
};

export default AppVersionScreen;
