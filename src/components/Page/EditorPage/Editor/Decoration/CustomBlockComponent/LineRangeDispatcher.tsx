import { MutableRefObject, ReactNode, useEffect, useRef } from "react";
import { store } from "@/rudex/store";
import { deleteLineRange, setLineRange } from "@/rudex/LineRange/LineRangeSlice";

const isHTMLDivElementRef = (
  ref: MutableRefObject<HTMLDivElement | null>
): ref is MutableRefObject<HTMLDivElement> => !!ref.current;

function LineRangeDispatcher({
  blockKey,
  children,
  text,
}: {
  blockKey: string;
  children: ReactNode;
  text: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isHTMLDivElementRef(ref)) {
      const nodeList = ref.current?.querySelectorAll("span.characterCounter") || [];
      const elementXArr = [...nodeList].map(v => v.getBoundingClientRect().x);

      // [startIndex,endIndex][]
      const range: [number, number][] = [[0, 0]];
      elementXArr.forEach((x, i) => {
        if (x >= elementXArr[range.at(-1)![1]]) {
          range.at(-1)![1] = i;
        } else {
          range.push([i, i]);
        }
      });
      range.at(-1)![1]++;

      store.dispatch(
        setLineRange({
          key: blockKey,
          range,
        })
      );
    }

    return () => {
      store.dispatch(deleteLineRange(blockKey));
    };
  }, [blockKey, text]);

  return <div ref={ref}>{children}</div>;
}

export default LineRangeDispatcher;
