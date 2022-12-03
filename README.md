# UnleashNFTs-snap

# Project Description:


UnleashNFTs-snap is a Metamask addon that offers specialised transaction insights when trading NFT on well-known marketplaces like OpenSea, X2y2, etc. It makes use of the UnleashNFTs api and Metamask Snaps to deliver the most comprehensive data-driven NFT insights. It offers NFT analytics and forensics driven by AI that combat fraud and wash trading while providing correct price estimation for digital assets. 

# How its made:

This repository was built using official examples from [MetaMask's Snap template](https://github.com/MetaMask/snaps-monorepo/tree/main/packages/examples/examples/insights). This snap retrieves information from the upcoming transaction, such as the NFT token id, contract address, and marketplace. Using the [UnleashNFTs API](https://docs.unleashnfts.com), it enriches additional information about transactions such as washtrading and price estimation details of the NFTs being traded. When approving a transaction in the metamask, users can find this information in a new tab called Unleash NFTs. The new tab contains the following information to help NFT traders to make an informed decision before purchasing NFTs.

- **NFT: Estimated Price** - Estimated NFT price in ETH traded using our robust in-house Ai model. 
- **NFT: Suspected Washtraded Sales** - The number of suspicious sales in the NFT that have washtrading evidence
- **NFT: Washtraded Volume** - Total volume of washtraded sales (in USD) traded on the NFT
- **NFT: Washtraded Wallets** - Number of washtraders in the ownership history of the traded NFTs
- **Collection: Suspected Washtrade Level (1-100)** - The collection's washtrade level index, with 1 denoting no washtrading and 100 denoting a high level of washtrading.
- **Collection: Suspected Washtraded Sales** - Number of suspicious sales in the NFT collection having evidence of washtrade
- **Collection: Suspected Washtraded Volume** - Total volume of washtraded sales in the NFT being traded
- **Collection: Suspected Washtraded Wallets** - The number of washtraders in the NFT collection.
- **Market Place: Suspected Washtraded Sales** - The number of suspicious washtraded sales in the market where NFT is traded.
- **Market Place: Suspected Washtraded Volume** - Total marketplace washtraded sales volume in USD
- **Market Place: Suspected Washtraded Wallets** - The number of washtraders trading in the marketplace.

## How to use unleashnfts-snap:
### Prerequisites
- Nodejs 16 or higher is required. 
- MetaMask Flask: It is available for installation via this [link](https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk). Because we cannot have multiple MetaMask versions in the same browser profile. So we have a choice between the two options. 1. Remove the existing MetaMask and install the MetaMask Flask from here. 2. Make a new browser profile and install the MetaMask Flask.
- API KEY from [UnleashNFTs](UnleashNFTs.com) - To request an API key, please send an email to info@bitscrunch.com with your organisation's name, field of work, designation, and project details.

### Installation
1. Clone this repository. 
```
git clone https://github.com/bitsCrunch/unleashnfts-snaps
cd unleashnfts-snaps
```
2. Install dependencies
```
yarn install
```
3. Update file ‘env.data.json’ under root path with the API_KEY obtained from [UnleashNFTs](UnleashNFTs.com). 
```
{
UNLEASH_NFTS_API_KEY: “<PASTE THE UNLEASHNFTS API_KEY HERE>”
}
```
4. Run the unleashnfts-snaps
```
yarn start
```
5. Navigate to http://localhost:8087 and click the 'Install UnleashNFTs-snap' button, then follow the instructions on the MetaMask UI.
6. Go to the OpenSea market (https://opensea.io). Use the MetaMask wallet to connect and trade any NFT. The UnleashNFTs tab will appear in the transaction approval window. If the NFT being traded is supported by UnleashNFTs, the tab will show statistics about price estimation and wash trading for the NFT, Collection, and Marketplace. After reviewing the analytics provided by UnleashNFTs-snaps, the transaction initiator can accept or reject the transaction.

### Limitations
- Seaport from Opensea Marketplace is aupported
- Ethereum and Polygon chain is only supported
- Handling API key can be more secured compared to the current approach
- Insighta are available for limited number of NFTs for now

### Disclaimer 
This is not investment advice it is only meant for informational purposes. Please consult with your investment, tax, or legal advisor before making any investment decisions.
