# WickedReality
---
Use ink js for TUI application development (https://github.com/vadimdemedes/ink)


## Run locally
1. `cd my-cli`
2. `npm install`
3. `npm run build`
4. `npm run dev` if wanting Hot Reload for dev
5. `node dist/cli.js`

## Run Docker
1. `docker compose up -d --build`
    * App will be on port 7681
2. `docker compose down` to tear down

## Key Files/Folders
* `users.json`
    - List of authorized users
* `adjustments.json`
    - Property weights
* `INPUT_FILES_HERE`
    - Property CSV to be calculated
* `FVE_OUTPUT`
    - FVE reports
* `ERROR_LOGS`
    - error logs by day

## Development
1. DO NOT TOUCH `my-cli/dist` files 
2. `my-cli/source/services` contains models
3. `my-cli/source/screens` contains views 
4. `my-cli/source/cli.js` is the entry point for the application 
