import { Box, Text, useInput } from 'ink';
import React from 'react';
import {menu} from '../assets/menu.js'

export default function MenuScreen({onSelect}){

    useInput((input, key) => {
        if (input === "1") onSelect("SCREEN_NAME_1");
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
            <Text>{menu}</Text>
            <Box
                flexDirection='column'
                marginTop={1}
            >
                <Text>1) Single Run FVE</Text>
                <Text>2) Batch Run FVE</Text>
                <Text color="red">Q to Quit</Text>
            </Box>
        </Box>
    );
};