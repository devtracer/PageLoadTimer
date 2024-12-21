// Declare sampleData globally to be accessible
let sampleData = {
    websites: [],
    loadTimes: []
};

// Function to retrieve load time data from local storage and format it for the graph
function getGraphData() {
    chrome.storage.local.get("data", function(result) {
        const websites = [];
        const loadTimes = [];

        // Iterate through stored data and format
        if (result.data) {
            result.data.forEach(item => {
                websites.push(item.url || ""); // If no URL, add an empty string
                loadTimes.push(item.loadTime); // Assuming loadTime is already a number
            });
        }

        // Update sampleData for the graph
        sampleData = {
            websites: websites,
            loadTimes: loadTimes
        };

        console.log(sampleData);  // Log the data (or use it for graphing purposes)
    });
}

// Global variable to store the chart instance
let myChart = null;

// Function to display the graph popup
document.getElementById('showGraphBtn').addEventListener('click', function() {
    const dataPopup = document.getElementById('dataPopup');
    dataPopup.style.display = 'flex';
});

// Function to show the table view
function showTable(filteredWebsites, filteredLoadTimes) {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    filteredWebsites.forEach((site, index) => {
        const row = document.createElement("tr");
        const websiteCell = document.createElement("td");
        websiteCell.textContent = site;
        const loadTimeCell = document.createElement("td");
        loadTimeCell.textContent = filteredLoadTimes[index] || "N/A";

        row.appendChild(websiteCell);
        row.appendChild(loadTimeCell);
        tableBody.appendChild(row);
    });

    // Show the table
    document.getElementById("tableSection").style.display = "block";
    document.getElementById("graphSection").style.display = "none";
}

// Function to show the graph view
function showGraph(filteredWebsites, filteredLoadTimes) {
    const ctx = document.getElementById('loadTimeChart').getContext('2d');

    if (myChart) {
        myChart.destroy(); // Destroy the old chart before creating a new one
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: filteredWebsites,
            datasets: [{
                label: 'Load Time (seconds)',
                data: filteredLoadTimes.map(time => (time / 1000).toFixed(2)), // Convert to seconds here
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    display: false,  // Hide the X-axis labels
                },
                y: {
                    beginAtZero: true  // Ensure the Y-axis starts from zero
                }
            }
        }
    });

    // Show the graph
    document.getElementById("graphSection").style.display = "block";
    document.getElementById("tableSection").style.display = "none";
}


// Event listener for showing the data (either graph or table)
document.getElementById('showoutput').addEventListener('click', function() {
    const siteInput = document.getElementById('website').value.trim();
    const amountInput = document.getElementById('latestDataCount').value.trim();

    let filteredWebsites = sampleData.websites;
    let filteredLoadTimes = sampleData.loadTimes;

    // Filter by website if input is provided
    if (siteInput) {
        filteredWebsites = filteredWebsites.filter(site => site.includes(siteInput));
        filteredLoadTimes = filteredLoadTimes.filter((_, index) => sampleData.websites[index].includes(siteInput));
    }

    // Filter by amount if input is provided
    if (amountInput && !isNaN(amountInput)) {
        const amount = parseInt(amountInput);
        filteredWebsites = filteredWebsites.slice(0, amount);
        filteredLoadTimes = filteredLoadTimes.slice(0, amount);
    } else if (amountInput) {
        alert('Please enter a valid number for the amount of records.');
        return;  // Exit if input is invalid
    }

    // Show table or graph based on filtered data
    if (filteredWebsites.length > 0) {
        showTable(filteredWebsites, filteredLoadTimes); // Show the table first
        showGraph(filteredWebsites, filteredLoadTimes); // Then show the graph (you can remove one of these based on user preference)
    } else {
        alert("No data found for the provided filters.");
    }
});

// Function to close the graph or table popup with fade effect
function closePopup() {
    const graphPopup = document.getElementById('dataPopup');
    
    // Start the fade-out transition
    graphPopup.style.opacity = '0';
    
    // After the fade-out is complete, hide the popup
    setTimeout(function() {
        graphPopup.style.display = 'none';
        graphPopup.style.opacity = '1'; // Reset opacity for the next time
    }, 300); // Match the transition duration (300ms)
}

document.getElementById('closeGraph').addEventListener('click', closePopup);
document.getElementById('closeTable').addEventListener('click', closePopup);

// Function to close the settings menu
document.getElementById('closeSettings').addEventListener('click', function() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.style.display = 'none';
});

// Function to display the settings menu
document.getElementById('settingsBtn').addEventListener('click', function() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.style.display = 'flex';
});

// Function to save settings
document.getElementById('saveSettings').addEventListener('click', function () {
    const website = document.getElementById('website').value;
    const saveLink = document.getElementById('saveLinkCheckbox').checked;
    const serverSave = document.getElementById('serverCheckbox').checked;
    const latestDataCount = parseInt(document.getElementById('latestDataCount').value, 10);

    if (website && latestDataCount > 0) {
        const settings = {
            website: website,
            saveLink: saveLink,
            latestDataCount: latestDataCount,
            serverSave: serverSave
        };

        // Save settings to chrome.storage.local
        chrome.storage.local.set({settings: settings}, function() {
            alert('Settings saved!');
            document.getElementById('settingsMenu').style.display = 'none';
        });
    } else {
        alert('Please fill in all fields!');
    }
});

// Helper function to trigger file download
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Function to save load time data
document.getElementById('saveDataBtn').addEventListener('click', function() {
    const data = {
        websites: sampleData.websites,
        loadTimes: sampleData.loadTimes
    };
    downloadFile(JSON.stringify(data), 'load_time_data.json');
});

// Initialize graph data when page loads
getGraphData();
