import * as EthCrypto from 'eth-crypto'
import { HTTPProvider } from 'eth-connect'
import fetch from 'node-fetch'

import {
  Authenticator,
  getEphemeralSignatureType,
  ECDSA_PERSONAL_EPHEMERAL_VALIDATOR
} from '../src/Authenticator'
import { AuthLinkType, AuthChain } from '../src/types'
import { moveMinutes } from '../src/helper/utils'

const mainnetProvider = new HTTPProvider(process.env.ETHEREUM_MAINNET_RPC || '', { fetch: fetch })

mainnetProvider.debug = true

const PERSONAL_SIGNATURE =
  '0x49c5d57fc804e6a06f83ee8d499aec293a84328766864d96349db599ef9ebacc072892ec1f3e2777bdc8265b53d8b84edd646bdc711dd5290c18adcc5de4a2831b'

describe('Subnet Crypto', function () {
  jest.setTimeout(999999)
  describe('Get signature type', function () {
    it('should return the correct signature type', function () {
      expect(getEphemeralSignatureType(PERSONAL_SIGNATURE)).toEqual(AuthLinkType.ECDSA_PERSONAL_EPHEMERAL)
    })
  })

  describe('Validate Signature', function () {
    it('should validate request :: personal sign', async function () {
      const identity = EthCrypto.createIdentity()
      const ephemeral = EthCrypto.createIdentity()
      const chain = Authenticator.createAuthChain(identity, ephemeral, 5, 'message')
      const result = await Authenticator.validateSignature('message', chain, mainnetProvider)

      expect(result).toEqual({ ok: true, message: undefined })
    })

    it('should validate simple signatures :: personal sign', async function () {
      const chain = Authenticator.createSimpleAuthChain(
        'QmWyFNeHbxXaPtUnzKvDZPpKSa4d5anZEZEFJ8TC1WgcfU',
        '0xeC6E6c0841a2bA474E92Bf42BaF76bFe80e8657C',
        '0xaaafb0368c13c42e401e71162cb55a062b3b0a5389e0740e7dc34e623b12f0fd65e2fadac51ab5f0de8f69b1311f23f1f218753e8a957043a2a789ba721141f91c'
      )

      const result = await Authenticator.validateSignature(
        'QmWyFNeHbxXaPtUnzKvDZPpKSa4d5anZEZEFJ8TC1WgcfU',
        chain,
        mainnetProvider
      )

      expect(result.ok).toEqual(true)
    })

    it('reverts if signature was expired', async function () {
      const authority = '0x1f19d3ec0be294f913967364c1d5b416e6a74555'
      const authLink = {
        type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
        payload:
          'Subnet Login\nEphemeral address: 0x1F19d3EC0BE294f913967364c1D5B416e6A74555\nExpiration: 2020-01-15T00:45:29.278Z',
        signature: PERSONAL_SIGNATURE
      }
      try {
        await ECDSA_PERSONAL_EPHEMERAL_VALIDATOR(authority, authLink, {
          provider: mainnetProvider,
          dateToValidateExpirationInMillis: Date.now()
        })
      } catch (e) {
        expect(e.message).toMatch('Ephemeral key expired.')
      }
    })

    it('expiration check can be configured', async function () {
      const identity = EthCrypto.createIdentity()
      const ephemeral = EthCrypto.createIdentity()
      const chain = Authenticator.createAuthChain(identity, ephemeral, -5, 'message')

      // Since the ephemeral expired 5 minutes ago, validation should fail
      let result = await Authenticator.validateSignature('message', chain, mainnetProvider)

      expect(result.message).toMatch('ERROR. Link type: ECDSA_PERSONAL_EPHEMERAL. Ephemeral key expired.')

      // Since we are checking the ephemeral against 10 minutes ago, validation should pass
      result = await Authenticator.validateSignature('message', chain, mainnetProvider, moveMinutes(-10).getTime())

      expect(result.ok).toEqual(true)
    })

    it('should validate authChain structure', async function () {
      const identity = EthCrypto.createIdentity()
      const ephemeral = EthCrypto.createIdentity()
      const chain = Authenticator.createAuthChain(identity, ephemeral, 5, 'message')

      expect(Authenticator.isValidAuthChain(chain)).toEqual(true)
      expect(chain.length).toEqual(3)
      expect(chain[0].type).toEqual(AuthLinkType.SIGNER)
      expect(chain[1].type).toEqual(AuthLinkType.ECDSA_PERSONAL_EPHEMERAL)
      expect(chain[2].type).toEqual(AuthLinkType.ECDSA_PERSONAL_SIGNED_ENTITY)
    })
  })
})
