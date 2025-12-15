#!/bin/bash -x

set -e

VERSION=${1}
BRANCH=${2}
BUILD_FOLDER=build
OUTPUT_FOLDER=output

if [[ "${1}" == "" || "${2}" == "" ]]; then
    echo "Usage: build.sh <version> <branch_name>"
    echo "Example: build.sh 1.0.0 develop"
    exit 1
fi

OS=""
if [ -n "$WINDIR" ] || [ -n "$SYSTEMROOT" ]; then
    OS="Windows"
else
    OS="Linux"
fi

# Extract source code to build folder
[ -d ${BUILD_FOLDER} ] && rm -rf ${BUILD_FOLDER}
mkdir ${BUILD_FOLDER}
git archive ${BRANCH} | tar -x -C ./${BUILD_FOLDER}/

# Get Env
(cp ${BUILD_FOLDER}/build-config/.env.${BRANCH} ${BUILD_FOLDER}/.env )

# Build frontend
(cd ${BUILD_FOLDER} && yarn install && yarn build)

# Link public/efs to efs_mount_point (Only work when set .env before running build.sh)
# (cd ${BUILD_FOLDER} && php artisan storage:link)

# Pack
[ -d ${OUTPUT_FOLDER} ] && rm -rf ${OUTPUT_FOLDER}
mkdir ${OUTPUT_FOLDER}
(cp -r ${BUILD_FOLDER}/dist/* ${OUTPUT_FOLDER}/ )