export function isValidGroup(group: string | undefined | null) {
  return group !== undefined && group !== "";
}

export function countGroups(...groups: string[]) {
  return groups.filter(isValidGroup).length;
}