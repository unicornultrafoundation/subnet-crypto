import { Authenticator } from '../src/Authenticator'
import { AuthLinkType } from '../src/types'

describe('Sanity', function () {
  it('Should work with basic auth chain', async function () {
    const identity = {
      privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
      publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
      address: '0x1234567890123456789012345678901234567890'
    }

    const ephemeral = {
      privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
      publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
      address: '0x1234567890123456789012345678901234567890'
    }

    const chain = Authenticator.createAuthChain(identity, ephemeral, 5, 'test')

    expect(chain.length).toEqual(3)
    expect(chain[0].type).toEqual(AuthLinkType.SIGNER)
    expect(chain[1].type).toEqual(AuthLinkType.ECDSA_PERSONAL_EPHEMERAL)
    expect(chain[2].type).toEqual(AuthLinkType.ECDSA_PERSONAL_SIGNED_ENTITY)
  })
})

describe('static-signatures', function () {
  it('tests createSignature', async function () {
    const identity = {
      privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
      publicKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
      address: '0x1234567890123456789012345678901234567890'
    }

    const signature = Authenticator.createSignature(identity, 'test')
    expect(signature).toBeDefined()
  })

  it('createAuthChain with mock signature', async function () {
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

    const chain = Authenticator.createAuthChain(realAccount, ephemeralIdentity, 10, 'test')

    // first part, signed with real account
    {
      expect(chain[0].type).toEqual('SIGNER')
      expect(chain[0].payload).toEqual(realAccount.address)
    }

    // second part, signed with real account
    {
      expect(chain[1].type).toEqual('ECDSA_PERSONAL_EPHEMERAL')
      expect(chain[1].payload).toContain('Subnet Login')
      expect(chain[1].payload).toContain(ephemeralIdentity.address)
    }

    // third part, signed with ephemeral
    {
      expect(chain[2].type).toEqual('ECDSA_PERSONAL_SIGNED_ENTITY')
      expect(chain[2].payload).toEqual('test')
    }
  })
})
