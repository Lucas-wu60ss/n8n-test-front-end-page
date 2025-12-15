#!/bin/bash -x

# 顏色 Color
COLOR_LBULE='\033[1;34m'
COLOR_LGREEN='\033[1;32m'
COLOR_LPURPLE='\033[1;35m'
COLOR_NONE='\033[0m' # No Color

set -e

OUTPUT_FOLDER=output

print_color() {
    local color=$1
    local message=$2
    printf "${color}${message}${COLOR_NONE} \n"
}

print_color "${COLOR_LBULE}" "===================================================================="
print_color "${COLOR_LBULE}" "INSTALL NEW_VERSION DEPENDENCIES: ${COLOR_LGREEN}\n"

# 環境變數設置
cp ./build-config/.env.develop ./.env

# Build
print_color "${COLOR_LPURPLE}" "Install Frontend Packages and Build \n"
npm install --quiet --no-progress --legacy-peer-deps
npm run build

# 確保 build 目錄存在
if [ ! -d "./dist" ]; then
  echo "Error: Build directory './dist' does not exist!"
  exit 1
fi

# Pack
[ -d ${OUTPUT_FOLDER} ] && rm -rf ${OUTPUT_FOLDER}
mkdir ${OUTPUT_FOLDER}
(cp -r ./dist/* ${OUTPUT_FOLDER}/ )