import type { Snap } from '../types';
import { isLocalSnap } from './snap';

/**
 * Determines if the reconnect button should be displayed based on the installed snap.
 * @param installedSnap - The snap object.
 * @returns boolean - Whether to display the reconnect button or not.
 */
export const shouldDisplayReconnectButton = (
  installedSnap: Snap | null,
): boolean => installedSnap !== null && isLocalSnap(installedSnap.id);
