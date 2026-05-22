async function test() {
    console.log("Registering user...");
    try {
        const resReg = await fetch('http://localhost:3000/api/usuarios/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test User",
                email: "testapp@test.com",
                password: "password123",
                role: "cliente"
            })
        });
        console.log("Register status:", resReg.status);
        const bodyReg = await resReg.text();
        console.log("Register body:", bodyReg);
    } catch(e) {
        console.error(e);
    }

    console.log("Logging in...");
    try {
        const resLog = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: "testapp@test.com",
                password: "password123"
            })
        });
        console.log("Login status:", resLog.status);
        const bodyLog = await resLog.text();
        console.log("Login body:", bodyLog);
    } catch(e) {
        console.error(e);
    }
}

test();
