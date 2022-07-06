import * as Permissions from 'expo-permissions';

export async function getLocationPermissions(): Promise<Permissions.PermissionResponse> {
  return Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
}
