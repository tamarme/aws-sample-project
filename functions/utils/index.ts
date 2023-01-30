export function getEnv(field: string) {
  const envElement = process.env[field];
  if (!envElement) {
    throw new Error(`no ${field} provided`);
  }
  return envElement;
}
