import { decodeOffsetKey } from "@/components/Functions/decodeOffsetKey";

export const isBOL = (offsetKey: string) => {
  const { decoratorKey } = decodeOffsetKey(offsetKey);

  return decoratorKey === "0";
};
