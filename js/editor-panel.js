//  editor-panel.js

    var debugMode;

    var target;              // IMPORTANT //
    var textureSize;         // IMPORTANT //
    var editorHolder;        // IMPORTANT //
    var editorHolderButton;  // IMPORTANT //
//  var catalogHolderButton; // IMPORTANT //


//  Every dialoge panel point to a target object that can be 
//  mesh, geometry, face, vertex, object3d, material, texture
//  scene or whatever and deals with this target only.

    var editorPanelHtml = '<div id="editor-panel" title="Editor Panel">';
    var $EditorPanel = $(editorPanelHtml).dialog({ 
        autoOpen: false, 
        show: { effect: 'fade', duration: 500 },
        hide: { effect: 'fade', duration: 500 },
    });

    $EditorPanel.on( "dialogopen", function( event, ui ) {
        keyInputControls.Off();
        $EditorPanel.active = true;
        debugMode && console.log( "dialog opened:", $EditorPanel.active );
        debugMode && console.log( "editorHolderButton:", editorHolderButton );
        debugMode && console.log( "target:", !!target );
    });

    $EditorPanel.on( "dialogclose", function( event, ui ) {
        keyInputControls.On();
        $EditorPanel.active = false;
        $EditorPanel.contents().remove();
        target = undefined;
        textureSize = undefined;
        editorHolder = undefined;
        editorHolderButton = undefined;
    //  catalogHolderButton = undefined;
        debugMode && console.log( "dialog closed:", !$EditorPanel.active );
        debugMode && console.log( "editorHolderButton:", editorHolderButton );
        debugMode && console.log( "target:", target );
    });

//  Dialog load component function.
    $EditorPanel.loadComponent = function(component, option){
        var editorComponent = componentsFolder + component; 
        $EditorPanel.load(editorComponent, function(response, status, xhr){
            debugMode && console.log("editor component:", status);
            if ( !!option ) $EditorPanel.dialog( "option", option );
        });
    }

    $EditorPanel.loadScript = function(script, option){
        var editorScript = scriptsFolder + script; 
        $.getScript(editorScript, function(script, status, xhr){
            debugMode && console.log("editor script:", status);
            if ( !!option ) $EditorPanel.dialog( "option", option );
        });
    }

    $EditorPanel.loadMaterialPanel = function(title, size){

        if ( target instanceof THREE.MeshStandardMaterial ) {
            var standardMaterialPanelComponent = componentsFolder + "standard-material-panel.html";        
            $EditorPanel.load(standardMaterialPanelComponent, function(response, status, xhr){
                if (status == "error")   console.error( status, xhr.status, xhr.statusText );
                if (status == "success") debugMode && console.log("Standard Material Panel:", status);
                $EditorPanel.dialog( "option", {title: title + " (standard)"} );
            //  Settings.
                textureSize = size || 256;
            });
            return;
        }
    
        if ( target instanceof THREE.MeshLambertMaterial ) {
            var lambertMaterialPanelComponent = componentsFolder + "lambert-material-panel.html";        
            $EditorPanel.load(lambertMaterialPanelComponent, function(response, status, xhr){
                if (status == "error")   console.error( status, xhr.status, xhr.statusText );
                if (status == "success") debugMode && console.log("Lambert Material Panel:", status);
                $EditorPanel.dialog( "option", {title:  title + " (lambert)"} );
            //  Settings.
                textureSize = size || 256;
            });
            return;
        }

        if ( target instanceof THREE.MeshPhongMaterial ) {
            var phongMaterialPanelComponent = componentsFolder + "phong-material-panel.html";        
            $EditorPanel.load(phongMaterialPanelComponent, function(response, status, xhr){
                if (status == "error")   console.error( status, xhr.status, xhr.statusText );
                if (status == "success") debugMode && console.log("Phong Material Panel:", status);
                $EditorPanel.dialog( "option", {title:  title + " (phong)"} );
            //  Settings.
                textureSize = size || 256;
            });
            return;
        }

    };

//    width:    616,
//    minWidth: 616,
//    maxWidth: 616,
//    height:   600,
//    minHeight:600,
//    maxHeight:600
