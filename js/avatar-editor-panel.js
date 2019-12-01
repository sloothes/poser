//  avatar-editor-panel.js

    var debugMode;

    var target;       // IMPORTANT //
    var textureSize;  // IMPORTANT //

//  Every dialoge panel point to a target object that can be 
//  mesh, geometry, face, vertex, object3d, material, texture
//  or whatever and deals with this target only.

    var avatarEditorPanelHtml = '<div id="avatar-editor-panel" title="Avatar Editor">';
    var $AvatarEditorPanel = $(avatarEditorPanelHtml).dialog({ 
        autoOpen: false, 
        show: { effect: 'fade', duration: 500 },
        hide: { effect: 'fade', duration: 500 },
    });

    $AvatarEditorPanel.on( "dialogopen", function( event, ui ) {
        $AvatarEditorPanel.active = true;
        debugMode && console.log( "dialog opened:", $AvatarEditorPanel.active );
        debugMode && console.log( "target:", !!target );
    });

    $AvatarEditorPanel.on( "dialogclose", function( event, ui ) {
        $AvatarEditorPanel.active = false;
        $AvatarEditorPanel.contents().remove();
        target = undefined;
        debugMode && console.log( "dialog closed:", !$AvatarEditorPanel.active );
        debugMode && console.log( "target:", !!target );
    });

    $AvatarEditorPanel.loadMaterialPanel = function(title, size){

        if ( target instanceof THREE.MeshStandardMaterial ) {
            var standardMaterialPanelComponent = componentsFolder + "standard-material-panel.html";        
            $AvatarEditorPanel.load(standardMaterialPanelComponent, function(resoponse, status, xhr){
                if (status == "error")   console.error( status, xhr.status, xhr.statusText );
                if (status == "success") debugMode && console.log("Standard Material Panel:", status);
                $AvatarEditorPanel.dialog( "option", {title: title + " (standard)"} );
            //  Settings.
                textureSize = size || 256;
            });
            return;
        }
    
        if ( target instanceof THREE.MeshLambertMaterial ) {
            var lambertMaterialPanelComponent = componentsFolder + "lambert-material-panel.html";        
            $AvatarEditorPanel.load(lambertMaterialPanelComponent, function(resoponse, status, xhr){
                if (status == "error")   console.error( status, xhr.status, xhr.statusText );
                if (status == "success") debugMode && console.log("Lambert Material Panel:", status);
                $AvatarEditorPanel.dialog( "option", {title:  title + " (lambert)"} );
            //  Settings.
                textureSize = size || 256;
            });
            return;
        }

        if ( target instanceof THREE.MeshPhongMaterial ) {
            var phongMaterialPanelComponent = componentsFolder + "phong-material-panel.html";        
            $AvatarEditorPanel.load(phongMaterialPanelComponent, function(resoponse, status, xhr){
                if (status == "error")   console.error( status, xhr.status, xhr.statusText );
                if (status == "success") debugMode && console.log("Phong Material Panel:", status);
                $AvatarEditorPanel.dialog( "option", {title:  title + " (phong)"} );
            //  Settings.
                textureSize = size || 256;
            });
            return;
        }

    };

/*
    var dialogOption = {
        width:    616,
        minWidth: 616,
        maxWidth: 616,
        height:   600,
        minHeight:600,
        maxHeight:600
    };
*/
