// frontend/src/auth/auth.js

function pickToken(data) {
  return data?.token || null;
}

function pickRole(data) {
  if (Array.isArray(data?.user?.roles) && data.user.roles.length > 0) {
    return String(data.user.roles[0]).toLowerCase();
  }

  return null;
}

export const saveSession = (data) => {

  console.log("SAVE SESSION");
  console.log(data);

  const token = pickToken(data);
  const role = pickRole(data);
  const user = data?.user || null;

  console.log("TOKEN:", token);
  console.log("ROLE:", role);
  console.log("USER:", user);

  localStorage.setItem(
    "session",
    JSON.stringify(data)
  );

  if (token)
    localStorage.setItem(
      "token",
      token
    );

  if (role)
    localStorage.setItem(
      "role",
      role
    );

  if (user)
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

  window.dispatchEvent(
    new Event("auth:updated")
  );
};

export const getSession = () => {
  try {
    const raw = localStorage.getItem("session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token") || getSession()?.token || null;
};

export const getRole = () => {
  return localStorage.getItem("role") || pickRole(getSession());
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (raw) return JSON.parse(raw);
    return getSession()?.user || null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("session");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("auth:updated"));
};