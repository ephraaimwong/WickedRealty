import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, Newline } from 'ink';
import { errorlog } from '../../assets/errorlog.js';
import { getLogs } from '../services/logger.js';

const ErrorLogScreen = ({ onSelect }) => {
    const [logs, setLogs] = useState([]);

    // Fetch logs on initial mount
    useEffect(() => {
        setLogs(getLogs(15));
    }, []);

    useInput((input, key) => {
        if (key.escape) onSelect("MENU");
        if (key.return) onSelect("STATUS");
        
        // 'R' key to manual refresh logs
        if (input.toLowerCase() === 'r') {
            setLogs(getLogs(15));
        }
    });

    return (
        <Box
            borderStyle="single"
            padding={1}
            flexDirection="column"
            alignItems="center"
            width={80}
        >
            <Text>{errorlog}</Text>
            
            <Box flexDirection="column" marginTop={1} width="90%">
                <Text bold color="red" u>RECENT INFRASTRUCTURE ERRORS</Text>
                <Newline />
                
                {logs.length === 0 || logs[0] === "No logs found." ? (
                    <Text italic dimColor>No system errors recorded.</Text>
                ) : (
                    logs.map((log, index) => {
                        // Split timestamp from message for better coloring
                        const [time, ...msgParts] = log.split('] ');
                        return (
                            <Box key={index} marginBottom={1}>
                                <Text color="yellow">{time}]</Text>
                                <Text> {msgParts.join('] ')}</Text>
                            </Box>
                        );
                    })
                )}
            </Box>

            <Box marginTop={1} flexDirection="column" alignItems="center">
                <Text dimColor>
                    Press <Text color="cyan">R</Text> to Refresh | 
                    Press <Text color="cyan">ENTER</Text> for Status | 
                    Press <Text color="cyan">ESC</Text> for Menu
                </Text>
            </Box>
        </Box>
    );
};

export default ErrorLogScreen;