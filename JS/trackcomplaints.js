document.addEventListener("DOMContentLoaded", function () {
  const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
  renderComplaints(complaints);

  // Filter complaints based on dropdown selection
  window.filterComplaints = function (filter) {
    let filteredComplaints = [...complaints];

    switch (filter) {
      case "most-recent":
        filteredComplaints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case "oldest":
        filteredComplaints.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case "pending":
        filteredComplaints = filteredComplaints.filter(complaint => complaint.status === "Pending");
        break;
      case "resolved":
        filteredComplaints = filteredComplaints.filter(complaint => complaint.status === "Resolved");
        break;
    }

    renderComplaints(filteredComplaints);
  };

  // Render complaints in the table
  function renderComplaints(complaints) {
    const tableBody = document.getElementById("complaints-table-body");
    tableBody.innerHTML = "";

    if (complaints.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No complaints found.</td></tr>';
      return;
    }

    complaints.forEach(complaint => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="complaint-id">#${complaint.id}</td>
        <td>${complaint.description}</td>
        <td>${complaint.status}</td>
        <td>${new Date(complaint.timestamp).toLocaleDateString()}</td>
      `;
      tableBody.appendChild(row);
    });
  }
});
