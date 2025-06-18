import algosdk from 'algosdk'

// Algorand configuration for testnet
const ALGORAND_SERVER = 'https://testnet-api.algonode.cloud'
const ALGORAND_PORT = 443
const ALGORAND_TOKEN = ''

// Initialize Algorand client
export const algodClient = new algosdk.Algodv2(ALGORAND_TOKEN, ALGORAND_SERVER, ALGORAND_PORT)

// Mock wallet for demo purposes - in production, this would be user's wallet
const DEMO_MNEMONIC = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art'
const demoAccount = algosdk.mnemonicToSecretKey(DEMO_MNEMONIC)

export interface NFTMetadata {
  title: string
  description: string
  contributionId: string
  authorEmail: string
  votes: number
  category: string
  dateEarned: string
}

export interface NFTMintResult {
  success: boolean
  transactionId?: string
  assetId?: number
  error?: string
  metadata?: NFTMetadata
}

// Generate NFT metadata for IPFS (mock implementation)
function generateNFTMetadata(contribution: {
  id: string
  title: string
  content: string
  author_email: string
  votes: number
  category: string
}): NFTMetadata {
  return {
    title: `Community Contributor NFT: ${contribution.title}`,
    description: `Awarded for reaching 10+ votes on "${contribution.title}" in the AI Impact Navigator community. This NFT represents valuable contribution to the AI community discussion.`,
    contributionId: contribution.id,
    authorEmail: contribution.author_email,
    votes: contribution.votes,
    category: contribution.category,
    dateEarned: new Date().toISOString()
  }
}

// Mock IPFS upload function
async function uploadToIPFS(metadata: NFTMetadata): Promise<string> {
  // In production, this would upload to IPFS and return the hash
  // For demo, we'll return a mock IPFS URL
  const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`
  return `https://ipfs.io/ipfs/${mockHash}`
}

// Create Algorand Standard Asset (ASA) for NFT
async function createNFTAsset(
  metadata: NFTMetadata,
  metadataUrl: string
): Promise<{ assetId: number; txId: string }> {
  try {
    // Get suggested transaction parameters
    const suggestedParams = await algodClient.getTransactionParams().do()
    
    // Create asset creation transaction
    const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: demoAccount.addr,
      suggestedParams,
      defaultFrozen: false,
      unitName: 'AINFT',
      assetName: metadata.title.substring(0, 32), // Max 32 chars
      manager: demoAccount.addr,
      reserve: demoAccount.addr,
      freeze: demoAccount.addr,
      clawback: demoAccount.addr,
      assetURL: metadataUrl.substring(0, 96), // Max 96 chars
      assetMetadataHash: undefined,
      total: 1, // NFT should have total supply of 1
      decimals: 0
    })

    // Sign the transaction
    const signedTxn = assetCreateTxn.signTxn(demoAccount.sk)

    // Submit the transaction
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do()

    // Wait for confirmation
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4)
    
    // Get the asset ID from the transaction
    const assetId = confirmedTxn['asset-index']

    return { assetId, txId }
  } catch (error) {
    console.error('Error creating NFT asset:', error)
    throw error
  }
}

// Transfer NFT to recipient (mock implementation)
async function transferNFT(assetId: number, recipientAddress: string): Promise<string> {
  try {
    // In production, this would:
    // 1. Opt the recipient into the asset
    // 2. Transfer the NFT from creator to recipient
    // 3. Remove manager/freeze/clawback permissions to make it truly decentralized
    
    // For demo, we'll simulate this process
    console.log(`Transferring NFT ${assetId} to ${recipientAddress}`)
    
    // Mock transaction ID
    const mockTxId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return mockTxId
  } catch (error) {
    console.error('Error transferring NFT:', error)
    throw error
  }
}

