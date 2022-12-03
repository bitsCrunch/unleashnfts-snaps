import { decode } from '@metamask/abi-utils';
import {
  add0x,
  bytesToHex,
  hasProperty,
  isObject,
  remove0x,
} from '@metamask/utils';
import { UNLEASH_NFTS_API_KEY } from '../data';

// The API endpoint to get a list of functions by 4 byte signature.
const API_ENDPOINT = 'https://api.unleashnfts.com/api/v1';

// const goodValueIcon = '✅';
// const noDataIcon = '❗';
// const badValueIcon = '❌';

const warningIcon = '❗';

// These fields come from an API.
/* eslint-disable @typescript-eslint/naming-convention */
type FourByteSignature = {
  id: number;
  created_at: string;
  text_signature: string;
  hex_signature: string;
  bytes_signature: string;
};
/* eslint-enable @typescript-eslint/naming-convention */

const getNFTData = (data, priceData) => {
  let nftData = {
    estimatedPrice: `No data avaialable!`,
    washtrade_suspect_sales: `No data avaialable!`,
    washtrade_volume: `No data avaialable!`,
    washtrade_wallets: `No data avaialable!`,
  };
  let isGood = false;
  if (priceData && priceData.price_estimate) {
    nftData.estimatedPrice = `${data.price_estimate.value} ETH`;
  }
  if (data && data.metric_values) {
    let washtrade_change =
      data.metric_values.volume.value /
      data.metric_values.washtrade_volume.value;
    isGood = typeof washtrade_change === 'number' && washtrade_change > 10;
    nftData.washtrade_suspect_sales = ` ${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_suspect_sales.value
    }`;
    nftData.washtrade_volume = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_volume.value
    } USD ${
      isNaN(washtrade_change) ? '' : '(' + washtrade_change.toFixed(2) + '%)'
    }`;
    nftData.washtrade_wallets = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_wallets.value
    }`;
  }
  return nftData;
};

const getCollectionData = (data) => {
  let collectionData = {
    washtrade_level: `No data avaialable!`,
    washtrade_suspect_sales: `No data avaialable!`,
    washtrade_volume: `No data avaialable!`,
    washtrade_wallets: `No data avaialable!`,
  };
  let isGood = true;
  if (data && data.metric_values) {
    let washtrade_change =
      data.metric_values.volume.value /
      data.metric_values.washtrade_volume.value;
    isGood = typeof washtrade_change === 'number' && washtrade_change > 10;
    collectionData.washtrade_level = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_level.value
    }`;
    collectionData.washtrade_suspect_sales = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_suspect_sales.value
    }`;
    collectionData.washtrade_volume = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_volume.value
    } USD ${
      isNaN(washtrade_change) ? '' : '(' + washtrade_change.toFixed(2) + '%)'
    }`;
    collectionData.washtrade_wallets = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_wallets.value
    }`;
  }
  return collectionData;
};

const getMarketPlaceData = (data) => {
  let marketplaceData = {
    washtrade_suspect_sales: `No data avaialable!`,
    washtrade_volume: `No data avaialable!`,
    washtrade_wallets: `No data avaialable!`,
  };
  let isGood = true;
  if (data && data.metric_values) {
    let washtrade_change =
      data.metric_values.volume.value /
      data.metric_values.washtrade_volume.value;
    isGood = typeof washtrade_change === 'number' && washtrade_change > 10;
    marketplaceData.washtrade_suspect_sales = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_suspect_sales.value
    }`;
    marketplaceData.washtrade_volume = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_volume.value
    } USD ${
      isNaN(washtrade_change) ? '' : '(' + washtrade_change.toFixed(2) + '%)'
    }`;
    marketplaceData.washtrade_wallets = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_wallets.value
    }`;
  }
  return marketplaceData;
};

export const getUnleashNFTsInsightsData = async (
  chainId,
  address,
  tokenId,
  marketPlace,
) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-api-key': UNLEASH_NFTS_API_KEY,
    },
  };
  const nftResponse = await fetch(
    `${API_ENDPOINT}/nft/${chainId}/${address}/${tokenId}/metrics?currency=usd&metrics=washtrade_suspect_sales&metrics=volume&metrics=washtrade_volume&metrics=washtrade_wallets&time_range=all&include_washtrade=true`,
    { ...options },
  );

  const marketPlaceesponse = await fetch(
    `https://api.unleashnfts.com/api/v1/marketplaces?blockchain=${chainId}&metrics=washtrade_suspect_sales&metrics=washtrade_volume&metrics=washtrade_wallets&sort_by=washtrade_suspect_sales&sort_order=desc&offset=0&limit=30&metrics=volume&time_range=all&include_washtrade=true`,
    { ...options },
  );

  const nftPriceEstimateResponse = await fetch(
    `${API_ENDPOINT}/nft/${chainId}/${address}/${tokenId}/price-estimate`,
    { ...options },
  );
  const collectionResponse = await fetch(
    `${API_ENDPOINT}/collection/${chainId}/${address}/metrics?currency=usd&metrics=washtrade_level&metrics=washtrade_volume&metrics=volume&metrics=washtrade_suspect_sales&metrics=washtrade_wallets&time_range=all&include_washtrade=true`,
    { ...options },
  );

  let nftResponseJson = await nftResponse.json();
  let nftPriceEstimateResponseJson = await nftPriceEstimateResponse.json();
  let marketPlaceesponseJson = await marketPlaceesponse.json();
  let collectionResponseJson = await collectionResponse.json();
  let marketPlaceData = marketPlaceesponseJson.marketplaces.filter(
    (i) => i.metadata.id === marketPlace,
  )[0];

  // if (!nftResponse.ok) {
  //   nftResponseJson = `No data avaialable!`;
  // }
  // if (!marketPlaceesponse.ok) {
  //   marketPlaceesponseJson = `No data avaialable!`;
  // }
  // if (!nftPriceEstimateResponse.ok) {
  //   nftPriceEstimateResponseJson = `No data avaialable!`;
  // }
  // if (!collectionResponse.ok) {
  //   collectionResponseJson = `No data avaialable!`;
  // }
  const results = {
    'NFT: Estimated Price': getNFTData(
      nftResponseJson,
      nftPriceEstimateResponseJson,
    ).estimatedPrice,

    'NFT: Suspected Washtraded Sales': getNFTData(
      nftResponseJson,
      nftPriceEstimateResponseJson,
    ).washtrade_suspect_sales,

    'NFT: Suspected Washtraded Volume': getNFTData(
      nftResponseJson,
      nftPriceEstimateResponseJson,
    ).washtrade_volume,

    'NFT: Suspected Washtraded Wallets': getNFTData(
      nftResponseJson,
      nftPriceEstimateResponseJson,
    ).washtrade_wallets,

    'Collection: Suspected Washtrade Level': getCollectionData(
      collectionResponseJson,
    ).washtrade_level,

    'Collection: Suspected Washtraded Sales': getCollectionData(
      collectionResponseJson,
    ).washtrade_suspect_sales,

    'Collection: Suspected Washtraded Volume': getCollectionData(
      collectionResponseJson,
    ).washtrade_volume,

    'Collection: Suspected Washtraded Wallets': getCollectionData(
      collectionResponseJson,
    ).washtrade_wallets,

    'Market Place: Suspected Washtraded Sales':
      getMarketPlaceData(marketPlaceData).washtrade_suspect_sales,
    'Market Place: Suspected Washtraded Volume':
      getMarketPlaceData(marketPlaceData).washtrade_volume,
    'Market Place: Suspected Washtraded Wallets':
      getMarketPlaceData(marketPlaceData).washtrade_wallets,
  };
  console.log(results, 'results');
  // The "text_signature" property is a string like "transfer(address,uint256)",
  // which is what we want. They are sorted by oldest first.
  return results;
};

