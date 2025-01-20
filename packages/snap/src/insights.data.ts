// import { decode } from '@metamask/abi-utils';
import {
  //   add0x,
  //   bytesToHex,
  hasProperty,
  isObject,
  //   remove0x,
} from '@metamask/utils';
import { UNLEASH_NFTS_API_KEY } from '../env.data.json';
import { Interface } from 'ethers';
import { ABIs } from './abi/abis';
// import { address } from '@metamask/abi-utils/dist/parsers';

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

const getNFTData = (data: any, priceData: any) => {
  let nftData = {
    estimatedPrice: `No data avaialable!`,
    washtrade_suspect_sales: `No data avaialable!`,
    washtrade_volume: `No data avaialable!`,
    washtrade_wallets: `No data avaialable!`,
  };
  let isGood = false;
  if (priceData && priceData.price_estimate) {
    nftData.estimatedPrice = `${priceData.price_estimate.value} ETH`;
  }
  if (data && data.metric_values) {
    let washtrade_change =
      data.metric_values.volume.value /
      data.metric_values.washtrade_volume.value;
    isGood =
      typeof washtrade_change === 'number' &&
      washtrade_change > 10 &&
      !isNaN(washtrade_change) &&
      isFinite(washtrade_change);
    nftData.washtrade_suspect_sales = ` ${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_suspect_sales.value
    }`;
    nftData.washtrade_volume = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_volume.value
    } USD ${
      isNaN(washtrade_change) || !isFinite(washtrade_change)
        ? ''
        : '(' + washtrade_change.toFixed(2) + '%)'
    }`;
    nftData.washtrade_wallets = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_wallets.value
    }`;
  }
  return nftData;
};

// const getCollectionData = (data: any) => {
//   let collectionData = {
//     washtrade_level: `No data avaialable!`,
//     washtrade_suspect_sales: `No data avaialable!`,
//     washtrade_volume: `No data avaialable!`,
//     washtrade_wallets: `No data avaialable!`,
//   };
//   let isGood = false;
//   if (data && data.metric_values) {
//     let washtrade_change =
//       data.metric_values.volume.value /
//       data.metric_values.washtrade_volume.value;
//     isGood =
//       typeof washtrade_change === 'number' &&
//       washtrade_change > 10 &&
//       !isNaN(washtrade_change) &&
//       isFinite(washtrade_change);
//     collectionData.washtrade_level = `${isGood ? warningIcon : ''} ${
//       data.metric_values.washtrade_level.value
//     }`;
//     collectionData.washtrade_suspect_sales = `${isGood ? warningIcon : ''} ${
//       data.metric_values.washtrade_suspect_sales.value
//     }`;
//     collectionData.washtrade_volume = `${isGood ? warningIcon : ''} ${
//       data.metric_values.washtrade_volume.value
//     } USD ${
//       isNaN(washtrade_change) ? '' : '(' + washtrade_change.toFixed(2) + '%)'
//     }`;
//     collectionData.washtrade_wallets = `${isGood ? warningIcon : ''} ${
//       data.metric_values.washtrade_wallets.value
//     }`;
//   }
//   return collectionData;
// };

// const getMarketPlaceData = (data: any) => {
//   let marketplaceData = {
//     washtrade_suspect_sales: `No data avaialable!`,
//     washtrade_volume: `No data avaialable!`,
//     washtrade_wallets: `No data avaialable!`,
//   };
//   let isGood = true;
//   if (data && data.metric_values) {
//     let washtrade_change =
//       data.metric_values.volume.value /
//       data.metric_values.washtrade_volume.value;
//     isGood =
//       typeof washtrade_change === 'number' &&
//       washtrade_change > 10 &&
//       !isNaN(washtrade_change) &&
//       isFinite(washtrade_change);
//     marketplaceData.washtrade_suspect_sales = `${isGood ? warningIcon : ''} ${
//       data.metric_values.washtrade_suspect_sales.value
//     }`;
//     marketplaceData.washtrade_volume = `${isGood ? warningIcon : ''} ${
//       data.metric_values.washtrade_volume.value
//     } USD ${
//       isNaN(washtrade_change) ? '' : '(' + washtrade_change.toFixed(2) + '%)'
//     }`;
//     marketplaceData.washtrade_wallets = `${isGood ? warningIcon : ''} ${
//       data.metric_values.washtrade_wallets.value
//     }`;
//   }
//   return marketplaceData;
// };

