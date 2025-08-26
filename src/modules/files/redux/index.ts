import filesReducer, { FilesState } from 'modules/files/redux/files';
import { IModule } from 'redux-dynamic-modules';

export const filesReducers: FilesRootState = {
    files: (filesReducer as any),
};

export interface FilesRootState {
    files: FilesState;
}

export const getFilesModule = (): IModule<FilesRootState> => ({
    id: "files",
    reducerMap: {
        files: filesReducer,
    },
    initialActions: [
        { type: 'INIT_FILES_MODULE' }
    ]
});