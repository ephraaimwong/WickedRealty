import React from 'react';
import { Box, Text, useInput } from 'ink';
import { menu } from '../../assets/menu.js';
import { logError } from '../services/logger.js';

export default function MenuScreen({ user, onSelect, onLogout }) {
    // Determine visibility based on permission strings
    const canCalculate = user?.permissions?.includes('fve_calculate');
    const canAudit = user?.permissions?.includes('valuation_audit');
    const canTune = user?.permissions?.includes('market_tune');
    const canAdmin = user?.permissions?.includes('user_mgmt');
    const canMonitor = user?.permissions?.includes('infra_monitor');

    useInput((input, key) => {
        
        //chaos smoke test
        if (input === 'x') {
            try {
                throw new Error("MANUAL_TEST: User triggered a synthetic system failure.");
            } catch (err) {
                logError(err, "UI_STRESS_TEST");
                // Optional: Provide visual feedback that the log was written
            }
        }

        const cmd = input.toLowerCase();

        // Universal commands
        if (cmd === "q") onLogout();
        if (cmd === "v") onSelect("APP_VERSION");

        // Gated commands
        if (canCalculate) {
            if (cmd === "1") onSelect("SINGLE_FVE");
            if (cmd === "2") onSelect("BATCH_FVE");
            if (cmd === "3") onSelect("STATUS");
        }

        if (canAudit && cmd === "4") onSelect("CMA");
        if (canTune && cmd === "5") onSelect("CLIENT_ADJUST");

        if (canMonitor && cmd === "6") onSelect("ERRORLOG");

        if (canAdmin) {
            if (cmd === "7") onSelect("ADD_USER");
            if (cmd === "8") onSelect("REMOVE_USER");
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
            <Box><Text>{menu}</Text></Box>
            <Box flexDirection="column" marginTop={1} width="100%">
                <Text bold color="cyan">Welcome, {user.roleName} ({user.id})</Text>
                
                {/* Core FVE Section */}
                {canCalculate && (
                    <Box flexDirection="column" marginTop={1}>
                        <Text>1) Single Run FVE</Text>
                        <Text>2) Batch Run FVE</Text>
                        <Text>3) View Process Status</Text>
                    </Box>
                )}

                {/* Audit & Strategy Section */}
                {(canAudit || canTune) && (
                    <Box flexDirection="column" marginTop={1}>
                        {canAudit && <Text>4) Comparative Market Analysis (CMA)</Text>}
                        {canTune && <Text>5) Edit Client Adjustments</Text>}
                    </Box>
                )}

                {/* IT Infrastructure Section */}
                {(canMonitor || canAdmin) && (
                    <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor="yellow" paddingLeft={1}>
                        <Text color="yellow" bold>[SYSTEM ADMINISTRATION]</Text>
                        {canMonitor && <Text>6) View Infrastructure Error Logs</Text>}
                        {canAdmin && (
                            <>
                                <Text>7) Create New User Account</Text>
                                <Text>8) Remove Existing Account</Text>
                            </>
                        )}
                    </Box>
                )}

                <Box marginTop={1} justifyContent="space-between">
                    <Text dimColor>V) Version Info</Text>
                    <Text color="red" bold>Q) Quit & Logout</Text>
                </Box>
            </Box>
        </Box>
    );
}