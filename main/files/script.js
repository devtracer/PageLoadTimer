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

// Function to display the graph popup
document.getElementById('showGraphBtn').addEventListener('click', function () {
    const graphPopup = document.getElementById('graphPopup');
    graphPopup.style.display = 'flex';
    drawChart(sampleData);
});

// Function to close the graph popup
document.getElementById('closeGraph').addEventListener('click', function () {
    const graphPopup = document.getElementById('graphPopup');
    graphPopup.style.display = 'none';
});

// Draw chart using built-in Canvas API with dynamic scaling
function drawChart(data) {
    const canvas = document.getElementById('loadTimeChart');
    const ctx = canvas.getContext('2d');
    const maxBarsToShow = 10;
    const totalWebsites = data.websites.length;
    
    // Dynamically adjust canvas size based on dataset size
    canvas.width = totalWebsites > maxBarsToShow ? totalWebsites * 100 : 800;
    canvas.height = 400;
    
    const chartHeight = canvas.height;
    const chartWidth = canvas.width;
    const maxLoadTime = Math.max(...data.loadTimes);

    const barWidth = Math.max(20, Math.min(60, chartWidth / (totalWebsites * 2)));
    const barSpacing = Math.max(10, (chartWidth - totalWebsites * barWidth) / (totalWebsites + 1));
    const xStart = 50;
    const yStart = chartHeight - 30;

    // Clear canvas for redrawing
    ctx.clearRect(0, 0, chartWidth, chartHeight);

    // Draw axis
    ctx.beginPath();
    ctx.moveTo(xStart, 10);
    ctx.lineTo(xStart, yStart);
    ctx.lineTo(chartWidth - 10, yStart);
    ctx.stroke();

    // Draw bars
    data.websites.forEach((site, index) => {
        const barHeight = (data.loadTimes[index] / maxLoadTime) * (chartHeight - 60);
        const xPos = xStart + barSpacing + index * (barWidth + barSpacing);
        const yPos = yStart - barHeight;

        // Draw bar
        ctx.fillStyle = 'rgba(75, 192, 192, 0.8)';
        ctx.fillRect(xPos, yPos, barWidth, barHeight);

        // Add labels
        ctx.fillStyle = '#000';
        ctx.font = `${Math.max(10, Math.min(14, barWidth / 3))}px Arial`;
        ctx.fillText(site, xPos + barWidth / 4, yStart + 15);
        ctx.fillText(data.loadTimes[index].toFixed(1), xPos + barWidth / 4, yPos - 5);
    });
}

// Function to display the settings menu
document.getElementById('settingsBtn').addEventListener('click', function () {
    document.getElementById('settingsMenu').style.display = 'flex';
});

// Function to close the settings menu
document.getElementById('closeSettings').addEventListener('click', function () {
    document.getElementById('settingsMenu').style.display = 'none';
});

// Open folder picker dialog when user clicks "Browse Folder" button
document.getElementById('browseFolderBtn').addEventListener('click', function () {
    document.getElementById('storageLocation').click();
});

// Function to save settings (store as JSON)
document.getElementById('saveSettings').addEventListener('click', function () {
    const storageLocationInput = document.getElementById('storageLocation');
    const website = document.getElementById('website').value;
    const saveLink = document.getElementById('saveLinkCheckbox').checked;
    const serverSave = document.getElementById('serverCheckbox').checked;
    const latestDataCount = parseInt(document.getElementById('latestDataCount').value, 10);

    const storageLocation = storageLocationInput.files.length > 0
        ? storageLocationInput.files[0].webkitRelativePath.split('/')[0]
        : '';

    if (storageLocation && website && latestDataCount > 0) {
        settings.storageLocation = storageLocation;
        settings.website = website;
        settings.saveLink = saveLink;
        settings.latestDataCount = latestDataCount;
        settings.serverSave = serverSave;

        const settingsJson = JSON.stringify(settings);
        downloadFile(settingsJson, 'settings.json');

        alert('Settings saved!');
        document.getElementById('settingsMenu').style.display = 'none';
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
document.getElementById('saveDataBtn').addEventListener('click', function () {
    const data = {
        websites: sampleData.websites,
        loadTimes: sampleData.loadTimes
    };
    downloadFile(JSON.stringify(data), 'load_time_data.json');
});
