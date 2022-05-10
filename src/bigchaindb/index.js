import * as bip39 from 'bip39'
import BigChainDB from 'bigchaindb-driver'
import crypto from 'crypto'

// const API_PATH = 'http://localhost:9984/api/v1/'

async function main() {
  // const mnemonic = bip39.generateMnemonic()
  const mnemonic = 'fever loan palace crack hint ivory nice soccer purchase whale air ready'

  const key = crypto.scryptSync('12345678', 'salt', 24)
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv)
  let encrypted = cipher.update(mnemonic, 'utf8', 'hex') + cipher.final('hex')

  const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv)
  const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')

  // const conn = new BigChainDB.Connection(API_PATH)
  const seed = (await bip39.mnemonicToSeed(decrypted)).slice(0, 32)
  const user = new BigChainDB.Ed25519Keypair(seed)

  console.table({
    mnemonic: mnemonic,
    private: user.privateKey,
    public: user.publicKey,
    encrypted,
    decrypted,
  })
}

export default main
