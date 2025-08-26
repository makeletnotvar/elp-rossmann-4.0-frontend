export interface AsyncReducerState {
    fetching: boolean;
    fetched: boolean;
    error: boolean;
    errorMessage?: string;
}

export const defaultAsyncReducerState: AsyncReducerState = {
    fetching: false,
    fetched: false,
    error: false,
}