Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

const { loadScript } = require("sandbox")
    , { onUnload } = require("unload");

function ContentService() {
  this.scriptDetails = Array.prototype.slice.call(arguments, 0);
}

ContentService.prototype.QueryInterface = XPCOMUtils.generateQI([
  Ci.nsIObserver
]);
ContentService.prototype.init = function(){
  const observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
  observerService.addObserver(this, "document-element-inserted", false);
  onUnload(this.unload.bind(this));
};
ContentService.prototype.unload = function(){
  const observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
  observerService.removeObserver(this, "document-element-inserted");
};

ContentService.prototype.runScripts = function(aContentWin) {
  try {
    this.window.QueryInterface(Ci.nsIDOMChromeWindow);
    // Never ever inject scripts into a chrome context window.
    return;
  } catch(e) {
    // Ignore, it's good if we can't QI to a chrome window.
  }

  const url = aContentWin.document.documentURI;
  
  loadScript.apply(this, this.scriptDetails.concat([aContentWin, url]));
};

ContentService.prototype.observe = function(aSubject, aTopic, aData) {
  try {
    switch (aTopic) {
      case 'document-element-inserted':
        const doc = aSubject;
        const url = doc.documentURI;

        const win = doc && doc.defaultView;
        if (!doc || !win) break;
        
        try {
          this.contentFrameMessageManager(win);
        } catch (e) {
          return;
        }
        
        this.runScripts(win);
        break;
    }
  } catch (e) {
    Cu.reportError(e);
  }
};

ContentService.prototype.contentFrameMessageManager = function(aContentWin) {
  return aContentWin.QueryInterface(Ci.nsIInterfaceRequestor)
    .getInterface(Ci.nsIWebNavigation)
    .QueryInterface(Ci.nsIDocShellTreeItem)
    .rootTreeItem
    .QueryInterface(Ci.nsIInterfaceRequestor)
    .getInterface(Ci.nsIContentFrameMessageManager);
};

exports["ContentService"] = ContentService;