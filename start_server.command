#!/bin/bash

# Find right path
root=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$root"

# Add path variables
export PYTHONPATH="$PWD/lib/openzen/build";

cd backend && waitress-serve --port 60066 "server:app"
