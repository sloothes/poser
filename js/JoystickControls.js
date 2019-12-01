//  JoystickControls.js


//  MW Joystick Controls.

    var joystick1Selector  = "#joystick1";
    var joystick2Selector  = "#joystick2";
    var jumpButtonSelector = "#jumpButton";
    var joystickControlsSelector  = ".joystick-controls";
    var joystickControls1Selector = "#joystick-controls-1";
    var joystickControls2Selector = "#joystick-controls-2";
    var buttonSvgSrc = [
      '<svg width="48" height="48" viewBox="0 0 64 64">',
        '<path fill="#fff" d="M44.5,54.5c-0.3-5.1-2.4-9.4-5.7-13.2C41,36,40.9,30,38.5,24.7c-1.2-2.7-3.9-4.4-6.9-3.3c-0.2,0.1-0.4,0.1-0.5,0.2c-3-4.3-6.6-8.3-10.1-11.8c-2.6-2.6-6.4,1.7-3.8,4.3c3.9,3.9,8.1,8.5,11,13.7c0,0.1,0.1,0.3,0.2,0.4c1.5,3.2,1.9,6.4,0.2,9.6c-0.3,0.5-0.4,1-0.5,1.5c-1.1,1.5-2.3,3-3.6,4.4c-0.8-2.3-1.4-4.7-1.6-7.1c-0.5-4.6-7.7-4.1-7.2,0.5c0.5,4.9,2.1,9.6,3.9,14.2c0.8,1.9,3.6,3.4,5.4,1.8c2.8-2.4,5.3-4.9,7.5-7.8c0.2,0.1,0.5,0.1,0.7,0.1c0.1,0.3,0.3,0.5,0.5,0.7c1.7,1.8,2.8,3.9,3.3,6.3c-2.2,0.8-4.6,1.4-7,1.4c-4.6,0.1-4.1,7.2,0.5,7.2c4-0.1,7.9-1.3,11.6-3C43.6,57.5,44.6,56.2,44.5,54.5z M34.2,8.9c0.7,0.1,1.6-0.1,2.3,0.3c1.5,0.8,2.6,2.1,3.2,3.6c0.2-2.2,0.5-4.3,0.8-6.5c0.5-3.7-5.1-4.7-5.7-1.1C34.6,6.3,34.3,7.8,34.2,8.9z"/>',
        '<circle fill="#fff" cx="33.8" cy="15.2" r="4.9"/>',
      '</svg>'
    ].join('');

    var joystick1  = new virtualInput.Joystick( $( joystickControls1Selector ), 120, { id: "joystick1" } );
    var joystick2  = new virtualInput.Joystick( $( joystickControls2Selector ), 120, { id: "joystick2" } );
    var jumpButton = new virtualInput.Button( $( joystickControls1Selector ),    70, { id: "jumpButton", label: "<b>JUMP</b>" } ); // buttonSvgSrc

    joystick1.addEventListener( "active", function () { 
        try { AnimationPanelControls.isActive = false; } catch(err){;}  // IMPORTANT //

        if (  localPlayer.controller.isJumping 
          || !localPlayer.controller.isGrounded 
          ||  localPlayer.controller.isOnSlope ) {
            return;
        }

        localPlayer.controller.direction = (3 * Math.PI/2) - cameraControls.getFrontAngle() + this.angle; // IMPORTANT //

        localPlayer.outfit.AnimationsHandler.stop();
        localPlayer.controller.isRunning = true; 
        localPlayer.controller.isWalking = true;  // ??? "false" cause bug in production server ??? //
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
    });

    joystick1.addEventListener( "disactive", function () { 

        if (  localPlayer.controller.isJumping 
          || !localPlayer.controller.isGrounded 
          ||  localPlayer.controller.isOnSlope ) {
            return;
        }

    //  localPlayer.controller.direction = (3 * Math.PI/2) - cameraControls.getFrontAngle(); // Not needed

        localPlayer.outfit.AnimationsHandler.stop();
        localPlayer.controller.isRunning = false;
        localPlayer.controller.isWalking = false;
    //  localPlayer.controller.isIdling  = true;
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
    });

    joystick1.update = function(){

        if ( this.isActive ) {

            localPlayer.controller.direction = (3 * Math.PI/2) - cameraControls.getFrontAngle() + this.angle; // 3*Math.PI/2 == THREE.Math.degToRad( 360 - 90 ).

        //  Update direction controls panel.
        //  try { $(turnCtrlOutputSelector).val( parseInt( THREE.Math.radToDeg( localPlayer.controller.direction ) ) ); } catch(err){;}

        //  BE CAREFULL: this is duplicate localPlayer.outfit.update() in main update() function.
        //  outfit.oupdate() becomes once at every frame by the main update() function and we can
        //  use it at every outfit.update() we need.

            this.dispatchEvent({type:"update"}); // IMPORTANT //

        //  Send move player message to server when position is updating.
            if ( !!controlsChannel ) controlsChannel.publish({ 
                playerid : socket.id,
                direction: localPlayer.outfit.direction.rotation.y,
                position : localPlayer.outfit.direction.position.toArray(),
            });

        }
    };

    joystick2.update = function(){

        if ( this.isActive ) {

            cameraControls.setLatLon(
                cameraControls.lat + this.position.y * 0.5, // deg.
                cameraControls.lon - this.position.x        // deg.
            );

            this.dispatchEvent({type:"update"}); // IMPORTANT //
        }
    }

    jumpButton.addEventListener( "press", function () { 

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
    });































