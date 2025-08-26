export const devicesSort = (
  a: BuildingDeviceReference,
  b: BuildingDeviceReference
) => ((b.description || b.name).toLowerCase().includes('główny') ? 1 : -1);