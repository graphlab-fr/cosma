#!/bin/bash
# Run on CI
# Do NOT run on local, as it will reset the user data dir
set -e

cosma --version

# ─── Expected error: user data dir does not exist yet ─────────────────────────
# Must exit 0 (graceful log) and must NOT create any file
cosma c --global
cosma c --global "myconfig"

# ─── Setup ────────────────────────────────────────────────────────────────────
cosma --create-user-data-dir

# ─── Case 1: local, no defaults.yml ───────────────────────────────────────────
# isGlobal=false, defaultConfigExists=false → config from Config.base
mkdir -p project-one
cd project-one
cosma c
test -f config.yml
cd ..

# ─── Case 2: isGlobal=true, hasTitle=true, no defaults.yml ────────────────────
# → named global config from Config.base
cosma c --global "myconfig"
cosma --list-projects | grep -q "myconfig"

# ─── Case 3: isGlobal=true, hasTitle=false ────────────────────────────────────
# → defaults.yml always from Config.base
cosma c --global
cosma --list-projects | grep -q "defaults"

# ─── Case 4: local, defaults.yml exists ───────────────────────────────────────
# isGlobal=false, defaultConfigExists=true → config from defaults.yml
mkdir -p project-two
cd project-two
cosma c
test -f config.yml
cd ..
