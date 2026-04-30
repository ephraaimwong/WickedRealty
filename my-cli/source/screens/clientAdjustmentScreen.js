import React from 'react';
import {Box, Newline, Text, useInput} from 'ink';
import { clientadjustment } from '../../assets/clientadjustment.js';

const clientAdjustmentScreen = ({onSelect}) => {
    useInput((input,key) =>{
        if (key.escape) onSelect("MENU");
        if (key.return) onSelect("STATUS");
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
                {clientadjustment}
            </Text>
            <Box
                flexDirection='column'
            >
                <Text>
                    Steps 
                    <Newline/>
                    1) Place Property Data in `~\...\folderpath`
                    <Newline/>
                    2) Check that masterdata.csv is in `~\...\folderpath`
                    <Newline/>
                    Press Enter to Continue
                    <Newline/>
                    Press ESC to go back to menu.
                </Text>
            </Box>
		</Box>
	);
};

export default clientAdjustmentScreen;
