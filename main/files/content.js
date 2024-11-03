// Record the start time when the script is executed
const startTime = performance.now();

// Function to send performance data
function sendPerformanceData(action, time) {
  try {
    chrome.runtime.sendMessage({ action, time });
  } catch (error) {
    console.error(`Failed to send performance data: ${error.message}`);
  }
}

// Measure when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const domContentLoadedTime = performance.now();
  const domLoadTime = (domContentLoadedTime - startTime).toFixed(2); // Rounded for clarity

  // Send the DOM content loaded time
  sendPerformanceData("setDomLoadTime", domLoadTime);
});

// Measure when the window has fully loaded
window.addEventListener('load', () => {
  const endTime = performance.now();
  const loadTime = (endTime - startTime).toFixed(2); // Rounded for clarity

  // Send the complete load time
  sendPerformanceData("setLoadTime", loadTime);

  // Optional: Log performance entries for more insights
  const performanceEntries = performance.getEntriesByType("navigation");
  if (performanceEntries.length > 0) {
    console.log(performanceEntries[0]);
  }

  // Optional: Log additional metrics such as First Paint and First Contentful Paint
  const paintEntries = performance.getEntriesByType("paint");
  paintEntries.forEach(entry => {
    console.log(`${entry.name}: ${entry.startTime.toFixed(2)} ms`);
  });
});
