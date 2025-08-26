import useSelector from '../helpers/redux/useSelector';
import { RootState } from '../redux';
import { AppState } from '../redux/app';

const selectApp = (state: RootState): AppState => state.app;

export const useApp = (): AppState => {
    return useSelector<RootState, AppState>(selectApp, []);
}