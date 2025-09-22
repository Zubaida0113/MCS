console.log("Auth script loaded");
window.addEventListener('load', async function () {
    await Clerk.load();

    if (Clerk.user) {
        // Retrieve the role from localStorage
        const role = localStorage.getItem('selectedRole');
        console.log("Retrieved role from localStorage:", role);

        // Role-based redirect
        switch (role) {
            case "Admin":
                window.location.href = "/HTML/admin/dashboard.html";
                break;
            case "Resident":
                window.location.href = "/index.html";
                break;
            default:
                console.error("Invalid or missing role. Redirecting to main page.");
                window.location.href = "/index.html";
                break;
        }
    } else {
        document.getElementById('app').innerHTML = `
            <div id="sign-in"></div>
        `;
        const signInDiv = document.getElementById('sign-in');
        Clerk.mountSignIn(signInDiv, {
            afterSignInUrl: "/HTML/login.html", // Reload to check and redirect by role
            afterSignOutUrl: "/index.html",
            signUpUrl: "/HTML/signup.html"
        });
    }
});
