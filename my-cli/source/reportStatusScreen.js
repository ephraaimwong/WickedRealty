import React from 'react';
import {Box, Text, useInput} from 'ink';
import { singleFVE } from '../assets/singleFVE';

const ReportStatusScreen = ({onDone}) => {
    useInput((input,key) =>{
        if (key.return) onDone();
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
                {singleFVE}
            </Text>
            <Box
                flexDirection='column'
            >
                <Text>
                    Steps
                    1) Place Property Data in `~\...\folderpath`
                    2) Check that masterdata.csv is in `~\...\folderpath`
                    Press Enter to Continue
                </Text>
            </Box>
		</Box>
	);
};

export default ReportStatusScreen;
