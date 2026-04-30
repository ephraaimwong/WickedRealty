import React, {useState} from 'react';
import {Box, Text} from 'ink';
import LogoScreen from './screens/logoScreen.js';
import LoginScreen from './screens/loginScreen.js';
import MenuScreen from './screens/menuScreen.js';
import LogoutScreen from './screens/logoutScreen.js';
import SingleFVEScreen from './screens/singleFVEScreen.js';
import ErrorLogScreen from './screens/errorLogScreen.js';
import ReportStatusScreen from './screens/reportStatusScreen.js';
import BatchFVEScreen from './screens/batchFVEScreen.js';
import ClientAdjustmentScreen from './screens/clientAdjustmentScreen.js';
import AddUserScreen from './screens/addUserScreen.js';
import RemoveUserScreen from './screens/removeuserScreen.js';
import AppVersionScreen from './screens/appVersionScreen.js';

export default function App() {
	//#region session user handling
	const [currentUser, setCurrentUser] = useState(null);
	const handleLogin = (user) => {
		setCurrentUser(user);
		setRoute("MENU");
	};
	
	const handleLogout = () => {
		setCurrentUser(null);
		setRoute("LOGOUT")
	};
	//#endregion
	
	//#region route handling
	const [route, setRoute] = useState("LOGO");

	const renderScreen = () => {

		const routePermissions = {
			SINGLE_FVE: 'fve_calculate',
			BATCH_FVE: 'fve_calculate',
			CMA: 'market_tune',
			STATUS: 'fve_calculate',
			ADD_USER: 'user_mgmt',
			REMOVE_USER: 'user_mgmt',
			ERRORLOG: 'infra_monitor'
		};

		// 2. Check if the current route is protected
		const requiredPermission = routePermissions[route];
		
		// 3. If protected, verify the user has the "Keycard"
		if (requiredPermission && !currentUser?.permissions?.includes(requiredPermission)) {
			// Redirect to a Permission Denied state or back to Menu
			return (
				<Box flexDirection="column" borderStyle="double" borderColor="red" padding={1}>
					<Text color="red" bold>ACCESS DENIED</Text>
					<Text>You lack the '{requiredPermission}' permission.</Text>
					<Text dimColor>Press Enter to return to Menu</Text>
				</Box>
			);
		}

		switch (route) {
			case "LOGO":
				return <LogoScreen onDone={() => setRoute("LOGIN")}/>;
			case "LOGIN":
				return <LoginScreen onSuccess={handleLogin}/>;
			case "MENU":
				return <MenuScreen user={currentUser} onSelect={(target)=>setRoute(target)} onLogout={handleLogout}/>;
			case "SINGLE_FVE":
				return <SingleFVEScreen onSelect={(target)=>{setRoute(target)}}/>;
			case "BATCH_FVE":
				return <BatchFVEScreen onSelect={(target)=>{setRoute(target)}}/>;
			case "CMA":
				return <ClientAdjustmentScreen onSelect={(target) => setRoute(target)}/>;
			case "ERRORLOG":
				return <ErrorLogScreen onSelect={(target) => setRoute(target)}/>;
			case "STATUS":
				return <ReportStatusScreen onBack={()=> setRoute("MENU")}/>;
			case "ADD_USER":
				return <AddUserScreen onDone={()=> setRoute("MENU")}/>;
			case "REMOVE_USER":
				return <RemoveUserScreen user={currentUser} onDone={()=> setRoute("MENU")}/>
			case "APP_VERSION":
				return <AppVersionScreen onDone={()=>setRoute("MENU")}/>;
			case "LOGOUT":
				return <LogoutScreen onDone={process.exit}/>;
		}
	};
	//#endregion
	return(
		<Box
			flexDirection='column'
		>
			{renderScreen()}
		</Box>
	);
}
