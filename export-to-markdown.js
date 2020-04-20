const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { cleanHTML } = require("./cleanHTML");
const exec = require("child_process").exec;

const baseFolder = "1FpnENOl1oZXLzmvvIqrR3kJgPNsGaDTo";

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

const main = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "jwt.keys.json"),
    scopes: "https://www.googleapis.com/auth/drive.readonly",
  });
  const client = await auth.getClient();

  listFiles(baseFolder)(client);
};

main();
