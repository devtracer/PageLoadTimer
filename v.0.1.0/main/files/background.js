function sendLoadTimeToServer(url, loadTime) {
  fetch('http://localhost:3000/load-time', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, loadTime }),
  })
  .then(response => response.json())
  .then(data => console.log(data.message))
  .catch(error => console.error('Error sending load time:', error));
}

// Listen for messages to store load time data
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "setLoadTime") {
    sendLoadTimeToServer(request.url, request.loadTime);
  }
});
// Displaying the page load time on the extension's icon badge
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setLoadTime") {
    const formattedTime = (request.loadTime / 1000).toFixed(2);
    chrome.action.setBadgeText({ text: formattedTime });
  }
});
