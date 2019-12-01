//  jquery-update-engine.js

    var debugMode;

//  jQuery updating.
//  Every object that needs update has a coresponding "update dom element".
//  When the "update dom element" has class "update", it trigger the object 
//  "update" function. $(".update").update();

    var bodySelector = "body";
    var updatesSelector = "#updates";
    $(bodySelector).append('<div class="hidden" id="updates"></div>');

    $(updatesSelector).append('<input type="hidden" id="localPlayerOutfit">');
    $(updatesSelector).append('<input type="hidden" id="world">');
    $(updatesSelector).append('<input type="hidden" id="cameraControls">');
    $(updatesSelector).append('<input type="hidden" id="keyInputControls">');
    $(updatesSelector).append('<input type="hidden" id="joystick1Contols">');
    $(updatesSelector).append('<input type="hidden" id="joystick2Contols">');
//  $(updatesSelector).append('<input type="hidden" id="AnimationPanelControls">');
    $(updatesSelector).append('<input type="hidden" id="ThreeAnimationHandler">');

    var localPlayerOutfitSelector = "#localPlayerOutfit";
    var worldSelector = "#world";
    var cameraControlsSelector = "#cameraControls";
    var keyInputControlsSelector = "#keyInputControls";
    var joystick1ContolsSelector  = "#joystick1Contols";
    var joystick2ContolsSelector = "#joystick2Contols";
    var AnimationPanelControlsSelector = "#AnimationPanelControls";
    var ThreeAnimationHandlerSelector = "#ThreeAnimationHandler";

    var $outfitUpdater = $(localPlayerOutfitSelector)[0];
    var $worldUpdater = $(worldSelector)[0];
    var $cameraUpdater = $(cameraControlsSelector)[0];
    var $keyInputUpdater = $(keyInputControlsSelector)[0];
    var $controlsJoystickUpdater = $(joystick1ContolsSelector)[0];
    var $cameraJoystickUpdater = $(joystick2ContolsSelector)[0];
//  var $actionsPanelUpdater = $(AnimationPanelControlsSelector)[0];
    var $animationHandlerUpdater = $(ThreeAnimationHandlerSelector)[0];

    $outfitUpdater.update = function(delta){ localPlayer.outfit.update(); };
    $worldUpdater.update = function(delta){ world.step( delta ); };
    $cameraUpdater.update = function(delta){ cameraControls.update(); };
    $keyInputUpdater.update = function(delta){ keyInputControls.update(); };
    $controlsJoystickUpdater.update = function(delta){ joystick1.update(); };
    $cameraJoystickUpdater.update = function(delta){ joystick2.update(); };
//  $actionsPanelUpdater.update = function(delta){ AnimationPanelControls.update(); };
    $animationHandlerUpdater.update = function(delta){ THREE.AnimationHandler.update( delta ); };

    $(localPlayerOutfitSelector).toggleClass("update");
    $(worldSelector).toggleClass("update");
    $(cameraControlsSelector).toggleClass("update");
    $(keyInputControlsSelector).toggleClass("update");
    $(joystick1ContolsSelector).toggleClass("update");
    $(joystick2ContolsSelector).toggleClass("update");
//  $(AnimationPanelControlsSelector).toggleClass("update");
    $(ThreeAnimationHandlerSelector).toggleClass("update");

    keyInputControls.On(); // IMPORTANT //

//  jQuery updating.
//  Every object that needs update has a coresponding "update dom element".
//  When the "update dom element" has class "update", it trigger the object 
//  "update" function. $(".update").update();

    function update() {

        var delta = clock.getDelta();
        var time = clock.getElapsedTime();

        var $update = $(".update");
        if ( $update.length > 0 ) {
            for ( var i = 0; i < $update.length; i++ ){
                if ( !!$update[i].update ) $update[i].update(delta);
            }
        }

    //  Prevent player underground.
        if (localPlayer.controller.center.y < 0) {
            debugMode && console.log( "controller.center.y overflow:", localPlayer.controller.center.y );
            localPlayer.controller.center.set(0, 1, 0); 
        }

    }
