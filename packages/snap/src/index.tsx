import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { Box, Text, Bold, Heading, Link } from '@metamask/snaps-sdk/jsx';
import type { OnTransactionHandler } from '@metamask/snaps-sdk';
import { getUnleashNFTsInsights } from './insights.data';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Text>
                Hello, <Bold>{origin}</Bold>!
              </Text>
              <Text>
                This custom confirmation is just for display purposes.
              </Text>
              <Text>
                But you can edit the snap source code to make it do something,
                if you want to!
              </Text>
            </Box>
          ),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

/**
 * Handle an incoming transaction, and return any insights.
 *
 * @param args - The request handler args as object.
 * @param args.transaction - The transaction object.
 * @param args.chainId
 * @returns The transaction insights.
 */
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const insights = await getUnleashNFTsInsights(transaction, chainId);
  console.log(insights, 'INSIGHTS');
  const formatNumber = (num: any) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}b`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}m`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
    return num;
  };
  const content = (
    <Box>
      <Heading>NFT and Collection Data</Heading>
      {Object.entries(insights).map(([key, value]) => (
        <Text key={key}>
          <Bold>{key}:</Bold>{' '}
          {key !== 'Contract Address' && key !== 'Token ID'
            ? formatNumber(value)
            : value}
        </Text>
      ))}
      <Text>&#9432; This is a disclaimer</Text>
      <Link href='https://unleashnfts.com'>UnleashNfts</Link>
    </Box>
  );
  return {
    content,
  };
};
