export const decodeOffsetKey = (offsetKey: string) => /(?<blockKey>[^-]*)-(?<decoratorKey>[^-]*)-(?<leafKey>[^-]*)/.exec(offsetKey)!.groups as {
    blockKey: string;
    decoratorKey: string;
    leafKey: string;
  };
