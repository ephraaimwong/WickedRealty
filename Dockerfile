FROM node:20-bookworm-slim

# Install ttyd and build dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && curl -L https://github.com/tsl0922/ttyd/releases/latest/download/ttyd.x86_64 -o /usr/local/bin/ttyd \
    && chmod +x /usr/local/bin/ttyd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the CLI source
COPY my-cli/package*.json ./
RUN npm install

COPY my-cli/ .

# Build the project (babel compilation to dist/)
RUN npm run build

# ENTRYPOINT is set to ttyd
ENTRYPOINT ["ttyd"]
