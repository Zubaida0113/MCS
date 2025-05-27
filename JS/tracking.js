async function loadComplaints() {
    try {
        const response = await fetch('/api/complaints');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayComplaints(data.complaints);
    } catch (error) {
        console.error('Error loading complaints:', error);
        document.getElementById('complaintsList').innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    Failed to load complaints. Please try again later.
                </div>
            </div>
        `;
    }
}

function displayComplaints(complaints) {
    const complaintsList = document.getElementById('complaintsList');
    const noComplaints = document.getElementById('noComplaints');
    
    if (!complaints || complaints.length === 0) {
        noComplaints.style.display = 'block';
        complaintsList.innerHTML = '';
        return;
    }

    noComplaints.style.display = 'none';
    complaintsList.innerHTML = complaints.map(complaint => `
        <div class="col-md-6 col-lg-4">
            <div class="card complaint-card">
                <div class="card-body">
                    <h5 class="card-title">Complaint #${complaint.id}</h5>
                    <p class="card-subtitle mb-2 text-muted">
                        ${new Date(complaint.timestamp).toLocaleDateString()}
                    </p>
                    <p class="card-text"><strong>Type:</strong> ${complaint.type || 'N/A'}</p>
                    <p class="card-text"><strong>Office:</strong> ${complaint.office}</p>
                    <p class="card-text">${complaint.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-${getStatusColor(complaint.status)}">
                            ${complaint.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    const colors = {
        'Pending': 'warning',
        'Processing': 'info',
        'Resolved': 'success',
        'Rejected': 'danger'
    };
    return colors[status] || 'secondary';
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', loadComplaints);