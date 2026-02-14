FROM node:22-alpine

# Create a non-root user before copying files
RUN addgroup -S cosmauser && adduser -S cosmauser -G cosmauser

# Set the working directory and make it accessible to cosmauser
WORKDIR /app
RUN chown cosmauser:cosmauser /app

# Copy dependency files with direct permissions
COPY --chown=cosmauser:cosmauser package.json package-lock.json* ./

# Install dependencies (--ignore-scripts to prevent prepare from triggering the build)
RUN npm ci --ignore-scripts

# Copy source code with direct permissions
COPY --chown=cosmauser:cosmauser . .

# Build the application (webpack front + back)
RUN ./node_modules/.bin/webpack build --config ./webpack-front.config.mjs --mode development
RUN ./node_modules/.bin/webpack build --config ./webpack-back.config.mjs --mode development

RUN npm i . --global

# Create the user data directory with correct permissions
RUN mkdir -p /home/cosmauser/.local/share && \
    chown -R cosmauser:cosmauser /home/cosmauser/.local

# Switch to the non-root user
# From this point, cosmauser has:
# - Write access to /app (for config.yml in local mode)
# - Write access to /home/cosmauser/.local/share (for --global and user data dir)
USER cosmauser

# The user data directory will be in /home/cosmauser/.local/share/cosma-cli/
# thanks to env-paths

# Default entrypoint
ENTRYPOINT ["node", "dist/back.cjs"]
CMD ["--help"]
