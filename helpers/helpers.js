const { getUnpackedSettings } = require('http2')
const util = require('util')
const gc = require('../config/')
const bucket = gc.bucket('securemr-api-storage')

const { format } = util

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

exports.uploadFile = (file, userId) => new Promise((resolve, reject) => {
  var { originalname, buffer } = file;

//   filename = userId + '/' + filename;

  const blob = bucket.file(originalname.replace(/ /g, "_"))
  const blobStream = blob.createWriteStream({
    resumable: false
  });

  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', () => {
    reject(`Unable to upload file, something went wrong`)
  })
  .end(buffer)

})



async function getDownloadLink(filename) {
    try {
        console.log(filename)
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 7200 * 60 * 1000,
        };
    
        const [url] = await bucket.file(filename).getSignedUrl(options);
        if(!url) throw "File doesn't exist!!"

        return url;

    } catch (error) {
        throw error;
    }
};

async function deleteFile(filename) {
    try {
        await bucket.file(filename).delete();
        return true;
    } catch (error) {
        throw "File couldn't be deleted!"
    }
}

exports.getDownloadLink = getDownloadLink
