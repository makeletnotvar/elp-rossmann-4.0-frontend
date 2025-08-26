import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { filesActions, useFilesState } from 'modules/files/redux/files';
import { useEffect } from 'react';

export function useFolders() {
  const dispatch = useDispatch();
  const { folders, fetching } = useFilesState();

  useEffect(() => {
    dispatch(filesActions.getFolders.request());
  }, []);

  return { folders, fetching }
}