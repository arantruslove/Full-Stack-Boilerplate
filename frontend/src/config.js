// Centralising the backend root API
const protocol = window.location.protocol;
const hostname = window.location.hostname;
export const backendRootDomain = `${protocol}//${hostname}/api/`;