export const getUnleashNFTsInsightsData = async (
  chainId: any,
  address: any,
  tokenId: any,
  // marketPlace: any,
) => {
  const options = {
    headers: {
      accept: 'application/json',
      'x-api-key': UNLEASH_NFTS_API_KEY,
      //   referer: 'https://unleashnfts.com/'
    },
  };

  try {
    // Define API endpoints
    const nftMetricsUrl = `${API_ENDPOINT}/nft/${chainId}/${address}/${tokenId}/metrics?currency=usd&metrics=washtrade_suspect_sales&metrics=volume&metrics=washtrade_volume&metrics=washtrade_wallets&time_range=all&include_washtrade=true`;
    // const marketPlacesUrl = `${API_ENDPOINT}/marketplaces?blockchain=${chainId}&metrics=washtrade_suspect_sales&metrics=washtrade_volume&metrics=washtrade_wallets&sort_by=washtrade_suspect_sales&sort_order=desc&offset=0&limit=30&metrics=volume&time_range=all&include_washtrade=true`;
    const nftPriceEstimateUrl = `${API_ENDPOINT}/nft/${chainId}/${address}/${tokenId}/price-estimate`;
    // const collectionMetricsUrl = `${API_ENDPOINT}/collection/${chainId}/${address}/metrics?currency=usd&metrics=washtrade_level&metrics=washtrade_volume&metrics=volume&metrics=washtrade_suspect_sales&metrics=washtrade_wallets&time_range=all&include_washtrade=true`;

    // Make requests concurrently
    const [
      nftResponse,
      // marketPlaceResponse,
      nftPriceEstimateResponse,
      // collectionResponse,
    ] = await Promise.all([
      fetch(nftMetricsUrl, options),
      // fetch(marketPlacesUrl, options),
      fetch(nftPriceEstimateUrl, options),
      // fetch(collectionMetricsUrl, options),
    ]);

    // Parse responses
    const nftResponseJson = await nftResponse.json();
    const nftPriceEstimateResponseJson = await nftPriceEstimateResponse.json();
    // const marketPlaceResponseJson = await marketPlaceResponse.json();
    // const collectionResponseJson = await collectionResponse.json();

    // Filter marketplace data
    // const marketPlaceData = marketPlaceResponseJson.marketplaces.filter(
    //   (i: any) => i.metadata.id === marketPlace,
    // )[0];

    // Construct results
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

      // 'Collection: Suspected Washtrade Level': getCollectionData(
      //   collectionResponseJson,
      // ).washtrade_level,

      // 'Collection: Suspected Washtraded Sales': getCollectionData(
      //   collectionResponseJson,
      // ).washtrade_suspect_sales,

      // 'Collection: Suspected Washtraded Volume': getCollectionData(
      //   collectionResponseJson,
      // ).washtrade_volume,

      // 'Collection: Suspected Washtraded Wallets': getCollectionData(
      //   collectionResponseJson,
      // ).washtrade_wallets,

      // 'Market Place: Suspected Washtraded Sales':
      //   getMarketPlaceData(marketPlaceData).washtrade_suspect_sales,
      // 'Market Place: Suspected Washtraded Volume':
      //   getMarketPlaceData(marketPlaceData).washtrade_volume,
      // 'Market Place: Suspected Washtraded Wallets':
      //   getMarketPlaceData(marketPlaceData).washtrade_wallets,
    };
    return results;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error(`Failed to fetch UnleashNFTs insights data`);
  }
};

/**
 * As an example, get transaction insights by looking at the transaction data
 * and attempting to decode it.
 *
 * @param transaction - The transaction to get insights for.
 * @returns The transaction insights.
 */

export const decodeTrxData = (data: any) => {
  const iface = new Interface(ABIs);
  const functionFragment = iface.parseTransaction({ data: data });
  if (functionFragment?.name) {
    const decodedData = iface.decodeFunctionData(
      functionFragment?.name.toString(),
      data,
    );
    let tokenAddress = '';
    let tokenId = '';
    let tokenAssigned = false;

    decodedData.forEach((i) => {
      if (tokenAssigned) return;
      if (Array.isArray(i)) {
        i.forEach((j) => {
          if (tokenAssigned) return;
          if (Array.isArray(j)) {
            j.forEach((k) => {
              if (tokenAssigned) return;
              if (Array.isArray(k)) {
                k.forEach((l) => {
                  if (tokenAssigned) return;
                  tokenAddress = l[1];
                  tokenId = l[2];
                  tokenAssigned = true;
                });
              }
            });
          }
        });
      }
    });
    return { tokenAddress, tokenId };
  }
};

export const getUnleashNFTsInsights = async (
  transaction: Record<string, unknown>,
  chainId: any,
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
        // transaction: `transaction DATA: ${JSON.stringify(transaction)}`
      };
    }
    // Get possible function names for the function signature, i.e., the first
    // 4 bytes of the data.
    const data = {
      address: '',
      tokenId: '',
      marketPlace: '',
    };
    const abiDecodedData = decodeTrxData(transaction.data);

    if (!abiDecodedData) {
      console.error('Failed to decode transaction data:', transaction.data);
      return { Error: 'Failed to decode transaction data!' };
    }

    if (!UNLEASH_NFTS_API_KEY) {
      return {
        Error: 'Unleash NFTs API Key is not available.!',
      };
    }
    let chainIdInt = parseInt(chainId.split(':')[1]);

    const nftInsights = await getUnleashNFTsInsightsData(
      chainIdInt,
      abiDecodedData?.tokenAddress,
      abiDecodedData?.tokenId,
      // data.marketPlace,
    );

    // No functions found for the signature.

    if (!nftInsights) {
      return {
        Error: 'Problem in fetching insights for this transaction!',
        // transaction: `transaction DATA: ${JSON.stringify(transaction)}`
      };
    }

    return {
      'Contract Address': abiDecodedData?.tokenAddress,
      'Token ID': String(abiDecodedData?.tokenId),
      // 'Token ID':
      //   typeof abiDecodedData?.tokenId === 'bigint'
      //     ? String(Number(abiDecodedData.tokenId))
      //     : String(abiDecodedData?.tokenId),
      ...nftInsights,
    };
  } catch (error) {
    console.error(error);
    // const data = decodeTransactionData(transaction.to, transaction.data);
    return {
      Error: `Problem in fetching insights for this transaction! ${error}`,
      //   tranModifiedDATA: `DATA: ${JSON.stringify(data)}`,
      //   chain: JSON.stringify(parseInt(chainId.split(':')[1])),
      // tran: JSON.stringify(transaction.data)
    };
  }
};
