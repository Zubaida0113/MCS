console.log("Auth script loaded");
window.addEventListener('load', async function () {
    await Clerk.load();

    if (Clerk.user) {
        // Retrieve the role from localStorage
        const role = localStorage.getItem('selectedRole');
        console.log("Retrieved role from localStorage:", role);

        // Role-based redirect
        if (role === "Admin") {
            window.location.href = "/HTML/admin/dashboard.html";
        } else if (role === "Resident") {
            window.location.href = "/HTML/main.html";
        } else {
            // Fallback if role is missing or invalid
            console.error("Invalid or missing role. Redirecting to main page.");
            window.location.href = "/HTML/main.html";
        }
    } else {
        document.getElementById('app').innerHTML = `
            <div id="sign-in"></div>
        `;
        const signInDiv = document.getElementById('sign-in');
        Clerk.mountSignIn(signInDiv, {
            afterSignInUrl: "/HTML/login.html", // Reload to check and redirect by role
            afterSignOutUrl: "/HTML/main.html",
            signUpUrl: "/HTML/signup.html"
        });
    }
});
