import { hasProperty, isObject } from '@metamask/utils';
import { Interface } from 'ethers';
import { ABIs } from './abi/abis';

const API_ENDPOINT = 'https://unleashnfts.com/api';

const warningIcon = '❗';

type PriceData = {
  value: string;
  unit: 'usd' | 'eth' | 'avax' | 'sol' | 'matic' | 'bnb' | 'btc';
};

type Metadata = {
  name: string;
  collection_name: string;
  address: string;
  token_id: string;
  chain_id: number;
  minted_date: string;
  token_image_url: string;
  thumbnail_url: string;
  thumbnail_palette: string[];
  verified: boolean;
};
type MetricValues = {
  price_estimate?: PriceData;
  price_estimate_upper_bound?: PriceData;
  price_estimate_lower_bound?: PriceData;
  prediction_percentile?: PriceData;
  collection_drivers?: PriceData;
  nft_sales_drivers?: PriceData;
  nft_rarity_drivers?: PriceData;
};

type NFTData = {
  metadata: Metadata;
  metric_values: MetricValues;
};

type CurrencyMetric = {
  /** @description String-serialized decimal value in the original currency */
  value: string;
  /**
   * @description The requested currency
   * @default usd
   * @enum {string}
   */
  unit: 'usd' | 'eth' | 'avax' | 'sol' | 'matic' | 'bnb' | 'btc';
};

type NonCurrencyMetric = {
  /** @description Numeric value of the metric or NA / INF_POS / INF_NEG */
  value: number | 'NA' | 'INF_POS' | 'INF_NEG';
  /**
   * @description Metric unit types that are not currency-based
   * @enum {string}
   */
  unit: 'count' | 'pct';
};

type MetricValuesData = {
  [key: string]: CurrencyMetric | NonCurrencyMetric;
};

type NFTMetricData = {
  metric_values: MetricValuesData;
};

/* eslint-enable @typescript-eslint/naming-convention */
const getNFTData = (data: NFTMetricData, priceData: NFTData) => {
  let nftData = {
    estimatedPrice: `No data avaialable!`,
    washtrade_suspect_sales: `No data avaialable!`,
    washtrade_volume: `No data avaialable!`,
    washtrade_wallets: `No data avaialable!`,
  };

  let isGood = false;

  if (priceData && priceData?.metric_values?.price_estimate) {
    nftData.estimatedPrice = `${priceData?.metric_values?.price_estimate.value} ETH`;
  }
  if (data && data.metric_values) {
    const volume = data.metric_values.volume?.value ?? 0;
    const washtradeVolume = data.metric_values.washtrade_volume?.value ?? 1; // Avoid division by zero

    let washtrade_change =
      typeof volume === 'number' && typeof washtradeVolume === 'number'
        ? volume / washtradeVolume
        : 0;

    isGood =
      typeof washtrade_change === 'number' &&
      washtrade_change > 10 &&
      !isNaN(washtrade_change) &&
      isFinite(washtrade_change);

    nftData.washtrade_suspect_sales = ` ${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_suspect_sales?.value ?? 'N/A'
    }`;

    nftData.washtrade_volume = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_volume?.value ?? 'N/A'
    } USD ${
      isNaN(washtrade_change) || !isFinite(washtrade_change)
        ? ''
        : '(' + washtrade_change.toFixed(2) + '%)'
    }`;

    nftData.washtrade_wallets = `${isGood ? warningIcon : ''} ${
      data.metric_values.washtrade_wallets?.value ?? 'N/A'
    }`;
  }
  return nftData;
};

export const getUnleashNFTsInsightsData = async (
  chainId: string | number,
  address: string,
  tokenId: string | number,
) => {
  const options = {
    headers: {
      accept: 'application/json',
    },
  };

  try {
    const nftMetricsUrl = `${API_ENDPOINT}/nft/${chainId}/${address}/${tokenId}/metrics?currency=usd&metrics=washtrade_suspect_sales&metrics=volume&metrics=washtrade_volume&metrics=washtrade_wallets&time_range=all&include_washtrade=true`;
    const nftPriceEstimateUrl = `${API_ENDPOINT}/nft/${chainId}/${address}/${tokenId}/price-estimate`;
    const [
      nftResponse,
      nftPriceEstimateResponse,
    ] = await Promise.all([
      fetch(nftMetricsUrl, options),
      fetch(nftPriceEstimateUrl, options),
    ]);

    const nftResponseJson = await nftResponse.json();
    const nftPriceEstimateResponseJson = await nftPriceEstimateResponse.json();

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
    };
    return results;
  } catch (error) {
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

    if (functionFragment?.name === 'fulfillBasicOrder_efficient_6GL6yc') {
      const decodedArr = decodedData[0]?.toString()?.split(',');

      tokenAddress = decodedArr?.[5];
      tokenId = decodedArr?.[6];
    } else if (functionFragment?.name === 'fulfillAvailableAdvancedOrders') {
      const decodedArr = decodedData[0][1][0][2]?.toString()?.split(',');
      tokenAddress = decodedArr?.[1];
      tokenId = decodedArr?.[2];
    } else {
      //ORIGINAL
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
    }

    return { tokenAddress, tokenId };
  }
};

export const getUnleashNFTsInsights = async (
  transaction: Record<string, unknown>,
  chainId: string | number,
) => {
  try {
    if (
      !isObject(transaction) ||
      !hasProperty(transaction, 'data') ||
      typeof transaction.data !== 'string'
    ) {
      return {
        Error: 'Problem in fetching insights for this transaction!',
      };
    }

    const abiDecodedData = decodeTrxData(transaction.data);

    if (!abiDecodedData) {
      return { Error: 'Failed to decode transaction data!' };
    }

    let chainIdInt: number;
    const chainIdStr = String(chainId).split(':')[1];

    if (chainIdStr === undefined) {
      return { Error: 'Invalid chainId format!' };
    }

    chainIdInt = parseInt(chainIdStr);

    const nftInsights = await getUnleashNFTsInsightsData(
      chainIdInt,
      abiDecodedData?.tokenAddress,
      abiDecodedData?.tokenId,
    );
    
    if (!nftInsights) {
      return {
        Error: 'Problem in fetching insights for this transaction!',
      };
    }

    return {
      'Contract Address': abiDecodedData?.tokenAddress,
      'Token ID': String(abiDecodedData?.tokenId),
      ...nftInsights,
    };
  } catch (error) {
    return {
      Error: `Problem in fetching insights for this transaction! ${error}`,
    };
  }
};
