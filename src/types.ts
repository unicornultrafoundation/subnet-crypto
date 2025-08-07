export type Signature = string
export type EthAddress = string

export enum AuthLinkType {
  SIGNER = 'SIGNER',
  ECDSA_PERSONAL_EPHEMERAL = 'ECDSA_PERSONAL_EPHEMERAL',
  ECDSA_PERSONAL_SIGNED_ENTITY = 'ECDSA_PERSONAL_SIGNED_ENTITY'
}

export type AuthLink = {
  type: AuthLinkType
  payload: string
  signature: string
}

export type AuthChain = AuthLink[]

export type IdentityType = {
  privateKey: string
  publicKey: string
  address: string
}

export type AuthIdentity = {
  ephemeralIdentity: IdentityType
  expiration: Date
  authChain: AuthChain
}

export type ValidationResult = {
  ok: boolean
  message?: string
}
