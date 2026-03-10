const noop = () => {};

export const dispatcher = new Proxy<Record<string, (...args: unknown[]) => void>>(
  {},
  {
    get: () => noop,
  }
);

export function renderAppDevOverlay() {
  // Disabled intentionally: Next 16 devtools segment explorer crashes on some setups.
}

export function getSerializedOverlayState() {
  return null;
}

export function getSegmentTrieData() {
  return null;
}
