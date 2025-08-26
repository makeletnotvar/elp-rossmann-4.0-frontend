import { API } from 'api/axios';
import filesAPI from 'api/endpoints/filesAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { FilesRootState } from 'modules/files/redux';
import { AnyAction, Dispatch } from 'redux';

const FILES_MODULE = 'files/files';

export interface FilesResponse {
	folders: string[];
	files: FileType[];
}

export interface FilesState extends AsyncReducerState {
	folders: string[];
	files: FileType[];
}

const initialState: FilesState = {
	folders: [],
	files: [],
	...defaultAsyncReducerState,
};

const REQUEST = FILES_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = FILES_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = FILES_MODULE + '_RESPONSE_FAILURE';
const FETCH = FILES_MODULE + '_FETCH';
const FETCH_FOLDERS = FILES_MODULE + '_FETCH_FOLDERS';
const FETCH_FILES = FILES_MODULE + '_FETCH_FILES';
const RESET = FILES_MODULE + '_RESET';

const ADD_REQUEST = FILES_MODULE + 'ADD_REQUEST';
const ADD_RESPONSE_SUCCESS = FILES_MODULE + 'ADD_RESPONSE_SUCESS';
const ADD_RESPONSE_FAILURE = FILES_MODULE + 'ADD_RESPONSE_FAILURE';
const ADD_FETCH = FILES_MODULE + 'ADD_FETCH';

const RENAME_REQUEST = FILES_MODULE + 'RENAME_REQUEST';
const RENAME_RESPONSE_SUCCESS = FILES_MODULE + 'RENAME_RESPONSE_SUCESS';
const RENAME_RESPONSE_FAILURE = FILES_MODULE + 'RENAME_RESPONSE_FAILURE';
const RENAME_FETCH = FILES_MODULE + 'RENAME_FETCH';

const DELETE_REQUEST = FILES_MODULE + 'DELETE_REQUEST';
const DELETE_RESPONSE_SUCCESS = FILES_MODULE + 'DELETE_RESPONSE_SUCESS';
const DELETE_RESPONSE_FAILURE = FILES_MODULE + 'DELETE_RESPONSE_FAILURE';
const DELETE_FETCH = FILES_MODULE + 'DELETE_FETCH';

const filesReducer = (state = initialState, action: AnyAction): FilesState => {
	switch (action.type) {
		case REQUEST:
		case ADD_REQUEST:
		case RENAME_REQUEST:
		case DELETE_REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
		case ADD_RESPONSE_SUCCESS:
		case RENAME_RESPONSE_SUCCESS:
		case DELETE_RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
		case ADD_RESPONSE_FAILURE:
		case RENAME_RESPONSE_FAILURE:
		case DELETE_RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
		case FETCH_FOLDERS:
			return {
				...state,
				fetched: true,
				folders: action.payload.folders,
			};
		case RENAME_FETCH:
			return {
				...state,
				fetched: true,
				files: state.files.map(file => (file.name === action.payload.oldFile.name ? action.payload.newFile : file)),
			};
		case FETCH_FILES:
			return {
				...state,
				fetched: true,
				files: action.payload.files,
			};
		case ADD_FETCH: {
			const filteredFiles = state.files.filter(file => !action.payload.files.some((newFile: FileType) => newFile.name === file.name));

			return {
				...state,
				fetched: true,
				files: [...filteredFiles, ...action.payload.files],
			};
		}

		case DELETE_FETCH:
			return {
				...state,
				fetched: true,
				files: state.files.filter(file => {
					const fileName = file.name;
					const payLoadFileName = action.payload.fileName;
					return fileName !== payLoadFileName;
				}),
			};
		case RESET:
			return {
				...state,
				files: [],
			};
		default:
			return state;
	}
};

const actions = {
	getFolders: {
		request: () => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<FilesResponse>(filesAPI.getFolders());
				dispatch(actions.getFolders.success());
				if (response.data.folders) {
					dispatch(actions.getFolders.fetch(response.data));
				}
			} catch (err: any) {
				dispatch(actions.getFolders.failure(err));
			}
		},
		fetch: (response: FilesResponse): ReduxAction<FilesResponse> => {
			return {
				type: FETCH_FOLDERS,
				payload: response,
			};
		},
		success: (): AnyAction => ({
			type: RESPONSE_SUCCESS,
		}),
		failure: (error: string): AnyAction => ({
			type: RESPONSE_FAILURE,
			error: true,
		}),
	},
	getFiles: {
		request: (folderPath: string) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<FilesResponse>(filesAPI.getFiles(folderPath));
				dispatch(actions.getFiles.success());
				dispatch(actions.getFiles.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.getFiles.failure(err));
			}
		},
		fetch: (response: FilesResponse): ReduxAction<FilesResponse> => {
			return {
				type: FETCH_FILES,
				payload: response,
			};
		},
		success: (): AnyAction => ({
			type: RESPONSE_SUCCESS,
		}),
		failure: (error: string): AnyAction => ({
			type: RESPONSE_FAILURE,
			error: true,
		}),
	},
	upload: {
		request: (files: FormData, folderPath: string) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: ADD_REQUEST });

			try {
				const response = await API.post<{ files: FileType[] }>(filesAPI.upload(folderPath), files);
				dispatch(actions.upload.success());
				dispatch(actions.upload.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.upload.failure(err));
			}
		},
		fetch: (response: { files: FileType[] }): AnyAction => {
			return {
				type: ADD_FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: ADD_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: ADD_RESPONSE_FAILURE, error: true }),
	},
	rename: {
		request: (folderPath: string, filesNames: { oldFileName: string; newFileName: string }) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: RENAME_REQUEST });

			try {
				const response = await API.post<{ files: { oldFile: FileType; newFile: FileType } }>(filesAPI.rename(folderPath), filesNames);
				dispatch(actions.rename.success());
				dispatch(actions.rename.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.rename.failure(err));
			}
		},
		fetch: (response: { files: { oldFile: FileType; newFile: FileType } }): AnyAction => {
			return {
				type: RENAME_FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: RENAME_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: RENAME_RESPONSE_FAILURE, error: true }),
	},
	delete: {
		request: (file: string, folderPath: string) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: DELETE_REQUEST });

			try {
				const response = await API.delete<{ file: FileType }>(filesAPI.delete(file, folderPath));
				dispatch(actions.delete.success());
				dispatch(actions.delete.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.delete.failure(err));
			}
		},
		fetch: (response: { file: FileType }): AnyAction => {
			return {
				type: DELETE_FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: DELETE_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: DELETE_RESPONSE_FAILURE, error: true }),
	},
	resetFiles: () => {
		return {
			type: RESET,
		};
	},
};

const selectFiles = (state: FilesRootState): FilesState => state.files;

export const useFilesState = (): FilesState => {
	return useSelector<FilesRootState, FilesState>(selectFiles) || {};
};

export default filesReducer;
export const filesActions = actions;
