const { Clerk } = require("@clerk/clerk-js");

window.addEventListener("load", async () => {
    try {
        await Clerk.load();

        const signedOutButtons = document.getElementById("signed-out-buttons");
        const signedInButtons = document.getElementById("signed-in-buttons");
        // const welcomeDiv = document.getElementById("welcome");
        const heroSection = document.getElementById("hero");
        const aboutSection = document.getElementById("about");
        const worksSection = document.getElementById("how-it-works");
        const feedbackSection = document.getElementById("feedback-carousel");
        const complaintsSection = document.getElementById("complaints-section");
        const profileSection = document.getElementById("profile-section");

        // Check authentication state
        if (Clerk.user) {
            // Authenticated user view
            signedOutButtons.style.display = "none";
            signedInButtons.style.display = "flex";
            // welcomeDiv.innerText = `Welcome`;
            heroSection.style.display = "none";
            aboutSection.style.display = "none";
            worksSection.style.display = "none";
            feedbackSection.style.display = "none";
            complaintsSection.style.display = "block";

            // Show profile section for specific roles
            const role = Clerk.user.unsafeMetadata.role || "Resident";
            if (role === "Resident" || role === "Admin") {
                profileSection.style.display = "block";

                // Populate profile details
                document.getElementById("profile-pic").src = Clerk.user.profileImageUrl || "/assets/profile_4372360.png";
                document.getElementById("profile-name").innerText = Clerk.user.fullName;
                document.getElementById("profile-role").innerText = role;
                document.getElementById("profile-location").innerText = Clerk.user.unsafeMetadata.location || "Not provided";
                document.getElementById("profile-phone").innerText = Clerk.user.unsafeMetadata.phone || "Not provided";
            } else {
                profileSection.style.display = "none";
            }
        } else {
            // Non-authenticated user view
            signedOutButtons.style.display = "flex";
            signedInButtons.style.display = "none";
            heroSection.style.display = "block";
            complaintsSection.style.display = "none";
            profileSection.style.display = "none";
        }

        // Load the saved profile picture on page load
        const savedProfilePic = localStorage.getItem("profilePicture");
        if (savedProfilePic) {
            document.getElementById("profile-pic").src = savedProfilePic;
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
    window.location.href = '/HTML/complaint.html';
}

function viewComplaints() {
    if (!Clerk.user) {
        window.location.href = '/HTML/login.html';
        return;
    }
    window.location.href = '/HTML/trackcomplaints.html';
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

// Add this function for smooth scrolling
function scrollToAbout(event) {
    event.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Make it globally available
window.scrollToAbout = scrollToAbout;

// Add event listeners for smooth scrolling
document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1); // Remove the '#' from href
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            console.log(`Scrolling to: ${targetId}`); // Debugging log
            targetElement.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error(`Element with ID '${targetId}' not found.`);
        }
    });
});
function saveProfileChanges() {
    // Convert Name field to plain text
    const nameInput = document.getElementById('profile-name');
    const nameValue = nameInput.value;
    nameInput.outerHTML = `<p id="profile-name" class="form-control-plaintext">${nameValue}</p>`;

    // Convert Location field to plain text
    const locationInput = document.getElementById('profile-location');
    const locationValue = locationInput.value;
    locationInput.outerHTML = `<p id="profile-location" class="form-control-plaintext">${locationValue}</p>`;

    // Convert Phone field to plain text
    const phoneInput = document.getElementById('profile-phone');
    const phoneValue = phoneInput.value;
    phoneInput.outerHTML = `<p id="profile-phone" class="form-control-plaintext">${phoneValue}</p>`;

    // Optionally disable the Save Changes button
    document.querySelector('button[onclick="saveProfileChanges()"]').disabled = true;
  }

