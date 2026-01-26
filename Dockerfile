FROM node:23-bookworm


# Install GitHub Copilot CLI
RUN npm install -g @github/copilot


ENV PORT=4321

ENV GITHUB_TOKEN=""

# Execute Copilot CLI using a PAT and in Server mode
# https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#running-the-cli-in-server-mode
CMD ["/bin/sh", "-c", "copilot --server --port ${PORT} --log-level all"]
