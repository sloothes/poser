//  AW3D KeyInputControls.js

/*!
 * @author anywhere3d
 * http://anywhere3d.org
 * MIT License
 */

    var controlsChannel;

    var keyInputControls = new MW.KeyInputControl();

    keyInputControls.On = function(){
        if ( !keyInputControls.isOff ) return;
        $(keyInputControls).on( "movekeyon", onMoveKeyOn );
        $(keyInputControls).on( "movekeyoff", onMoveKeyOff );
        $(keyInputControls).on( "jumpkeypress", onJumpInput );
        $(keyInputControls).on( "movekeychange", onMoveKeyChange );
        keyInputControls.isOff = false;
        debugMode && console.log( "keyInputControls are ON." );
    };

    keyInputControls.Off = function(){
        if ( keyInputControls.isOff ) return;
        $(keyInputControls).off( "movekeyon", onMoveKeyOn );
        $(keyInputControls).off( "movekeyoff", onMoveKeyOff );
        $(keyInputControls).off( "jumpkeypress", onJumpInput );
        $(keyInputControls).off( "movekeychange", onMoveKeyChange );
        keyInputControls.isOff = true;
        debugMode && console.log( "keyInputControls are OFF." );
    };

    keyInputControls.update = function(){
        if ( keyInputControls.isOff ) return;
        if ( keyInputControls.isMoveKeyHolded 
          || localPlayer.controller.isJumping 
          || !localPlayer.controller.isGrounded 
          || localPlayer.controller.isOnSlope ){

        //  debugMode && console.log( this.isMoveKeyHolded );
        //  keyInputControls.js sent socket messages at direction change.

            this.dispatchEvent({type:"update"}); // IMPORTANT //

        //  Send move player message to server when position is updating.
        //  Send move player message when any move key is pressed.
            if ( !!controlsChannel ) controlsChannel.publish({ 
                playerid : socket.id,
                direction: localPlayer.outfit.direction.rotation.y,
                position : localPlayer.outfit.direction.position.toArray(),
            });

        }
    };

    function onMoveKeyOn() { 

        if ( !!AnimationPanelControls ) {
            AnimationPanelControls.isActive = false; // IMPORTANT //
        }

        if (  localPlayer.controller.isJumping 
          || !localPlayer.controller.isGrounded 
          ||  localPlayer.controller.isOnSlope ) {
            return;
        }

    //  Update player controller direction.
        localPlayer.controller.direction = (2 * Math.PI) - cameraControls.getFrontAngle() + this.frontAngle; // "this": "keyInputControls" //

        localPlayer.outfit.AnimationsHandler.stop();
        localPlayer.controller.isRunning = true; 
        localPlayer.controller.isWalking = true;
        localPlayer.controller.movementSpeed = 28;
        localPlayer.outfit.AnimationsHandler.play("walk");
    //  localPlayer.outfit.update(); // duplicate: becomes once at every frame by the main update() function.

    //  Send move player mesasge to server.
        if ( !!controlsChannel ) controlsChannel.publish({ 
            playerid : socket.id,
            direction: localPlayer.outfit.direction.rotation.y,
            position : localPlayer.outfit.direction.position.toArray(),
            action   : "walk",
        });

    }
    
    function onMoveKeyChange() {

    //  Update player controller direction.
        localPlayer.controller.direction = (2 * Math.PI) - cameraControls.getFrontAngle() + this.frontAngle;// "this": "keyInputControls" //

    //  BE CAREFULL: this is duplicate localPlayer.outfit.update() in main update() function.
    //  outfit.oupdate() becomes once at every frame by the main update() function and we can
    //  use it at every outfit.update() we need.

    //  keyInputControls.js sent socket messages at direction change.
    //  Send move player mesasge to server when direction key change.
    
    //  Because we sent position and direction in keyInputControls.update
    //  when the key is pressed we do not need to send a remote message here.

    }

    function onMoveKeyOff() {

        if (  localPlayer.controller.isJumping 
          || !localPlayer.controller.isGrounded 
          ||  localPlayer.controller.isOnSlope ) {
            return;
        }

    //  Update player controller direction.
        localPlayer.controller.direction = (2*Math.PI) - cameraControls.getFrontAngle() + this.frontAngle;// "this": "keyInputControls" //
        localPlayer.outfit.AnimationsHandler.stop();
        localPlayer.controller.isRunning = false;
        localPlayer.controller.isWalking = false;
        localPlayer.controller.isIdling  = true;
        localPlayer.controller.movementSpeed = 0;
        localPlayer.outfit.AnimationsHandler.play("idle");
    //  localPlayer.outfit.update(); // duplicate: becomes once at every frame by the main update() function.
        localPlayer.controller.dispatchEvent({type:"startIdling"});

    //  Send move player mesasge to server.
        if ( !!controlsChannel ) controlsChannel.publish({ 
            playerid : socket.id,
            direction: localPlayer.outfit.direction.rotation.y,
            position : localPlayer.outfit.direction.position.toArray(),
            action   : "idle",
        });

    }

    function onJumpInput() {

        if (  localPlayer.controller.isJumping 
          || !localPlayer.controller.isGrounded 
          ||  localPlayer.controller.isOnSlope ) {
            return;
        }

    //  Send startJumping message to server.
        if ( !!controlsChannel ) controlsChannel.publish({
            playerid : socket.id,
            action   : "jump",
        });

        localPlayer.controller.jump();
        localPlayer.outfit.AnimationsHandler.jump();

    }

    keyInputControls.Off();