function toggleEdit(isEditing) {
    if (!isEditing) {
        // On Save — update the text content with input values
        document.getElementById('name-view').textContent = document.getElementById('name-input').value;
        document.getElementById('role-view').textContent = document.getElementById('role-input').value;
        document.getElementById('location-view').textContent = document.getElementById('location-input').value;
        document.getElementById('phone-view').textContent = document.getElementById('phone-input').value;
    } else {
        // On Edit — prefill inputs with current view text
        document.getElementById('name-input').value = document.getElementById('name-view').textContent;
        document.getElementById('role-input').value = document.getElementById('role-view').textContent || Clerk.user.unsafeMetadata.role || "Resident";
        document.getElementById('location-input').value = document.getElementById('location-view').textContent;
        document.getElementById('phone-input').value = document.getElementById('phone-view').textContent;
    }

    // Toggle view vs input fields
    document.getElementById('name-view').style.display = isEditing ? 'none' : 'block';
    document.getElementById('name-input').style.display = isEditing ? 'block' : 'none';

    document.getElementById('role-view').style.display = isEditing ? 'none' : 'block';
    document.getElementById('role-input').style.display = isEditing ? 'block' : 'none';

    document.getElementById('location-view').style.display = isEditing ? 'none' : 'block';
    document.getElementById('location-input').style.display = isEditing ? 'block' : 'none';
    document.getElementById('location-btn').style.display = isEditing ? 'inline-block' : 'none';

    document.getElementById('phone-view').style.display = isEditing ? 'none' : 'block';
    document.getElementById('phone-input').style.display = isEditing ? 'block' : 'none';

    // Profile picture controls
    document.getElementById('pic-edit-controls').style.display = isEditing ? 'flex' : 'none';

    // Toggle buttons
    document.getElementById('edit-button').style.display = isEditing ? 'none' : 'inline-block';
    document.getElementById('save-button').style.display = isEditing ? 'inline-block' : 'none';
}

function saveProfileData() {
    const name = document.getElementById("name-input").value;
    const role = document.getElementById("profile-role").innerText;
    const location = document.getElementById("location-input").value;
  
    const profile = { name, role, location };
    localStorage.setItem("profile", JSON.stringify(profile));
  
    // Update UI
    document.getElementById("name-view").innerText = name;
    document.getElementById("profile-location").innerText = location;
  }
  window.addEventListener("DOMContentLoaded", () => {
    const storedProfile = localStorage.getItem("profile");
    if (storedProfile) {
      const { name, role, location } = JSON.parse(storedProfile);
      document.getElementById("name-view").innerText = name;
      document.getElementById("profile-role").innerText = role;
      document.getElementById("profile-location").innerText = location;
      document.getElementById("name-input").value = name;
      document.getElementById("location-input").value = location;
    }
  });
  
function previewProfilePicture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profilePic = document.getElementById("profile-pic");
            profilePic.src = e.target.result; // Set the selected image as the profile picture
        };
        reader.readAsDataURL(file);
    }
}

function saveProfilePicture() {
    const profilePic = document.getElementById("profile-pic").src;
    if (profilePic) {
        localStorage.setItem("profilePicture", profilePic); // Save the image data URL to local storage
        alert("Profile picture saved successfully!");
    } else {
        alert("No profile picture to save.");
    }
}

async function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            // Use a reverse geocoding API to get the address from latitude and longitude
            const apiKey = "9ef4bdbcacb347bcb0cb17814e9686e3"; // Replace with your API key (e.g., Google Maps API or OpenCage)
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const address = data.results[0].formatted;
                    document.getElementById("location-input").value = address; // Update the location field
                    alert("Location updated successfully!");
                } else {
                    alert("Unable to fetch address. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching location:", error);
                alert("An error occurred while fetching the location.");
            }
        }, (error) => {
            console.error("Geolocation error:", error);
            alert("Unable to access your location. Please enable location services.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function openComplaintForm(){
    if (!Clerk.user) {
        window.location.href = '/HTML/login.html';
        return;
    }
    window.location.href = '/HTML/complaint.html';

}

async function saveComplaint(complaintData) {
    try {
        const response = await fetch('/data/complaints.json');
        const data = await response.json();
        
        const newComplaint = {
            id: `COMP-${Date.now()}`,
            userId: Clerk.user.id,
            status: 'Pending',
            timestamp: new Date().toISOString(),
            ...complaintData
        };
        
        data.complaints.push(newComplaint);
        
        // Save back to file (requires server-side handling)
        await fetch('/api/saveComplaints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        return newComplaint.id;
    } catch (error) {
        console.error('Error saving complaint:', error);
        throw error;
    }
}

async function getComplaints(userId) {
    try {
        const response = await fetch('/data/complaints.json');
        const data = await response.json();
        return data.complaints.filter(c => c.userId === userId);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        throw error;
    }
}