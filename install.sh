apt-get update
apt-get upgrade
apt-get install -y nodejs libwebp ffmpeg wget
npm install
npm run build
node ./build/start.js