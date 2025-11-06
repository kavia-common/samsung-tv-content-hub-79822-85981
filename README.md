# samsung-tv-content-hub-79822-85981

Packaging (Tizen .wgt) quick start:
- cd mytv_frontend
- npm install
- npm run build
- npm run package:tizen
Result: mytv_frontend/app.wgt created without requiring a system 'zip' binary, with config.xml at the root of the archive.