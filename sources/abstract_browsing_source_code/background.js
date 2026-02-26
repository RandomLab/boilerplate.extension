/**
 * Represents a Chrome tab, but only props that are relevant for our extension.
 * https://developer.chrome.com/docs/extensions/reference/api/tabs#type-Tab
 * @typedef {Object} Tab
 * @property {number} id - The unique identifier of the tab.
 * @property {string} url - The URL of the tab.
 * @property {string} title - The title of the tab.
 * @property {boolean} active - Whether the tab is currently active.
 */

let statusPerTab;

/**
 * @returns {Object.<number, boolean>} Status per tab (abstract browsing on/off)
 */
const updateStatusPerTab = async () => {
    const result = await chrome.storage.local.get(["statusPerTab"]);
    /**@type {Object.<number, boolean>}*/
    statusPerTab = result.statusPerTab || {};
}
/**
 * @param {Tab} tab Chrome Tab
 * @returns {boolean} Boolean indicating whether abstract browsing is currently on in the tab.
 */
const getTabStatus = tab => {
    return statusPerTab[tab.id] || false;
}
/**
 * @param {Tab} tab 
 * @param {boolean} status 
 */
const setTabStatus = (tab, status) => {
    statusPerTab[tab.id] = status;
    chrome.storage.local.set({ statusPerTab });
}

const getCurrentTab = async () => {
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    return tab;
}

//user clicks icon:
chrome.action.onClicked.addListener(async () => {
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(
        tab.id,
        { method: "toggle" },
        null,
        response => {
            onStatusResponse(response);
            setTabStatus(tab, response);
        }
    );
});


//tab becomes active:
chrome.tabs.onActivated.addListener(info => {
    chrome.tabs.sendMessage(info.tabId, { method: "status" }, null, onStatusResponse);
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.method == "getStatus") {
        const status = getTabStatus(sender.tab);
        // console.log("getStatus", sender.tab.id, status)
        sendResponse(status);
    }
});

// Clear status of tabs when updating/installing
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason !== "install" && details.reason !== "update") return;
    chrome.storage.local.clear();
});

//callback:
onStatusResponse = isAbstract => {
    if (isAbstract) {
        chrome.action.setIcon({ path: 'abstract-no.png' });
        chrome.action.setTitle({ title: "Stop Abstract Browsing" });
    }
    else {
        chrome.action.setIcon({ path: 'abstract-yes.png' });
        chrome.action.setTitle({ title: "Start Abstract Browsing" });
    }
}

//get all existing tabs and insert check.js etc

updateStatusPerTab();

chrome.tabs.query({}, tabs => {
    const files = ["jquery-2.1.1.min.js", "config.js", "check.js"];
    for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        try {
            const target = {
                tabId: tab.id,
                allFrames: true
            };
            chrome.scripting.executeScript({ target, files });
        } catch { };
    }
});
