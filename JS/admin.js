function toggleAdminEdit(isEditing) {
    // Toggle input fields for name and office
    const nameView = document.getElementById("admin-profile-name");
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "admin-name-input";
    nameInput.className = "form-control";
    nameInput.value = nameView.textContent;

    if (isEditing) {
        nameView.style.display = "none";
        nameView.parentNode.appendChild(nameInput);
        document.getElementById("admin-office-dropdown").style.display = "block";
        document.getElementById("admin-profile-office").style.display = "none";
    } else {
        nameView.textContent = document.getElementById("admin-name-input").value;
        nameView.style.display = "block";
        nameInput.remove();
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
