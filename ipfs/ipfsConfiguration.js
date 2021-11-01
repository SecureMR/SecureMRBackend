const IPFS = require('ipfs-core')
const all = require('it-all')
const { concat: uint8ArrayConcat } = require('uint8arrays/concat')
const { fromString: uint8ArrayFromString } = require('uint8arrays/from-string')
const { toString: uint8ArrayToString } = require('uint8arrays/to-string')

async function ipfsInit (localFile) {
  const node = await IPFS.create()
  const version = await node.version()

  console.log('Version:', version.version)

  const file = await node.add({
    path: 'localFile.txt',
  })

  console.log('Added file:', file.path, file.cid.toString())

  const data = uint8ArrayConcat(await all(node.cat(file.cid)))

  console.log('Added file contents:', uint8ArrayToString(data))
}
