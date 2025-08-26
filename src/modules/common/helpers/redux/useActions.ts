import { useEffect } from 'react';
import * as ReactRedux from 'react-redux';

// export const useActions = (actions: any, deps: any[] = []) => {
//   const dispatch = (ReactRedux as any).useDispatch();
//   return useMemo(() => {
//     if (Array.isArray(actions)) {
//       return actions.map(a => bindActionCreators(a, dispatch))
//     }
//     return bindActionCreators(actions, dispatch)
//   }, deps);
// };

export const useDispatch = (ReactRedux as any).useDispatch;

/**
 * Helper hook to call action once at load using useEffect hook
 * @param action
 */
export const useDispatchOnce = (action: any, deps: any[] = [], conditional: () => boolean = () => true) => {
  const dispatch = useDispatch();
  useEffect(() => {
      if (conditional())
        dispatch(action);
  }, deps);
};