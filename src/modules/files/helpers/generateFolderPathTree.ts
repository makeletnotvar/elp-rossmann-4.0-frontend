/**
 * "/schema/1/2/3/4" -> ["schema", "schema/1", "schema/1/2", "schema/1/2/3", "schema/1/2/3/4"] 
 */
export function generateFolderPathTree(folderPath: string): string[] {
  const segments = folderPath
    ? folderPath.split('/').filter((segment) => segment.trim() !== '')
    : [];

  const folderPathTree: string[] = segments.reduce((acc: any, segment, index) => {
    const currentPath = index === 0 ? segment : `${acc[index - 1]}/${segment}`;
    return [...acc, currentPath];
  }, []);

  return folderPathTree;
}