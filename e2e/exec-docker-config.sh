# Run on local with Docker image built (see docs/docker.md)

docker volume create cosma-test-data

docker run --rm -v cosma-test-data:/home/cosmauser/.local/share cosma-test --version
docker run --rm -v cosma-test-data:/home/cosmauser/.local/share cosma-test --create-user-data-dir
docker run --rm -v cosma-test-data:/home/cosmauser/.local/share cosma-test c --global
docker run --rm -v cosma-test-data:/home/cosmauser/.local/share cosma-test c

docker volume rm cosma-test-data