//  keyInputControls.On();







//  ------------ DEPRECATED ------------  //

    function keyInputControlsOff() {
        console.warn("!!!DEPRECATED!!!", 
            "'keyInputControlsOff()' is deprecated.", 
            "Use 'new keyInputControls.Off()' instead."
        );
        keyInputControls.Off();
    }

//  ------------ DEPRECATED ------------  //

    function keyInputControlsOn() {
        console.warn("!!!DEPRECATED!!!", 
            "'keyInputControlsOn()' is deprecated.", 
            "Use 'new keyInputControls.On()' instead."
        );
        keyInputControls.On();
    }

//  -----------------------------------  //









//  Controls Channel.js

/*!
 * @author anywhere3d
 * http://anywhere3d.org
 * MIT License
 */

//  Controls Channel.
/*
    controlsChannel = socket.subscribe( "controls", {
    //  waitForAuth: true,
    //  data: somedata,
        batch:true
    });

//  On subscribe success.
    controlsChannel.on("subscribe", function (name) {
        console.log("Subscribed to", name, "channel.");

    //  On Subscribe error.
        this.on("subscribeFail", function (err) {
            console.log("Failed to subscribe to the controls channel due to error:", err);
        });

    //  On unsubscribe.
        this.on("unsubscribe", function (name) {
            console.log("Unsubscribed from chat channel:", name);
        });

    //  On watch channel.
        this.watch( function (data) {

        //  debugMode && console.log( data.playerid );

            if ( data.playerid == socket.id ) return;

            //    data:
            //        data.playerid  = socket.id;
            //        data.direction = localPlayer.outfit.direction.rotation.y;
            //        data.position  = localPlayer.outfit.direction.position.toArray();
            //        data.action    = "action";

            if ( !RemotePlayersManager[ data.playerid ] ) return;

            var remotePlayer = RemotePlayersManager[ data.playerid ];

            if ( data.direction != undefined ) remotePlayer.outfit.direction.rotation.y = data.direction;
            if ( data.position  != undefined ) remotePlayer.outfit.direction.position.fromArray( data.position );
            if ( data.action    != undefined ) {
                remotePlayer.outfit.AnimationsHandler.stop();
                remotePlayer.outfit.AnimationsHandler.play( data.action );
            }
        });

    });
*/

/*
//  On Subscribe error.
    controlsChannel.on("subscribeFail", function (err) {
        console.log("Failed to subscribe to the controls channel due to error:", err);
    });

//  On unsubscribe.
    controlsChannel.on("unsubscribe", function (name) {
        console.log("Unsubscribed from chat channel:", name);
    });

//  On watch channel.
    controlsChannel.watch( function (data) {
        
    //  debugMode && console.log( data.playerid );
        
        if ( data.playerid == socket.id ) return;
        
        //    data:
        //        data.playerid  = socket.id;
        //        data.direction = localPlayer.outfit.direction.rotation.y;
        //        data.position  = localPlayer.outfit.direction.position.toArray();
        //        data.action    = "action";

        if ( !RemotePlayersManager[ data.playerid ] ) return;

        var remotePlayer = RemotePlayersManager[ data.playerid ];
        
        if ( data.direction != undefined ) remotePlayer.outfit.direction.rotation.y = data.direction;
        if ( data.position  != undefined ) remotePlayer.outfit.direction.position.fromArray( data.position );
        if ( data.action    != undefined ) {
            remotePlayer.outfit.AnimationsHandler.stop();
            remotePlayer.outfit.AnimationsHandler.play( data.action );
        }
    });
*/
