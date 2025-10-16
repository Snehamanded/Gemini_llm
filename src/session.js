const sessions = new Map();

export function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, { state: null, data: {} });
  }
  return sessions.get(userId);
}

export function setSession(userId, next) {
  sessions.set(userId, next);
}

export function clearSession(userId) {
  sessions.delete(userId);
}


