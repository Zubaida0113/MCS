function toggleAdminEdit(isEditing) {
    // Toggle input fields for name and office
    const nameView = document.getElementById("admin-profile-name");
    let nameInput = document.getElementById("admin-name-input");

    if (isEditing) {
        // Create the input field only if it doesn't already exist
        if (!nameInput) {
            nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.id = "admin-name-input";
            nameInput.className = "form-control";
            nameInput.value = nameView.textContent;
            nameView.parentNode.appendChild(nameInput);
        }
        nameView.style.display = "none";
        nameInput.style.display = "block";
        document.getElementById("admin-office-dropdown").style.display = "block";
        document.getElementById("admin-profile-office").style.display = "none";
    } else {
        // Save changes and toggle back to view mode
        nameView.textContent = nameInput.value;
        nameView.style.display = "block";
        nameInput.style.display = "none";
        document.getElementById("admin-profile-office").textContent = document.getElementById("admin-office-dropdown").value || "Not Assigned";
        document.getElementById("admin-office-dropdown").style.display = "none";
        document.getElementById("admin-profile-office").style.display = "block";
    }

    // Toggle profile picture controls
    const picControls = document.getElementById("admin-change-picture-btn");
    const fileInput = document.getElementById("admin-file-input");
    if (isEditing) {
        picControls.style.display = "block";
        fileInput.style.display = "block";
    } else {
        picControls.style.display = "none";
        fileInput.style.display = "none";
    }

    // Toggle buttons
    document.getElementById("admin-edit-button").style.display = isEditing ? "none" : "inline-block";
    document.getElementById("admin-save-button").style.display = isEditing ? "inline-block" : "none";
}

function previewAdminProfilePicture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const profilePic = document.getElementById("admin-profile-pic");
            profilePic.src = e.target.result; // Set the selected image as the profile picture
        };
        reader.readAsDataURL(file);
    }
}

function toggleComplaintStatus(complaintId) {
    const statusElement = document.getElementById(`status-${complaintId}`);
    const currentStatus = statusElement.textContent;

    if (currentStatus === "Pending") {
        statusElement.textContent = "Resolved";
        alert(`Complaint #${complaintId} marked as Resolved.`);
    } else {
        statusElement.textContent = "Pending";
        alert(`Complaint #${complaintId} marked as Pending.`);
    }
}

function loadComplaintsByLocality(locality) {
    const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    const complaintsContainer = document.getElementById("complaints-container");
    complaintsContainer.innerHTML = ""; // Clear existing cards

    const filteredComplaints = complaints.filter(complaint => complaint.locality === locality);

    if (filteredComplaints.length === 0) {
        complaintsContainer.innerHTML = '<div class="col-12 text-center">No complaints found for the selected locality.</div>';
        return;
    }

    filteredComplaints.forEach(complaint => {
        const card = document.createElement("div");
        card.className = "col-md-6";
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title" style="color: #007bff;">Complaint #${complaint.id}</h5>
                    <p class="card-text"><strong>Description:</strong> ${complaint.description}</p>
                    <p class="card-text"><strong>Status:</strong> <span id="status-${complaint.id}">${complaint.status}</span></p>
                    <button class="btn btn-outline-primary" onclick="toggleComplaintStatus('${complaint.id}')">Mark as Resolved</button>
                </div>
            </div>
        `;
        complaintsContainer.appendChild(card);
    });
}
