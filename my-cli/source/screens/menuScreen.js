import { Box, Text, useInput } from 'ink';
import React from 'react';
import {menu} from '../../assets/menu.js'

export default function MenuScreen({onSelect}){

    useInput((input, key) => {
        if (input === "1") onSelect("SINGLE_FVE");
        if (input === "2") onSelect("SCREEN_NAME_2");
        if (input.toLowerCase() === "q") onSelect("LOGOUT");
    });

    return(
        <Box
			borderStyle="single"
			padding={1}
			flexDirection="column"
			alignItems="center"
			width={60}
        >
            <Box><Text>{menu}</Text></Box>
            <Box
                flexDirection='column'
                marginTop={1}
            >
                <Text>1) Single Run FVE</Text>
                <Text>2) Batch Run FVE</Text>
                <Text color="red" dimColor>Q to Quit</Text>
            </Box>
        </Box>
    );
};