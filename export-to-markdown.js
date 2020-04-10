const fs = require("fs");
const readline = require("readline");
const path = require("path");
const { google } = require("googleapis");
const { cleanHTML } = require("./cleanHTML");
const exec = require("child_process").exec;

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
const baseFolder = "1FpnENOl1oZXLzmvvIqrR3kJgPNsGaDTo";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles(baseFolder));
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const listFiles = (parentFolder, parents = []) => (auth) => {
  const drive = google.drive({ version: "v3", auth });
  drive.files.list(
    {
      q: `"${parentFolder}" in parents and (mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/vnd.google-apps.document')`,
      pageSize: 10,
      fields: "nextPageToken, files(id, name, mimeType)",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const files = res.data.files;
      if (files.length) {
        files.map((file) => {
          if (file.mimeType === "application/vnd.google-apps.document") {
            exportFile(file.id, file.name, parents, auth);
          }
          if (file.mimeType === "application/vnd.google-apps.folder") {
            listFiles(file.id, [...parents, file.name.trim()])(auth);
          }
        });
      }
    }
  );
};

const exportFile = (fileId, name, parents, auth) => {
  const drive = google.drive({ version: "v3", auth });
  const folder = path.join(process.cwd(), "export", ...parents);
  const outFile = path.join(folder, `${name}.md`);
  fs.mkdirSync(folder, { recursive: true });
  const dest = fs.createWriteStream(outFile);
  drive.files.export(
    {
      fileId,
      mimeType: "text/html",
    },
    async (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const html = cleanHTML(res.data);
      const markdown = await new Promise((resolve, reject) => {
        const e = exec("pandoc -f html -t markdown_strict", (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
        e.stdin.write(html);
        e.stdin.end();
      });
      await fs.promises.writeFile(outFile, markdown);
      console.log(outFile, "written");
    }
  );
};
