import { OnTransactionHandler } from '@metamask/snaps-types';

import { getUnleashNFTsInsights } from './insights';

/**
 * Handle an incoming transaction, and return any insights.
 *
 * @param args - The request handler args as object.
 * @param args.transaction - The transaction object.
 * @returns The transaction insights.
 */
export const onTransaction: OnTransactionHandler = async ({ transaction, chainId }) => {
  return {
    insights: await getUnleashNFTsInsights(transaction, chainId),
  };
};
