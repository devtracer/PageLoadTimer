const pageUrl = window.location.href; // Get the current page URL
const loadTime = performance.now(); // Get the load time

// Send both the URL and load time to the background script
chrome.runtime.sendMessage({
  action: "setLoadTime",
  url: pageUrl,
  loadTime: loadTime
});
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
  let loadTime = ((endTime - startTime) / 1000).toFixed(2);

  // Send the complete load time
  chrome.runtime.sendMessage({ action: "setLoadTime", loadTime });

  // Access settings from storage
  chrome.storage.local.get("settings", function (result) {
      if (result.settings && result.settings.website) {
          const pageUrl = window.location.href;

          if (pageUrl.includes(result.settings.website)) {
              // Save the load time for this page
              chrome.storage.local.get("data", function (dataResult) {
                  const data = dataResult.data || [];
                  data.push({ pageUrl, loadTime });

                  chrome.storage.local.set({ data }, function () {
                      console.log("Load time saved successfully.");
                  });
              });
          }
      }
  });

  // Optional: Log performance entries for more insights
  const performanceEntries = performance.getEntriesByType("navigation");
  if (performanceEntries.length > 0) {
      console.log(performanceEntries[0]);
  }
});
