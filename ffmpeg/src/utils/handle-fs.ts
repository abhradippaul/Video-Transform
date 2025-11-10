import fs from "fs";

export async function deleteLocalData(location: string) {
  await new Promise((resolve, reject) => {
    fs.unlink(location, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("");
      }
    });
  });
}
