export class Provider {
  constructor(props: any);
  componentDidMount(): void;
  componentDidUpdate(prevProps: any): void;
  componentWillUnmount(): void;
  forceUpdate(callback: any): void;
  notifySubscribers(): void;
  render(): any;
  setState(partialState: any, callback: any): void;
}
export namespace Provider {
  namespace propTypes {
    function children(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    namespace children {
      function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    }
    function context(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    namespace context {
      function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    }
    function store(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    namespace store {
      function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    }
  }
}
export const ReactReduxContext: {
  $$typeof: symbol;
  Consumer: {
    $$typeof: symbol;
    Consumer: any;
    Provider: any;
  };
  Provider: {
    $$typeof: symbol;
  };
};
export function batch(fn: any, a: any): any;
export function connect(mapStateToProps: any, mapDispatchToProps: any, mergeProps: any, _ref2: any): any;
export function connectAdvanced(selectorFactory: any, _ref: any): any;
