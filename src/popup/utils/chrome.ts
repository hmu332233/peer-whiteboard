export const sendMessage = (message: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0].id) return;      
    return chrome.tabs.sendMessage(tabs[0].id, message);
  });
}