import { CompositeDecorator, ContentBlock, DraftDecorator } from "draft-js";
import Immutable from "immutable";

const List = Immutable.List;

export {};

const DELIMITER = "|";
const EMPTY = "EMPTY";

const Span = (props: any) => <span>{props.children}</span>;

class CompoundDecorator {
  private decorators;

  constructor(decorators: DraftDecorator[] = []) {
    this.decorators = decorators.map(decorator => {
      return new CompositeDecorator([decorator]);
    });
  }

  getDecorations(block: ContentBlock) {
    const emptyTuples = Array(block.getText().length).fill(
      Array(this.decorators.length).fill(null)
    );

    const decorations = this.decorators.reduce((tuples, decorator, index) => {
      //一つのデコレーターのDecoration情報
      const blockDecorations = decorator.getDecorations(block);
      //decorationごとの情報を配列でまとめてる？
      return tuples.map((tuple, charIndex) => {
        //一文字中の一覧
        return [
          ...tuple.slice(0, index),
          blockDecorations.get(charIndex),
          ...tuple.slice(index + 1),
        ];
      });
    }, emptyTuples);

    return List(decorations.map(v => JSON.stringify(v)));
  }

  getComponentForKey(key) {
    const tuple = JSON.parse(key);
    return props => {
      const { decoratorProps, ...compositionProps } = props;
      const Composed = tuple.reduce((Composition, decoration, index) => {
        if (decoration !== null) {
          const decorator = this.decorators[index];
          const Component = decorator.getComponentForKey(decoration);
          const componentProps = {
            ...compositionProps,
            ...decoratorProps[index],
          };
          return () => (
            <Component {...componentProps}>
              <Composition {...compositionProps} />
            </Component>
          );
        }
        return Composition;
      }, Span);
      return <Composed>{props.children}</Composed>;
    };
  }

  getPropsForKey(key) {
    const tuple = JSON.parse(key);
    return {
      decoratorProps: tuple.map((decoration, index) => {
        const decorator = this.decorators[index];
        return decoration !== null ? decorator.getPropsForKey(decoration) : {};
      }),
    };
  }
}
