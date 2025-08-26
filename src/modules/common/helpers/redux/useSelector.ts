import * as reactRedux from 'react-redux';

const useSelector = <T, S = any>(selector: (state: T) => S, deps?: undefined | (any[])): S => {
    return (reactRedux as any).useSelector(selector, (reactRedux as any).shallowEqual);
};

export default useSelector;
