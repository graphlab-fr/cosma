# Docker - Test and Development Environment

Cosma provides a **test and development** Docker image to run the application in an isolated and reproducible Linux environment. This image is **not** intended for production or distribution.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine

## Build the image

```bash
docker build -t cosma-test .
```

## Run Cosma in the container

```bash
docker run --rm cosma-test --version
docker run --rm cosma-test --help
```

## Test configuration

```bash
# Create user data directory
docker run --rm cosma-test --create-user-data-dir

# Note: This does not persist after the container stops.
# To persist, use a volume (see below).
```

## Tests with persistence

```bash
# Create a named volume
docker volume create cosma-test-data

# Use the volume
docker run --rm -v cosma-test-data:/home/cosmauser/.local/share cosma-test --create-user-data-dir
```

## Run tests

```bash
# Unit tests
docker run --rm --entrypoint npm cosma-test run test:unit

# Config-specific tests
docker run --rm --entrypoint npx cosma-test jest core/models/config.docker.spec.js
```

## Interactive mode for debugging

```bash
docker run --rm -it --entrypoint /bin/sh cosma-test

# Then inside the container:
cosma --version
cosma --help

exit
```

## Cleanup

```bash
# Remove the image
docker rmi cosma-test

# Remove the volume (if created)
docker volume rm cosma-test-data
```
