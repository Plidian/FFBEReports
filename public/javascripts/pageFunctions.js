function togglePots(){
  //var myPot = document.getElementById('pots_doors');
  var myPotTab = document.getElementById('pots_doorsTable');
  var displaySetting = myPotTab.style.display;
  var potsButton = document.getElementById('potsButton');
  if(displaySetting=='inline-block'){
    //myPot.style.display='none';
    myPotTab.style.display='none';
    potsButton.innerHTML='Show Pots/Doors';
  } else {
    //myPot.style.display='inline-block';
    myPotTab.style.display='inline-block';
    potsButton.innerHTML='Hide Pots/Doors';
  }
}
function toggleCactuar(){
  //var myCac = document.getElementById('cactuar');
  var myCacTab = document.getElementById('cactuarsTable');
  var displaySetting = myCacTab.style.display;
  var cactuarButton = document.getElementById('cactuarButton');
  if(displaySetting=='inline-block'){
    //myCac.style.display='none';
    myCacTab.style.display='none';
    cactuarButton.innerHTML='Show Cactuars/Snappers';
  } else {
    //myCac.style.display='inline-block';
    myCacTab.style.display='inline-block';
    cactuarButton.innerHTML='Hide Cactuars/Snappers';
  }
}
function toggleMoogles(){
  //var myMog = document.getElementById('moogles');
  var myMogTab = document.getElementById('mooglesTable');
  var displaySetting = myMogTab.style.display;
  var mooglesButton = document.getElementById('mooglesButton');
  if(displaySetting=='inline-block'){
    //myMog.style.display='none';
    myMogTab.style.display='none';
    mooglesButton.innerHTML='Show Moogles';
  } else {
  //myMog.style.display='inline-block';
  myMogTab.style.display='inline-block';
  mooglesButton.innerHTML='Hide Moogles';
  }
}
function toggleCSV(){
  var myCsv = document.getElementById('csv');
  var displaySetting = myCsv.style.display;
  var csvButton = document.getElementById('csvButton');
  if(displaySetting=='inline-block'){
    myCsv.style.display='none';
    csvButton.innerHTML='Show CSV';
  } else {
    myCsv.style.display='inline-block';
    csvButton.innerHTML='Hide CSV';
  }
}
function toggleJSON(){
  var myJSON = document.getElementById('json');
  var displaySetting = myJSON.style.display;
  var JSONButton = document.getElementById('JSONButton');
  if(displaySetting=='inline-block'){
    myJSON.style.display='none';
    JSONButton.innerHTML='Show JSON';
  } else {
    myJSON.style.display='inline-block';
    JSONButton.innerHTML='Hide JSON';
  }
}
function toggleInventory(){
  //get the pre
  //var myInventory = document.getElementById('inventory');
  var myInventoryTab = document.getElementById('inventoryTable');
  var displaySetting = myInventoryTab.style.display;
  var inventoryButton = document.getElementById('inventoryButton');
  if(displaySetting=='inline-block'){
  //myInventory.style.display='none';
  myInventoryTab.style.display='none';
  inventoryButton.innerHTML='Show Inventory';
  } else {
    //myInventory.style.display='inline-block';
    myInventoryTab.style.display='inline-block';
    inventoryButton.innerHTML='Hide Inventory';
  }
}
function toggleConsumables(){
//  var myCons = document.getElementById('consumables');
  var myConsTab = document.getElementById('consumablesTable');
  var displaySetting = myConsTab.style.display;
  var consumablesButton = document.getElementById('consumablesButton');
  if(displaySetting=='inline-block'){
    //myCons.style.display='none';
    myConsTab.style.display='none';
    consumablesButton.innerHTML='Show Consumables';
  } else {
    //myCons.style.display='inline-block';
    myConsTab.style.display='inline-block';
    consumablesButton.innerHTML='Hide Consumables';
  }
}

