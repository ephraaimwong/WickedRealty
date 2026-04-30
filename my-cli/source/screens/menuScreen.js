import React from 'react';
import { Box, Text, useInput } from 'ink';
import { menu } from '../../assets/menu.js';
import { logError } from '../services/logger.js';

export default function MenuScreen({ user, onSelect, onLogout }) {
    // Permission Mapping
    const canCalculate = user?.permissions?.includes('fve_calculate'); // Options 1, 2
    const canAudit = user?.permissions?.includes('valuation_audit');   // Option 3
    const canTune = user?.permissions?.includes('market_tune');       // Option 4
    const canMonitor = user?.permissions?.includes('infra_monitor');   // Option 5
    const canAdmin = user?.permissions?.includes('user_mgmt');         // Options 6, 7

    useInput((input) => {
        const cmd = input.toLowerCase();

        //chaos smoke test
        if (input === 'x') {
            try {
                throw new Error("MANUAL_TEST: User triggered a synthetic system failure.");
            } catch (err) {
                logError(err, "UI_STRESS_TEST");
                // Optional: Provide visual feedback that the log was written
            }
        }

        // Universal Commands
        if (cmd === "q") onLogout();
        if (cmd === "v") onSelect("APP_VERSION");

        // Gated Commands: Must match the visual number
        if (canCalculate) {
            if (cmd === "1") onSelect("SINGLE_FVE");
            if (cmd === "2") onSelect("BATCH_FVE");
        }
        if (canAudit && cmd === "3") onSelect("CMA");
        // if (canTune && cmd === "4") onSelect("CLIENT_ADJUST");
        if (canMonitor && cmd === "5") onSelect("ERRORLOG");
        if (canAdmin) {
            if (cmd === "6") onSelect("ADD_USER");
            if (cmd === "7") onSelect("REMOVE_USER");
        }
    });

    return (
        <Box borderStyle="single" padding={1} flexDirection="column" alignItems="center" width={60}>
            <Box><Text>{menu}</Text></Box>
            <Box flexDirection="column" marginTop={1} width="100%">
                <Text bold color="cyan">User: {user.id} | Role: {user.roleName}</Text>
                
                {/* 1-4: Agent & Analyst Tools */}
                {canCalculate && (
                    <>
                        <Text>1) Single Run FVE</Text>
                        <Text>2) Batch Run FVE</Text>
                    </>
                )}
                {canAudit && <Text>3) Comparative Market Analysis (CMA)</Text>}
                {/* {canTune && <Text>4) Edit Client Adjustments</Text>} */}

                {/* 5-7: Admin & Infrastructure */}
                {(canMonitor || canAdmin) && (
                    <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor="yellow" paddingLeft={1}>
                        <Text color="yellow" bold>[ADMINISTRATION]</Text>
                        {canMonitor && <Text>5) View Infrastructure Logs</Text>}
                        {canAdmin && (
                            <>
                                <Text>6) Create New User</Text>
                                <Text>7) Remove Existing User</Text>
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