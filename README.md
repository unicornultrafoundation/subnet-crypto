A lightweight cryptographic authentication library for Subnet applications, providing ECDSA personal signature validation and ephemeral key management.

## Features

- 🔐 ECDSA Personal Signature Authentication
- ⏰ Ephemeral Key Management with Expiration
- 🔗 AuthChain Creation and Validation
- 🚀 Lightweight - No external schema dependencies
- 📦 TypeScript Support

## Installation

```bash
npm install @subnet-node/crypto
```

## Quick Start

### Basic Usage

```typescript
import { Authenticator, AuthIdentity } from '@subnet-node/crypto'
import { Wallet } from 'ethers'

// Create an ephemeral identity
const ephemeralWallet = Wallet.createRandom()
const ephemeralIdentity = {
  address: ephemeralWallet.address,
  privateKey: ephemeralWallet.privateKey,
  publicKey: ephemeralWallet.publicKey
}

// Initialize auth chain with your main wallet
const identity = await Authenticator.initializeAuthChain(
  '0xYourMainWalletAddress',
  ephemeralIdentity,
  10, // expiration in minutes
  async (message) => {
    // Sign message with your main wallet
    return await yourMainWallet.signMessage(message)
  }
)

// Use the identity to sign payloads
const signedPayload = Authenticator.signPayload(identity, 'your-payload-id')
```

### Create AuthChain Manually

```typescript
import { Authenticator } from '@subnet-node/crypto'

const mainWallet = Wallet.createRandom()
const ephemeralWallet = Wallet.createRandom()

const authChain = Authenticator.createAuthChain(
  {
    address: mainWallet.address,
    privateKey: mainWallet.privateKey,
    publicKey: mainWallet.publicKey
  },
  {
    address: ephemeralWallet.address,
    privateKey: ephemeralWallet.privateKey,
    publicKey: ephemeralWallet.publicKey
  },
  10, // expiration in minutes
  'your-payload-id'
)
```

### Validate Signatures

```typescript
import { Authenticator } from '@subnet-node/crypto'

// Validate an auth chain
const result = await Authenticator.validateSignature(
  'expected-payload-id',
  authChain,
  provider // Ethereum provider
)

if (result.ok) {
  console.log('Signature is valid!')
} else {
  console.error('Validation failed:', result.message)
}
```

## API Reference

### Authenticator

#### `initializeAuthChain(ethAddress, ephemeralIdentity, expirationMinutes, signer)`
Creates a new auth chain with an ephemeral identity.

- `ethAddress`: Main wallet address
- `ephemeralIdentity`: Ephemeral wallet details
- `expirationMinutes`: TTL in minutes
- `signer`: Function to sign messages

#### `createAuthChain(ownerIdentity, ephemeralIdentity, expirationMinutes, entityId)`
Creates an auth chain manually.

#### `validateSignature(expectedPayload, authChain, provider, dateToValidate?)`
Validates an auth chain signature.

#### `createSimpleAuthChain(payload, ownerAddress, signature)`
Creates a simple auth chain for direct signature validation.

#### `signPayload(authIdentity, entityId)`
Signs a payload with an existing auth identity.

### Types

```typescript
interface AuthIdentity {
  ephemeralIdentity: IdentityType
  expiration: Date
  authChain: AuthChain
}

interface IdentityType {
  privateKey: string
  publicKey: string
  address: string
}

type AuthChain = AuthLink[]

interface AuthLink {
  type: AuthLinkType
  payload: string
  signature: string
}

enum AuthLinkType {
  SIGNER = 'SIGNER',
  ECDSA_PERSONAL_EPHEMERAL = 'ECDSA_PERSONAL_EPHEMERAL',
  ECDSA_PERSONAL_SIGNED_ENTITY = 'ECDSA_PERSONAL_SIGNED_ENTITY'
}
```

## Examples

### Using with MetaMask

```typescript
import { Authenticator } from '@subnet-node/crypto'

async function createIdentityWithMetaMask() {
  if (!window.ethereum) {
    throw new Error('MetaMask not found')
  }

  const provider = window.ethereum
  const accounts = await provider.request({ method: 'eth_requestAccounts' })
  const address = accounts[0]

  const ephemeralWallet = Wallet.createRandom()
  const ephemeralIdentity = {
    address: ephemeralWallet.address,
    privateKey: ephemeralWallet.privateKey,
    publicKey: ephemeralWallet.publicKey
  }

  const identity = await Authenticator.initializeAuthChain(
    address,
    ephemeralIdentity,
    10,
    async (message) => {
      return await provider.request({
        method: 'personal_sign',
        params: [message, address]
      })
    }
  )

  return identity
}
```

### Using with Web3.js

```typescript
import { Authenticator } from '@subnet-node/crypto'
import Web3 from 'web3'

async function createIdentityWithWeb3(web3: Web3, address: string) {
  const ephemeralWallet = Wallet.createRandom()
  const ephemeralIdentity = {
    address: ephemeralWallet.address,
    privateKey: ephemeralWallet.privateKey,
    publicKey: ephemeralWallet.publicKey
  }

  const identity = await Authenticator.initializeAuthChain(
    address,
    ephemeralIdentity,
    10,
    async (message) => {
      return await web3.eth.personal.sign(message, address, '')
    }
  )

  return identity
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Watch mode
npm run watch
```

## License

Apache-2.0

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
