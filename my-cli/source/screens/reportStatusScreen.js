import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Status} from '../../assets/status.js';
import Spinner from 'ink-spinner';
import { runFVECalculation } from '../services/calcEngine.js';

const ReportStatusScreen = ({onBack}) => {
	const [status, setStatus] = useState('loading');
	const [message, setMessage] = useState('Initializing...');
	useInput((input, key) => {
		if (status !== 'loading' && key.return) onBack(); //do not accept keys while loading
	});

	// //helper simulation method
	// useEffect(() => {
	// 	// 1. Simulate the delay of processing a file
	// 	const timer = setTimeout(() => {
	// 		// 2. STUB: Randomly choose an outcome for testing
	// 		const outcomes = ['success', 'warning', 'failure'];
	// 		const result = outcomes[Math.floor(Math.random() * outcomes.length)];

	// 		if (result === 'success') {
	// 			setStatus('success');
	// 			setMessage('resultCMA.csv generated successfully.');
	// 		} else if (result === 'warning') {
	// 			setStatus('warning');
	// 			setMessage('CMA generated, but 4 properties were missing Area Data.');
	// 		} else {
	// 			setStatus('failure');
	// 			setMessage('Error: masterareadata.csv not found in /data folder.');
	// 		}
	// 	}, 3500); // 3.5 seconds of "loading"

	// 	return () => clearTimeout(timer);
	// }, []);

	useEffect(() => {
		async function executeFVE(){
			try {
				console.log("DEBUG STATEMENT");
				const res = await runFVECalculation();
				setStatus(res.status);
				setMessage(res.message);
			} catch (error) {
				setStatus("failure");
				setMessage(error.message);
			}
		}
		executeFVE();
	},[])

	return (
		<Box
			borderStyle="single"
			padding={1}
			flexDirection="column"
			alignItems="center"
			width={60}
		>
			<Text color = {								
                status === 'success' ? 'green':
                status === 'warning' ? 'yellow':
                status === 'failure'? 'red': ""
                }
            >
				{Status}
			</Text>
			<Box marginTop={1} flexDirection="column" alignItems="center">
				{status === 'loading' ? (
					<>
						<Text color="">
							<Spinner type="bouncingBar" />
						</Text>
						<Text dimColor> Do Not Press Any Buttons Right Now</Text>
					</>
				) : (
					<Box flexDirection="column" alignItems="center">
						<Text
							color={
								status === 'success' ? 'green': 
								status === 'warning' ? 'yellow':
								status === 'failure' ? 'red':
								""
							}
							bold
						>
							{status.toUpperCase()}
						</Text>

						<Box marginTop={1}>
							<Text>{message}</Text>
						</Box>

						<Box marginTop={1}>
							<Text dimColor>Press Enter to return to Main Menu</Text>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default ReportStatusScreen;
