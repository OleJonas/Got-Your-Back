#!/bin/bash

# Find right path
root=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$root"

# Add path variables
export PYTHONPATH=lib/openzen/build
export FLASK_APP=backend/server.py
export FLASK_ENV=production

# Run server and frontend
trap "exit" INT TERM ERR
trap "kill 0" EXIT

python3 -m flask run &

wait