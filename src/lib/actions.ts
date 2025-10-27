export async function registerUser(data: { email: string; password: string; pseudo: string }) {
    return fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
}

export async function updateUserInfo(data: { email: string; pseudo: string }) {
  return fetch("/api/user/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateUserPassword(data: { currentPassword: string; newPassword: string }) {
  return fetch("/api/user/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}


export async function forgotPassword(email: string) {
  return fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
}


export async function deleteUser() {
    return fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
}


export async function addRun(data: { name: string, distance: number, totalSeconds: number, date: string }) {    
    const payload = {
        name: data.name,
        distance_km: data.distance,
        duration_sec: data.totalSeconds,
        run_date: data.date,
    };

    
    return fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
}

export async function updateRun(data: { name: string, distance: number, totalSeconds: number, date: string, id: number }) {
    const payload = {
        name: data.name,
        distance_km: data.distance,
        duration_sec: data.totalSeconds,
        run_date: data.date,
        id: data.id,
    };
    
    return fetch("/api/runs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
}

export async function deleteRun( id: number ) {
    return fetch("/api/runs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id}),
    })
}
