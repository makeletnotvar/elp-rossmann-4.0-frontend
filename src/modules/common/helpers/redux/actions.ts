import { Action } from 'redux';


export interface ReduxAction<T = {[param: string]: any}> extends Action {
    payload: T;
}