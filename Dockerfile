FROM node:25-bookworm


# Install GitHub Copilot CLI
RUN npm install -g @github/copilot

# Expose the port for the Copilot server
ENV PORT=4321

# Espera o bien:
# ENV GITHUB_TOKEN=""
# ENV GH_TOKEN=""
# En el .env tengo que poner el PAT que será inyectado como parte del Docker Compose

EXPOSE ${PORT}

# Execute Copilot CLI using a PAT and in Server mode
# https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#running-the-cli-in-server-mode
CMD ["/bin/sh", "-c", "copilot --server --port ${PORT} --log-level all"]
