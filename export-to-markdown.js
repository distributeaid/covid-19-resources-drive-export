const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { cleanHTML } = require("./cleanHTML");
const exec = require("child_process").exec;

const baseFolder = "1FpnENOl1oZXLzmvvIqrR3kJgPNsGaDTo";
const exportDir = [process.cwd(), "export"];

/**
 * Lists the names and IDs of up to 100 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const listFiles = (parentFolder, parents = []) => async (auth) =>
  new Promise((resolve, reject) => {
    try {
      const drive = google.drive({ version: "v3", auth });
      drive.files.list(
        {
          q: `"${parentFolder}" in parents and (mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/vnd.google-apps.document')`,
          pageSize: 100,
          fields: "nextPageToken, files(id, name, mimeType)",
        },
        (err, res) => {
          if (err) return reject("The API returned an error: " + err);
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
    } catch (error) {
      reject(error);
    }
  });

const exportFile = async (fileId, name, parents, auth) => {
  try {
    const drive = google.drive({ version: "v3", auth });
    const folder = path.join(...exportDir, ...parents);
    const outFile = path.join(folder, `${name}.md`);
    fs.mkdirSync(folder, { recursive: true });
    return new Promise((resolve, reject) => {
      drive.files.export(
        {
          fileId,
          mimeType: "text/html",
        },
        async (err, res) => {
          if (err) return reject("The API returned an error: " + err);
          const html = cleanHTML(res.data);
          const markdown = await new Promise((resolve, reject) => {
            const e = exec("pandoc -f html -t markdown_strict", (err, res) => {
              if (err) return reject(err);
              resolve(res);
            });
            e.stdin.write(html);
            e.stdin.end();
          })
            .then((markdown) => fs.promises.writeFile(outFile, markdown))
            .then(() => {
              console.log(outFile, "written");
              resolve(outFile);
            })
            .catch(reject);
        }
      );
    });
  } catch (error) {
    reject(error);
  }
};

const main = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "jwt.keys.json"),
    scopes: "https://www.googleapis.com/auth/drive.readonly",
  });
  const client = await auth.getClient();

  await listFiles(baseFolder)(client);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
