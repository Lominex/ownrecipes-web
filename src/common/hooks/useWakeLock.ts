// Coded by Joris (https://github.com/jorisre/react-screen-wake-lock)

import * as React from 'react';

export interface IWakeLockOptions {
  onError?: (error: Error) => void;
  onRequest?: () => void;
  onRelease?: EventListener;
}

export const useWakeLock = ({
  onError,
  onRequest,
  onRelease,
}: IWakeLockOptions | undefined = {}) => {
  const [released, setReleased] = React.useState<boolean | undefined>();
  const wakeLock = React.useRef<WakeLockSentinel | null>(null);

  // https://caniuse.com/mdn-api_wakelock
  const isSupported = typeof window !== 'undefined' && 'wakeLock' in navigator;

  const request = React.useCallback(
    async (type: WakeLockType = 'screen') => {
      const isWakeLockAlreadyDefined = wakeLock.current != null;
      if (!isSupported) {
        // eslint-disable-next-line no-console
        console.warn('Calling the "request" function has no effect, Wake Lock Screen API isn\'t supported.');
        return;
      }
      if (isWakeLockAlreadyDefined) {
        // eslint-disable-next-line no-console
        console.warn('Calling "request" multiple times without "release" has no effect.');
        return;
      }

      try {
        wakeLock.current = await navigator.wakeLock.request(type);

        wakeLock.current.onrelease = (e: Event) => {
          // Default to `true` - `released` API is experimental: https://caniuse.com/mdn-api_wakelocksentinel_released
          setReleased((wakeLock.current && wakeLock.current.released) ?? true);
          if (onRelease) {
            onRelease(e);
          }
          wakeLock.current = null;
        };

        onRequest?.();
        setReleased((wakeLock.current && wakeLock.current.released) ?? false);
      } catch (error) {
        if (onError) {
          onError(error as Error);
        } else {
          // eslint-disable-next-line no-console
          console.error((error as Error)?.message);
        }
      }
    },
    [isSupported, onRequest, onError, onRelease]
  );

  const release = React.useCallback(async () => {
    const isWakeLockUndefined = wakeLock.current == null;
    if (!isSupported) {
      // eslint-disable-next-line no-console
      console.warn('Calling the "release" function has no effect, Wake Lock Screen API isn\'t supported.');
      return;
    }
    if (isWakeLockUndefined) {
      // eslint-disable-next-line no-console
      console.warn('Calling `release` before `request` has no effect.');
      return;
    }

    if (wakeLock.current) {
      await wakeLock.current.release();
    }
  }, [isSupported]);

  return {
    isSupported: isSupported,
    request:     request,
    released:    released,
    release:     release,
    type:        (wakeLock.current && wakeLock.current.type) || undefined,
  };
};