// Main function to mint NFT for contribution
export async function mintContributionNFT(contribution: {
  id: string
  title: string
  content: string
  author_email: string
  votes: number
  category: string
}): Promise<NFTMintResult> {
  try {
    console.log('Starting NFT minting process for contribution:', contribution.id)
    
    // Generate metadata
    const metadata = generateNFTMetadata(contribution)
    
    // Upload metadata to IPFS (mock)
    const metadataUrl = await uploadToIPFS(metadata)
    console.log('Metadata uploaded to IPFS:', metadataUrl)
    
    // Create NFT asset on Algorand
    const { assetId, txId } = await createNFTAsset(metadata, metadataUrl)
    console.log('NFT asset created:', { assetId, txId })
    
    // For demo purposes, we'll use a mock recipient address
    // In production, this would be the user's actual Algorand wallet address
    const mockRecipientAddress = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    
    // Transfer NFT to recipient (mock)
    const transferTxId = await transferNFT(assetId, mockRecipientAddress)
    console.log('NFT transferred:', transferTxId)
    
    return {
      success: true,
      transactionId: txId,
      assetId,
      metadata
    }
  } catch (error) {
    console.error('NFT minting failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Function to verify NFT ownership (mock implementation)
export async function verifyNFTOwnership(userAddress: string, assetId: number): Promise<{
  owns: boolean
  assetId: number
  userAddress: string
  error?: string
}> {
  try {
    // In production, this would query the Algorand blockchain
    // to check if the user's address holds the specified NFT
    
    console.log(`Verifying NFT ownership: ${assetId} for ${userAddress}`)
    
    // Mock verification - in demo, assume user owns the NFT
    return {
      owns: true,
      assetId,
      userAddress
    }
  } catch (error) {
    console.error('Error verifying NFT ownership:', error)
    return {
      owns: false,
      assetId,
      userAddress,
      error: 'Failed to verify NFT ownership'
    }
  }
}

// Function to get user's NFT collection (mock implementation)
export async function getUserNFTs(userAddress: string): Promise<Array<{
  assetId: number
  name: string
  description: string
  imageUrl: string
  metadata: NFTMetadata
}>> {
  try {
    // In production, this would query the Algorand blockchain
    // to get all NFTs owned by the user's address
    
    console.log(`Fetching NFTs for user: ${userAddress}`)
    
    // Mock NFT collection for demo
    return [
      {
        assetId: 123456789,
        name: 'Community Contributor NFT',
        description: 'Earned for valuable community contribution',
        imageUrl: 'https://via.placeholder.com/200x200/6366f1/ffffff?text=NFT',
        metadata: {
          title: 'Community Contributor NFT: How I Used Bolt.new to Build My First AI App',
          description: 'Awarded for reaching 10+ votes on community contribution',
          contributionId: 'contrib_123',
          authorEmail: 'user@example.com',
          votes: 24,
          category: 'Tutorial',
          dateEarned: '2025-01-16T12:00:00Z'
        }
      }
    ]
  } catch (error) {
    console.error('Error fetching user NFTs:', error)
    return []
  }
}

// Function to get NFT details by asset ID
export async function getNFTDetails(assetId: number): Promise<{
  success: boolean
  data?: {
    assetId: number
    name: string
    unitName: string
    total: number
    decimals: number
    creator: string
    url: string
    metadata?: NFTMetadata
  }
  error?: string
}> {
  try {
    // In production, this would query the Algorand blockchain
    // to get asset details
    
    console.log(`Fetching NFT details for asset: ${assetId}`)
    
    // Mock NFT details for demo
    return {
      success: true,
      data: {
        assetId,
        name: 'Community Contributor NFT',
        unitName: 'AINFT',
        total: 1,
        decimals: 0,
        creator: demoAccount.addr,
        url: 'https://ipfs.io/ipfs/QmMockHash123',
        metadata: {
          title: 'Community Contributor NFT',
          description: 'Awarded for valuable community contribution',
          contributionId: 'contrib_123',
          authorEmail: 'user@example.com',
          votes: 15,
          category: 'Tutorial',
          dateEarned: new Date().toISOString()
        }
      }
    }
  } catch (error) {
    console.error('Error fetching NFT details:', error)
    return {
      success: false,
      error: 'Failed to fetch NFT details'
    }
  }
}

// Utility function to format Algorand address for display
export function formatAlgorandAddress(address: string): string {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Function to generate a demo Algorand address for testing
export function generateDemoAddress(): string {
  // Generate a random demo address for testing
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let result = ''
  for (let i = 0; i < 58; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}