# reportingApp (CCR)

A mobile app for reporting street and community issues (road and pavement defects, public
transport, street furniture, environmental problems). The user picks a category and a problem,
attaches a photo (camera or library), and the app adds the device's GPS location. The report is
POSTed to a small Node/Express API, which saves it in MongoDB.

```
reportingApp/
├── src/                 Ionic 2 / Angular 2 app source (edit this, not www/)
│   ├── pages/           home, tabs, main (category list), reporting (report form)
│   └── providers/       app-settings.ts (API URL), reports-service.ts (HTTP calls)
├── server/              Express + Mongoose API (POST/GET/DELETE /reports, port 3002)
├── resources/           icon.png and splash.png source images for Cordova
├── config.xml           Cordova app config (id, plugins, Android prefs)
├── www/                 build output (generated, except www/img - see below)
├── platforms/ plugins/  Cordova output (generated)
└── extraResources/      design files, old code snippets, tutorial links (not used by the build)
```

## Tech stack and versions

This is a 2017-era project. Modern Node and Cordova **will not** build it unchanged.

| Tool | Version used | Notes |
|---|---|---|
| Node.js | **6.x** (node-sass binary is ABI 48) | Node 8 should also work. Node 10 and later break `node-sass` 4.5. |
| Ionic | ionic-angular 2.0.1, @ionic/app-scripts 1.1.0, Ionic CLI 3 | |
| Angular | 2.2.1, TypeScript 2.0.9 | |
| Cordova | cordova-android **6.0.0**, Cordova CLI 6.5 / 7.x | |
| Android build | Gradle 2.14.1, so **JDK 8** and the Android SDK | `android-minSdkVersion` is 16 |

Cordova plugins: whitelist, console, device, statusbar, ionic-plugin-keyboard, **camera (2.3.1)**,
**geolocation (2.4.1)**.

## 1. Run the API server

```bash
cd server
npm install
```

Create `server/config.json` (it holds the database password, so keep it out of git):

```json
{
  "database": "mongodb://<user>:<password>@<host>:27017/<db>?ssl=true&authSource=admin"
}
```

Then start it:

```bash
npm start      # http://localhost:3002
```

Endpoints:

- `POST /reports`: body `{ date, type, latitude, longitude, photo, comments }`. `type` is required and `photo` is a base64 data URL.
- `GET /reports`: returns all reports.
- `DELETE /reports/:reportId`: currently broken (see Known issues).

## 2. Point the app at the server

The API address is hard-coded in [src/providers/app-settings.ts](src/providers/app-settings.ts):

```ts
apiUrl: 'http://35.176.216.227:3002/',
```

For local testing in the browser, use `http://localhost:3002/`. On a phone, use your PC's LAN IP,
for example `http://192.168.1.20:3002/`. Keep the trailing slash.

## 3. Run the app in the browser

From the project root, with Node 6 or 8 active:

```bash
npm install
npm run ionic:serve        # or: ionic serve  (Ionic CLI 3)
```

Camera and geolocation are Cordova plugins, so they don't work in the browser. You can still
check the pages and the layout there.

## 4. Build and run on Android

Prerequisites: JDK 8, the Android SDK (`ANDROID_HOME` set, `platform-tools` on `PATH`), and a
phone with USB debugging enabled or an emulator.

```bash
npm install -g cordova@7 ionic@3     # or call them with npx

# Recreates platforms/ and plugins/ from config.xml
cordova platform add android@6.0.0
cordova plugin add cordova-plugin-camera@2.3.1 --save
cordova plugin add cordova-plugin-geolocation@2.4.1 --save

npm run build                         # builds src/ into www/
cordova run android                   # or: ionic cordova run android
```

The debug APK is written to `platforms/android/build/outputs/apk/android-debug.apk`.

> The camera and geolocation plugins were installed by hand at some point but are **not listed in
> `config.xml` or `package.json`**. The two `plugin add ... --save` commands above add them. After
> that, `cordova prepare` restores every plugin automatically.

To regenerate icons and splash screens from `resources/icon.png` and `resources/splash.png`, run
`ionic cordova resources` (this needs an Ionic account), or edit the `<icon>` entries in
`config.xml` by hand.

## Known issues / gotchas

- **Images live in `www/img/`, which is a build folder and is git-ignored.** The pages reference
  `img/title.png`, `img/categories.png` and others. A fresh clone won't have these files. The fix
  is to move them to `src/assets/img/` and change the `src` paths to `assets/img/...`.
- `www/js/toggle.js` isn't loaded anywhere and can be deleted.
- The `DELETE /reports/:id` route in `server/reports-routes.js` calls `Todo.findByIdAndRemove`,
  but `Todo` isn't defined. It should be `Report.Report.findByIdAndRemove`.
- `server.js` and `reports-routes.js` `require` each other. This works only because the model is
  looked up when a request arrives.
- The API has no authentication, and CORS is open to all origins.
- The root `res/` folder duplicates the icons in `resources/android/icon/` and looks like a
  leftover.
