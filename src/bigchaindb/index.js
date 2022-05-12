import * as bip39 from 'bip39'
import BigChainDB from 'bigchaindb-driver'
import crypto from 'crypto'

// const API_PATH = 'http://localhost:9984/api/v1/'
// 0.0.0.0:9984

async function main() {
  await console.log("hello_bigchain_call_start_1")
  // const mnemonic = bip39.generateMnemonic()
  //create mnemonic
  const mnemonic = 'fever loan palace crack hint ivory nice soccer purchase whale air ready'

  await console.log("hello_bigchain_call_start_2")
  const key = crypto.scryptSync('12345678', 'salt', 24)
  const iv = crypto.randomBytes(16)

  await console.log("hello_bigchain_call_start_3")
  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv)
  let encrypted = cipher.update(mnemonic, 'utf8', 'hex') + cipher.final('hex')

  await console.log("hello_bigchain_call_start_4")
  const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv)
  const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')

  await console.log("hello_bigchain_call_start_5")
  // const conn = new BigChainDB.Connection(API_PATH)
  const seed = (await bip39.mnemonicToSeed(decrypted)).slice(0, 32)
  const user = new BigChainDB.Ed25519Keypair(seed)

  await console.log("hello_bigchain_call_start_6")
  await console.table({
    mnemonic: mnemonic,
    private: user.privateKey,
    public: user.publicKey,
    encrypted,
    decrypted,
  })
  await console.log("hello_bigchain_call_start_7")
}

export default main