function exportCSVUnits(CSVUnits,userName){
  window.saveAs(new Blob([CSVUnits],{type: "text/csv;charset=utf-8"}),userName+'unitsCSV.csv');
}
function exportJSONUnits(JSONUnits,userName){
  window.saveAs(new Blob([JSONUnits],{type: "application/json;charset=utf-8"}),userName+'unitsJSON.json');
}
function exportCSVMoogles(moogles,userName){
  window.saveAs(new Blob([moogles],{type: "text/csv;charset=utf-8"}),userName+'moogles.csv');
}
function exportCSVPots(pots,userName){
  window.saveAs(new Blob([pots],{type: "text/csv;charset=utf-8"}),userName+'pots.csv');
}
function exportCSVCactuars(cactuars,userName){
  window.saveAs(new Blob([cactuars],{type: "text/csv;charset=utf-8"}),userName+'cactuars.csv');
}
function exportCSVInventory(CSVinventory,userName){
  window.saveAs(new Blob([CSVinventory],{type: "text/csv;charset=utf-8"}),userName+'inventory.csv');
}
function exportJSONInventory(JSONinventory,userName){
  window.saveAs(new Blob([JSONinventory],{type: "application/json;charset=utf-8"}),userName+'inventory.json');
}
function exportJSONConsumables(consumables,userName){
  window.saveAs(new Blob([consumables],{type: "text/csv;charset=utf-8"}),userName+'consumables.csv');
}
function loadInventory() {
    $.get('googleOAuthUrl', function(result) {
        Modal.show({
            title: "Google Authentication",
            body: '<p>You\'ll be redirected to a google authentication page</p>'+
                  "<p>This account is only for FFBE Equip to store your data. It will NOT link automatically to your FFBE account. You don't need to switch to Google to log in FFBE.</p>" +
                  '<p class="loginMessageDetail">'+
                    'This site is using '+
                    '<a href="https://en.wikipedia.org/wiki/OAuth" target="_blank" rel="noreferrer">OAuth2 <span class="glyphicon glyphicon-question-sign"/></a> '+
                    'to access the stored inventory data, so it will never know your google login and password.'+
                  '</p>'+
                  '<p class="loginMessageDetail">'+
                    'The data is stored on the secure FFBE Reports '+
                    '<a href="https://developers.google.com/drive/v3/web/appdata" target="_blank" rel="noreferrer">app folder on Google Drive <span class="glyphicon glyphicon-question-sign"/></a>. '+
                    'FFBE Reports can only access this folder, and no personal file.'+
                  '</p>',
            buttons: [{
                text: "Continue",
                onClick: function() {
                    // Reset localStorage on connection
                    if (localStorageAvailable) staticFileCache.clear();
                    // Redirect to GoogleAuth
                    window.location.href = result.url + "&state=" + encodeURIComponent(window.location.href.replace(".lyrgard.fr",".com"));
                }
            }]
        });
    }, 'json').fail(function(jqXHR, textStatus, errorThrown ) {
        Modal.showErrorGet(this.url, errorThrown);
    });
}
Modal = {
    show: function(conf) {
        /*
        conf = {
            title: string or function,
            body: string or function,
            size : 'large' or 'small' or false
            onOpen : false or function,
            onClose : false or function,
            withCancelButton: bool
            buttons: [
                {
                    text: string
                    className: string,
                    onClick: function
                }
            ]
        }
        */

        conf = $.extend({
            title: "Modal Title",
            body: "Modal body",
            size : false,
            onOpen : false,
            onClose : false,
            withCancelButton: true,
            buttons: false
        }, conf);

        conf.title = typeof conf.title === 'function' ? conf.title() : conf.title;
        conf.body = typeof conf.body === 'function' ? conf.body() : conf.body;
        var sizeClass = (conf.size === 'large' ? 'modal-lg' : (conf.size === 'small' ? 'modal-sm' : ''))

        if (conf.buttons === false && conf.withCancelButton === false) {
            conf.buttons = [{
                text: "Close",
                className: "",
                onClick: function() {}
            }];
        }

        var html = '<div class="modal temporaryModal" tabindex="-1" role="dialog">';
        html += '  <div class="modal-dialog '+sizeClass+'" role="document">';
        html += '    <div class="modal-content">';
        html += '      <div class="modal-header">';
        html += '        <button type="button" class="close" data-dismiss="modal">&times;</button>';
        html += '        <h4 class="modal-title">'+ conf.title +'</h4>';
        html += '      </div>';
        html += '      <div class="modal-body">' + conf.body + '</div>';
        html += '      <div class="modal-footer">';
        if (conf.withCancelButton) {
            html += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
        }
        $.each(conf.buttons, function(idx, buttonConf) {
            var buttonClass = buttonConf.className ? buttonConf.className : '';
            if (buttonClass.indexOf('btn-') === -1) {
                buttonClass += "btn-" + (idx === 0 ? 'primary' : 'default');
            }
            html += '<button type="button" class="btn '+buttonClass+'" data-callback="'+idx+'">'+buttonConf.text+'</button>';
        });
        html += '      </div>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // Modal should be put last to be able to be above everything else
        var $modal = $('body').append(html).children().last();
        var $buttons = $modal.find("button[data-callback]");

        // Enable modal mode, and add hidden event handler
        $modal.modal({ keyboard: false })
                .on('hidden.bs.modal', function (e) {
                    if (conf.onClose) conf.onClose($modal);
                    // When modal is hidden, remove all event handlers attached and remove from DOM
                    $buttons.off();
                    $modal.off().remove();
                }).on('keyup', function(e) {
                    if (e.keyCode == 13) {
                        // Hanle press ENTER
                        // Automatically click on submit if only one user button is defined
                        // Otherwise, do nothing, we don't know which one to prefer...
                        if ($buttons.length === 1) {
                            e.stopImmediatePropagation();
                            $buttons.click();
                        }
                    } else if (e.keyCode === 27) {
                        // Hanle press ESCAPE
                        // Close modal
                        e.stopImmediatePropagation();
                        $modal.modal('hide');
                    }
                });

        // Add buttons event handler
        $buttons.on('click', function (e) {
            var shouldHide = true;
            // Find and call callback
            var buttonIdx = $(this).attr('data-callback');
            if (conf.buttons[buttonIdx].onClick) shouldHide = conf.buttons[buttonIdx].onClick($modal);
            // Hide modal
            if (shouldHide !== false) {
                $modal.modal('hide');
            }
        });

        if (conf.onOpen) conf.onOpen($modal);
        return $modal;
    },

    hide: function() {
        if ($('.temporaryModal').length > 0) {
            $('.temporaryModal').modal('hide');
        }
    },

    showWithBuildLink: function(name, link) {
        if (!link.startsWith('http')) {
            link = 'https://ffbeEquip.com/'+link;
        }
        Modal.show({
            title: "Link to your " + name,
            body: "<p>This link will allow anyone to visualize your "+name+"</p>"+
                  '<div class="input-group">' +
                    '<span class="input-group-addon">🔗</span>' +
                    '<input class="form-control linkInput" type="text" value="'+link+'"/>' +
                  '</div>'+
                  '<p class="hidden linkInputCopied">Link copied to your clipboard.</p>',
            withCancelButton: false,
            size: 'large',
            onOpen: function($modal) {
                if (copyInputToClipboard($modal.find("input"))) {
                    $modal.find(".linkInputCopied").removeClass('hidden');
                }
            }
        });
    },

    showWithTextData: function(title, textData)
    {
        Modal.show({
            title: title,
            body: '<textarea class="form-control" rows="12">' + textData + '</textarea>'+
                  '<p class="hidden linkInputCopied">Link copied to your clipboard.</p>',
            withCancelButton: false,
            size: 'large',
            onOpen: function($modal) {
                if (copyInputToClipboard($modal.find("textarea"))) {
                    $modal.find(".linkInputCopied").removeClass('hidden');
                }
            }
        });
    },

    confirm: function(title, question, onAccept)
    {
        Modal.show({
            title: title,
            body: '<p>'+question+'</p>',
            withCancelButton: true,
            buttons: [{
                text: "Yes",
                className: "",
                onClick: onAccept
            }]
        });
    },

    showMessage: function(title, message, onClose)
    {
        Modal.show({
            title: title,
            body: '<p>'+message+'</p>',
            onClose: onClose,
            withCancelButton: false
        });
    },

    showError: function(text, error) {
        Modal.show({
            title: "Something went wrong, Kupo!",
            body: '<p>'+text+'</p>'+
                  '<pre class="error">'+error.toString()+'</pre>',
            withCancelButton: false
        });
        if (window.console && window.console.trace) {
            window.console.trace();
            window.console.error(error);
        }
    },

    showErrorGet: function(filename, errorThrown)
    {
        if (typeof errorThrown !== 'string') error = JSON.stringify(errorThrown);

        Modal.show({
            title: "I couldn't get the file, Kupo!",
            body: '<p>An error occured while trying to retrieve a file from the server.</p>'+
                  '<p><strong>Filename</strong>: '+filename+'</p>'+
                  '<pre class="error">'+errorThrown+'</pre>',
            withCancelButton: false
        });
        if (window.console && window.console.trace) {
            window.console.trace();
        }
    }
}
var localStorageAvailable = function(){
    var enabled = false;
    if (window.localStorage) {
        var test = "test";
        try {
            localStorage.setItem(test, test);
            enabled = test === localStorage.getItem(test);
            localStorage.removeItem(test);
        } catch(e) {
            enabled = false;
        }
    }
    return enabled;
}();
staticFileCache = {
    /*
     * staticFileCache.store
     * Convert data to string, compress and store in localStorage
     */
    store: function(filename, data) {
        if (!localStorageAvailable) return;

        try {
            // Convert to string if not already (may throw if bad data)
            if (typeof data !== 'string') {
                data = JSON.stringify(data);
            }
            // Compress string (*ToUTF16 is important, localStorage can only contain JS strings encoded in UTF16)
            var compressedData = LZString.compressToUTF16(data);
            // Save (may throw if storage full)
            localStorage.setItem(filename, compressedData);
            // Update savedFiles
            var savedFiles = JSON.parse(localStorage.getItem("savedFiles"));
            if (!savedFiles) savedFiles = {};
            savedFiles[filename] = compressedData.length;
            localStorage.setItem("savedFiles", JSON.stringify(savedFiles));
            // Log to console
            window.console && window.console.log("Stored "+filename+" (" + data.length + " bytes, ratio "+ (compressedData.length*100/data.length).toFixed(0) +"% )");
        } catch (error) {
            // Modal.showError("An error occured while trying to save data to your local storage.", error);
            window.console && window.console.warn("An error occured while trying to save the file "+filename+" to your local storage", error);
            // Failsafe: remove item in case of error (to free space if needed)
            try { localStorage.removeItem(filename); } catch(e){}
        }
    },

    /*
     * staticFileCache.retrieve
     * Read from localStorage, decompress, convert to JS
     */
    retrieve: function(filename) {
        if (!localStorageAvailable) return;

        var data = null;
        try {
            var dataString = localStorage.getItem(filename);
            if (dataString) {
                // Decompress string and parse
                data = JSON.parse(LZString.decompressFromUTF16(dataString));
                // Log to console
                window.console && window.console.log("Retrieved "+filename+" (" + dataString.length + " bytes)");
            }
        } catch (error) {
            window.console && window.console.warn("An error occured while trying to retrieve the file "+filename+" from your local storage", error);
            // Failsafe: remove item in case of error (to free space if needed)
            try { localStorage.removeItem(filename); } catch(e){}
        }
        return data;
    },

    /*
     * staticFileCache.clear
     * Clear a file or all files saved in localStorage
     */
    clear: function(filename = null) {
        if (!localStorageAvailable) return;

        var savedFiles, filenames;

        // Load save files list
        try {
            savedFiles = JSON.parse(localStorage.getItem("savedFiles"));
        } catch (error) {
            window.console && window.console.warn("An error occured while trying to load saved files list", error);
        }

        // Set saved files to default if not a plain object
        if (!$.isPlainObject(savedFiles)) savedFiles = {};

        try {
            // Establish list of files to remove
            if (typeof filename === 'string') {
                filenames = [filename];
            } else {
                filenames = Object.keys(savedFiles);
            }

            // Loop and remove
            for (i = 0; i < filenames.length; i++) {
                localStorage.removeItem(filenames[i]);
                delete savedFiles[filenames[i]];
            }
        } catch (error) {
            window.console && window.console.warn("An error occured while trying to remove the file(s) "+filenames+" from your local storage", error);
        }

        // Always update list of saved files
        localStorage.setItem("savedFiles", JSON.stringify(savedFiles));
    },

    /*
     * staticFileCache.checkDataVersion
     * Compare the version, server and language as stored in localStorage
     */
    checkDataVersion: function(version, server, language) {
        if (!localStorageAvailable) return false;

        try {
            var storedDataVersion = JSON.parse(localStorage.getItem("dataVersion"));
            if (storedDataVersion.version === version && storedDataVersion.server === server && storedDataVersion.language === language) {
                return true
            }
            window.console && window.console.warn("Data version differs from stored", version, server, language, storedDataVersion);
        } catch (e) { /* ignore exceptions */ }
        return false;
    },

    /*
     * staticFileCache.setDataVersion
     * Set the version, server and language to localStorage
     */
    setDataVersion: function(version, server, language) {
        if (!localStorageAvailable) return;

        try {
            localStorage.setItem("dataVersion", JSON.stringify({"version": version, "server": server, "language": language}));
            window.console && window.console.log("Storing data version", version, server, language);
        } catch (error) {
            window.console && window.console.warn("An error occured while trying to save current data version", error, version, server, language);
        }
    }
}
