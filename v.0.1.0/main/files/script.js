// Sample data for graph
const sampleData = {
    websites: ["google.com", "yahoo.com", "example.com", "github.com"],
    loadTimes: [1.2, 2.5, 3.0, 0.8] // Load times in seconds
};

// Store the settings data
let settings = {
    storageLocation: "",
    website: "",
    saveLink: false,
    latestDataCount: 5
};

// Global variable to store the chart instance
let myChart = null;

// Function to display the graph popup
document.getElementById('showGraphBtn').addEventListener('click', function() {
    const graphPopup = document.getElementById('graphPopup');
    graphPopup.style.display = 'flex';

    const ctx = document.getElementById('loadTimeChart').getContext('2d');

    // Destroy the existing chart instance if it exists
    if (myChart) {
        myChart.destroy();
    }

    // Create a new chart
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sampleData.websites,
            datasets: [{
                label: 'Load Time (seconds)',
                data: sampleData.loadTimes,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

// Function to close the graph popup
document.getElementById('closeGraph').addEventListener('click', function() {
    const graphPopup = document.getElementById('graphPopup');
    graphPopup.style.display = 'none';

    // Destroy the chart instance when closing the popup
    if (myChart) {
        myChart.destroy();
        myChart = null; // Clear the chart reference
    }
});

// Function to display the settings menu
document.getElementById('settingsBtn').addEventListener('click', function() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.style.display = 'flex';
});

// Function to close the settings menu
document.getElementById('closeSettings').addEventListener('click', function() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.style.display = 'none';
});

// Open folder input field when user clicks "Browse Folder" button
document.getElementById('browseFolderBtn').addEventListener('click', function(event) {
    // Prevent default behavior (if any) and stop event propagation
    event.preventDefault();
    event.stopPropagation();

    // Focus the text input for manual folder entry
    const storageInput = document.getElementById('storageLocation');
    storageInput.style.display = 'block'; // Ensure the input is visible
    storageInput.focus(); // Focus on the input for the user
});

document.getElementById('saveSettings').addEventListener('click', async function() {
    const storageLocationInput = document.getElementById('storageLocation');
    const website = document.getElementById('website').value.trim();
    const saveLink = document.getElementById('saveLinkCheckbox').checked;
    const serverSave = document.getElementById('serverCheckbox').checked;
    const latestDataCount = parseInt(document.getElementById('latestDataCount').value, 10);

    const storageLocation = storageLocationInput.value.trim();

    if (storageLocation && website && latestDataCount > 0) {
        settings.storageLocation = storageLocation;
        settings.website = website;
        settings.saveLink = saveLink;
        settings.latestDataCount = latestDataCount;
        settings.serverSave = serverSave;

        const settingsJson = JSON.stringify(settings);

        try {
            // Request a file handle
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: 'settings.json',
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] }
                }]
            });

            // Write to the file
            const writable = await fileHandle.createWritable();
            await writable.write(settingsJson);
            await writable.close();

            alert('Settings saved!');
            document.getElementById('settingsMenu').style.display = 'none';
        } catch (err) {
            console.error('Save canceled or failed:', err);
            alert('Failed to save settings!');
        }
    } else {
        alert('Please fill in all fields!');
    }
});



// Function to download JSON file
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
