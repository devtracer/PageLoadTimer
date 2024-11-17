// Record the start time when the script is executed
const startTime = performance.now();

// Measure when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const domContentLoadedTime = performance.now();
  const domLoadTime = domContentLoadedTime - startTime;

  // Send the DOM content loaded time
  chrome.runtime.sendMessage({ action: "setDomLoadTime", domLoadTime });
});

// Measure when the window has fully loaded
window.addEventListener('load', () => {
  const endTime = performance.now();
  const loadTime = endTime - startTime;

  // Send the complete load time
  chrome.runtime.sendMessage({ action: "setLoadTime", loadTime });

  // Optional: Log performance entries for more insights
  const performanceEntries = performance.getEntriesByType("navigation");
  if (performanceEntries.length > 0) {
    console.log(performanceEntries[0]);
  }
});
