// Generates the SHA1 checksum for a given folder

import glob from "glob";
import { promisify } from "util";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

const g = promisify(glob);

export const hashFiles = async (pattern) => {
  const files = await g(pattern, { dot: false, nodir: true });
  const hashes = await Promise.all(
    files.map(
      async (file) =>
        new Promise((resolve) => {
          {
            const hash = crypto.createHash("sha1");
            hash.setEncoding("hex");
            const fileStream = fs.createReadStream(file);
            fileStream.pipe(hash, { end: false });
            fileStream.on("end", () => {
              hash.end();
              const h = hash.read().toString();
              resolve(h);
            });
          }
        })
    )
  );
  const hash = crypto.createHash("sha1");
  hash.update(hashes.join(";"));
  process.stdout.write(hash.digest("hex"));
};

hashFiles(
  `${path.normalize(
    path.join(process.cwd(), process.argv[process.argv.length - 1])
  )}/**/*.*`
);
