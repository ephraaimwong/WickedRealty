import React from 'react';
import {Box, Newline, Text, useInput} from 'ink';
import { batchFVE } from '../../assets/batchFVE.js' 

const BatchFVEScreen = ({onSelect}) => {
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
                {batchFVE}
            </Text>
            <Box
                flexDirection='column'
            >
                <Text>
                    Steps 
                    <Newline/>
                    1) Place Property Data in `~/WickedRealty/INPUT_FILES_HERE/.`
                    <Newline/>
                    2) Check that masterdata.csv is in `~/WickedRealty/DATASET/.`
                    <Newline/>
                    Press Enter to Continue
                    <Newline/>
                    Press ESC to go back to menu.
                </Text>
            </Box>
		</Box>
	);
};

export default BatchFVEScreen;
