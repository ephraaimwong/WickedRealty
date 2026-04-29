#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
		Usage
		  $ my-cli

		Options
			--name  Your name

		Examples
		  $ my-cli --name=Jane
		  Hello, Jane
	`,
	{
		importMeta: import.meta,
	},
);
process.stdout.write('\u001b[2J\u001b[0;0H');
render(<App name={cli.flags.name} />);
