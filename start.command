#!/bin/bash

# Find right path
root=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$root"

# Add path variables
export PYTHONPATH="$PWD/lib/openzen/build"; echo $PYTHONPATH
export FLASK_APP=backend/server.py
export FLASK_ENV=development

# Run server and frontend
# trap "exit" INT TERM ERR
# trap "kill 0" EXIT

open "frontend/dist/mac/Got Your Back.app"

python3 -m flask run