/**
 * As an example, get transaction insights by looking at the transaction data
 * and attempting to decode it.
 *
 * @param transaction - The transaction to get insights for.
 * @returns The transaction insights.
 */

const decodeTransactionData = (toAddress, data) => {
  const method = data.slice(0, 10);
  let result = {
    address: '',
    tokenId: '',
    marketPlace: '',
  };
  switch (true) {
    case method === '0xfb0f3ee1' &&
      toAddress === '0x00000000006c3852cbef3e08e8df289169ede581':
      const contractAddressPosition = 64 * 7 + 10;
      const tokenIdPosition = 64 * 8 + 10;
      const contractAddressData = data.slice(
        contractAddressPosition - 40,
        contractAddressPosition,
      );
      const tokenIdData = parseInt(
        data.slice(tokenIdPosition - 64, tokenIdPosition),
        16,
      );
      result = {
        address: `0x${contractAddressData}`,
        tokenId: tokenIdData.toString(),
        marketPlace: 'opensea',
      };
  }
  return result;
};

export const getUnleashNFTsInsights = async (
  transaction: Record<string, unknown>,
  chainId,
) => {
  try {
    // Check if the transaction has data.
    if (
      !isObject(transaction) ||
      !hasProperty(transaction, 'data') ||
      typeof transaction.data !== 'string'
    ) {
      return {
        Error: 'Problem in fetching insights for this transaction!',
      };
    }
    console.log(transaction, 'transaction', chainId, 'chainId');
    // Get possible function names for the function signature, i.e., the first
    // 4 bytes of the data.
    const data = decodeTransactionData(
      '0x00000000006c3852cbef3e08e8df289169ede581',
      '0xfb0f3ee100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a311ce8b30c0000000000000000000000000006fc3539ff958a5f17afcc6e1459099485c32322d000000000000000000000000004c00500000ad104d7dbd00e3ae0a5c00560c00000000000000000000000000a7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270000000000000000000000000000000000000000000000000000000000c1990250000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000637ea48b00000000000000000000000000000000000000000000000000000000639db75d0000000000000000000000000000000000000000000000000000000000000000360c6ebe0000000000000000000000000000000000000000f7817196f9226f300000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000004879b1216b0000000000000000000000000000000a26b00c1f0df003000390027140000faa719000000000000000000000000000000000000000000000000000d96d1364410000000000000000000000000006c093fe8bc59e1e0cae2ec10f0b717d3d182056b00000000000000000000000000000000000000000000000000000000000000413581edf91f1ede7516fe0fc48fde33e4606ed18230d59693747b470d69dd1c727a3185f61be0aca7993476729f0ae21d7d71c42877298aa6d0348e62c3e5fcc11b00000000000000000000000000000000000000000000000000000000000000360c6ebe',
    );
    console.log(data, 'dataDecoded');
    if (!UNLEASH_NFTS_API_KEY) {
      return {
        Error: 'Unleash NFTs API Key is not available.!',
      };
    }

    const nftInsights = await getUnleashNFTsInsightsData(
      chainId.split(':')[1],
      data.address,
      data.tokenId,
      data.marketPlace,
    );
    console.log(nftInsights, 'nftInsights');

    // No functions found for the signature.

    if (!nftInsights) {
      return {
        Error: 'Problem in fetching insights for this transaction!',
      };
    }

    // Return the function name and decoded arguments.
    return nftInsights;
  } catch (error) {
    console.error(error);
    return {
      Error: 'Problem in fetching insights for this transaction!',
    };
  }
};
