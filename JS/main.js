window.addEventListener("load", async () => {
    try {
        await Clerk.load();
        
        const signedOutButtons = document.getElementById("signed-out-buttons");
        const signedInButtons = document.getElementById("signed-in-buttons");
        const welcomeDiv = document.getElementById("welcome");
        const heroSection = document.getElementById("hero");
        const complaintsSection = document.getElementById("complaints-section");

        // Check authentication state
        if (Clerk.user) {
            // Authenticated user view
            signedOutButtons.style.display = "none";
            signedInButtons.style.display = "flex";
            welcomeDiv.innerText = `Welcome, ${Clerk.user.fullName}`;
            heroSection.style.display = "none";
            complaintsSection.style.display = "block";
            
            // Update navigation for authenticated users
            const nav = document.getElementById("navbarnav");
            nav.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link" href="#complaints">My Complaints</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#track">Track Complaint</a>
                </li>
            `;
        } else {
            // Non-authenticated user view
            signedOutButtons.style.display = "flex";
            signedInButtons.style.display = "none";
            heroSection.style.display = "block";
            complaintsSection.style.display = "none";
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