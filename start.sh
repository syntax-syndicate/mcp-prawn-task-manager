#!/bin/bash
SOURCES_DIR=$(dirname "$0")
PWD_DIR=$(pwd)
cd $SOURCES_DIR
export TEMPLATES_USE=en
export ENABLE_GUI=true
export DATA_DIR="$@"
bun install
bun run build
bun run start
