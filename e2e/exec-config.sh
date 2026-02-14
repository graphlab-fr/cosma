# Run on CI
# Do NOT run on local, as it will reset the user data dir

cosma --version
cosma --create-user-data-dir
cosma c --global
cosma c