import React, {useState} from 'react';
import {Box, Text} from 'ink';
import LogoScreen from './logoScreen.js';
import LoginScreen from './loginScreen.js';
import MenuScreen from './menuScreen.js';
import LogoutScreen from './logoutScreen.js';

export default function App() {
	const [route, setRoute] = useState("LOGO");

	const screens = {
		LOGO: <LogoScreen onDone={() => setRoute("LOGIN")}/>,
		LOGIN:<LoginScreen onSuccess={() => setRoute("MENU")}/>,
		MENU: <MenuScreen onSelect={(target)=> setRoute(target)}/>,
		// SINGLE_FVE:,
		LOGOUT: <LogoutScreen onDone={process.exit}/>
	};
	return(
		<Box
			flexDirection='column'
		>
			{screens[route]}
		</Box>
	);
}
