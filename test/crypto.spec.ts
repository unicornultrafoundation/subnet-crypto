import { recoverAddressFromEthSignature } from '../src/crypto'
import { AuthChain, Authenticator, AuthLinkType } from '../src'

const prodAuthChain: AuthChain = [
  {
    type: AuthLinkType.SIGNER,
    payload: '0x0824bd3fcdf51d60705dd2520f17d38c1df1f0c1',
    signature: ''
  },
  {
    type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
    payload:
      'Subnet Login\nEphemeral address: 0x05Ac0D29E42F9ae09B0EfA250BD3385FC3D0a68B\nExpiration: 2022-03-11T22:35:52.090Z',
    signature:
      '0xda87889b7d8aa91255d3f736b2519b6d3af42ce15f8fbc17dedf3d69f647835c7de6f6bfb37dd18fd5df1a7ad14ff3d118c2c880647f28b1b77b73453c97f2ea1b'
  },
  {
    type: AuthLinkType.ECDSA_PERSONAL_SIGNED_ENTITY,
    payload: 'QmUsqJaHc5HQaBrojhBdjF4fr5MQc6CqhwZjqwhVRftNAo',
    signature:
      '0xd73b0315dd39080d9b6d1a613a56732a75d68d2cef2a38f3b7be12bdab3c59830c92c6bdf394dcb47ba1aa736e0338cf9112c9eee59dbe4109b8af6a993b12d71b'
  }
]

describe('Crypto utils', function () {
  it('recovers a signature', async function () {
    const recovered = recoverAddressFromEthSignature(prodAuthChain[1].signature ?? '', prodAuthChain[1].payload)
    expect(recovered).toBeDefined()
  })

  it('recovers a the key correctly 1', async function () {
    const recovered = recoverAddressFromEthSignature(prodAuthChain[1].signature ?? '', prodAuthChain[1].payload)
    expect(recovered).toBeDefined()
  })

  it('recovers a the key correctly 2', async function () {
    const recovered = recoverAddressFromEthSignature(prodAuthChain[2].signature ?? '', prodAuthChain[2].payload)
    expect(recovered).toBeDefined()
  })

  it('initializeAuthChain with mock signature', async function () {
    const realAccount = {
      privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
      publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
      address: '0x1234567890123456789012345678901234567890'
    }

    const ephemeralIdentity = {
      privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
      publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
      address: '0x1234567890123456789012345678901234567890'
    }

    const chain = await Authenticator.initializeAuthChain(
      realAccount.address,
      ephemeralIdentity,
      10,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    async (_message: string) => '0x' + '0'.repeat(130)
    )

    expect(chain.authChain[0].payload).toEqual(realAccount.address)
    expect(chain.authChain[1].type).toEqual('ECDSA_PERSONAL_EPHEMERAL')
  })

  describe('test the sign function 0', function () {
    it('sign data using a string', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      expect(signature).toBeDefined()
    })

    it('sign data using a utf8 encoded hex string', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      expect(signature).toBeDefined()
    })

    it('recover signature using a string', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      const recovered = recoverAddressFromEthSignature(signature, 'test')
      expect(recovered).toBeDefined()
    })

    it('recover signature (pre encoded)', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      const recovered = recoverAddressFromEthSignature(signature, 'test')
      expect(recovered).toBeDefined()
    })
  })

  describe('test the sign function 1', function () {
    it('sign data using a string', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      expect(signature).toBeDefined()
    })

    it('sign data using a utf8 encoded hex string', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      expect(signature).toBeDefined()
    })

    it('recover signature using a string', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      const recovered = recoverAddressFromEthSignature(signature, 'test')
      expect(recovered).toBeDefined()
    })

    it('recover signature (pre encoded)', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      const recovered = recoverAddressFromEthSignature(signature, 'test')
      expect(recovered).toBeDefined()
    })
  })

  describe('test the sign function 2', function () {
    it('sign data using a string', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      expect(signature).toBeDefined()
    })

    it('sign data using a utf8 encoded hex string', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      expect(signature).toBeDefined()
    })

    it('recover signature using a string', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      const recovered = recoverAddressFromEthSignature(signature, 'test')
      expect(recovered).toBeDefined()
    })

    it('recover signature (pre encoded)', async function () {
      const identity = {
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        address: '0x1234567890123456789012345678901234567890'
      }

      const signature = Authenticator.createSignature(identity, 'test')
      const recovered = recoverAddressFromEthSignature(signature, 'test')
      expect(recovered).toBeDefined()
    })
  })
})
