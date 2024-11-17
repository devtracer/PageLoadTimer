// Record the start time when the script is executed
const startTime = performance.now();

// Get the current page's URL
const currentURL = window.location.href;

// Utility function to save performance data with a timestamp
function savePerformanceData(url, domLoadTime, loadTime) {
  // Retrieve existing performance data from localStorage
  const existingData = JSON.parse(localStorage.getItem('performanceData')) || {};

  // Get the current date in ISO format
  const currentDate = new Date().toISOString();

  // Add new data associated with the current URL
  if (!existingData[url]) {
    existingData[url] = [];
  }

  existingData[url].push({
    date: currentDate,
    domLoadTime: domLoadTime.toFixed(2),
    loadTime: loadTime.toFixed(2),
  });

  // Save the updated data back to localStorage
  localStorage.setItem('performanceData', JSON.stringify(existingData));
}

// Measure when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const domContentLoadedTime = performance.now();
  const domLoadTime = domContentLoadedTime - startTime;

  // Optional: Send the time via Chrome runtime messaging if needed
  chrome.runtime.sendMessage({ action: "setDomLoadTime", domLoadTime });
});

// Measure when the window has fully loaded
window.addEventListener('load', () => {
  const endTime = performance.now();
  const loadTime = endTime - startTime;

  // Save the URL, performance times, and the date to localStorage
  const domContentLoadedTime = performance.now() - startTime;
  savePerformanceData(currentURL, domContentLoadedTime, loadTime);

  // Optional: Send the time via Chrome runtime messaging if needed
  chrome.runtime.sendMessage({ action: "setLoadTime", loadTime });

  // Optional: Log performance entries for more insights
  const performanceEntries = performance.getEntriesByType("navigation");
  if (performanceEntries.length > 0) {
    console.log(performanceEntries[0]);
  }
});

// Utility to fetch and log saved times for all URLs
const logAllSavedTimes = () => {
  const performanceData = JSON.parse(localStorage.getItem('performanceData')) || {};
  console.log('Saved Performance Data:', performanceData);
};

// Example usage: Log all saved performance data to the console
logAllSavedTimes();
