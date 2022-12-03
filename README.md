# UnleashNFTs-snap

# Project Description:


UnleashNFTs-snap is a Metamask addon that offers specialised transaction insights when trading NFT on well-known marketplaces like OpenSea, X2y2, etc. It makes use of the UnleashNFTs api and Metamask Snaps to deliver the most comprehensive data-driven NFT insights. It offers NFT analytics and forensics driven by AI that combat fraud and wash trading while providing correct price estimation for digital assets. 

# How its made:

This repository was built using official examples from [MetaMask's Snap template](https://github.com/MetaMask/snaps-monorepo/tree/main/packages/examples/examples/insights). This snap retrieves information from the upcoming transaction, such as the NFT token id, contract address, and marketplace. Using the [UnleashNFTs API](https://docs.unleashnfts.com), it enriches additional information about transactions such as washtrading and price estimation details of the NFTs being traded. When approving a transaction in the metamask, users can find this information in a new tab called Unleash NFTs. The new tab contains the following information to help NFT traders to make an important decision before purchasing NFTs.

- **NFT: Estimated Price** - Estimated NFT price in ETH traded using our robust in-house Ai model. 
- **NFT: Suspected Washtraded Sales** - The number of suspicious sales in the NFT that have washtrading evidence
- **NFT: Washtraded Volume** - Total volume of washtraded sales (in USD) traded on the NFT
- **NFT: Washtraded Wallets** - Number of washtraders in the ownership history of the traded NFTs
- **Collection: Washtrade Level (1-100)** - The collection's washtrade level index, with 1 denoting no washtrading and 100 denoting a high level of washtrading.
- **Collection: Suspected Washtraded Sales** - Number of suspicious sales in the NFT collection having evidence of washtrade
- **Collection: Washtraded Volume** - Total volume of washtraded sales in the NFT being traded
- **Collection: Washtraded Wallets** - The number of washtraders in the NFT collection.
- **Market Place: Suspected Washtraded Sales** - The number of suspicious washtraded sales in the market where NFT is traded.
- **Market Place: Washtraded Volume** - Total marketplace washtraded sales volume in USD
- **Market Place: Washtraded Wallets** - The number of washtraders trading in the marketplace.
