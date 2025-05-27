window.addEventListener("load", async () => {
    try {
        await Clerk.load();

        const signedOutButtons = document.getElementById("signed-out-buttons");
        const signedInButtons = document.getElementById("signed-in-buttons");
        const welcomeDiv = document.getElementById("welcome");
        const heroSection = document.getElementById("hero");
        const aboutSection = document.getElementById("about");
        const worksSection = document.getElementById("how-it-works");
        const feedbackSection = document.getElementById("feedback-carousel");
        const complaintsSection = document.getElementById("complaints-section");
        const nav = document.getElementById("navbarnav");

        // Check authentication state
        if (Clerk.user) {
            // Authenticated user view
            signedOutButtons.style.display = "none";
            signedInButtons.style.display = "flex";
            welcomeDiv.innerText = `Welcome, ${Clerk.user.fullName}`;
            heroSection.style.display = "none";
            aboutSection.style.display = "none";
            worksSection.style.display = "none";
            feedbackSection.style.display = "none";
            complaintsSection.style.display = "block";

            // Update navigation for authenticated users
            nav.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#complaints">My Complaints</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#track">Track Complaint</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Contact</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">FAQs</a>
                </li>
            `;
        } else {
            // Non-authenticated user view
            signedOutButtons.style.display = "flex";
            signedInButtons.style.display = "none";
            heroSection.style.display = "block";
            complaintsSection.style.display = "none";

            // Update navigation for non-authenticated users
            nav.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">About</a>
                 </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Feedback</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Contact</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">FAQs</a>
                </li>
            `;
        }
    } catch (error) {
        console.error('Error initializing Clerk:', error);
    }
});

// Protect complaint features
function openComplaintForm() {
    if (!Clerk.user) {
        window.location.href = '/HTML/login.html';
        return;
    }
    window.location.href = '/complaints/new.html';
}

function viewComplaints() {
    if (!Clerk.user) {
        window.location.href = '/HTML/login.html';
        return;
    }
    window.location.href = '/complaints/history.html';
}

async function handleSignOut() {
    try {
        await window.Clerk.signOut();
        // Redirect to main page after successful logout
        window.location.href = '/HTML/main.html';
    } catch (error) {
        console.error('Error during sign out:', error);
    }
}

// Make handleSignOut available globally
window.handleSignOut = handleSignOut;