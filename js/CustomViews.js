 CustomViews = function(equip){

    var scope = this;

    //The following code loads the view state settings dialog box into the DOM

    var container = $('<div id="new-view-states-modal-container"></div>');
    $('body').append(container);

    $(container).load('./templates/new_custom_view_dialog_template.html', function(){
        //This is the click handler for the apply button:
       $("#new-view-state-submitt").click(function(){                
            
            //Call the set view state settins function whcih takes two args:
            //      1. isNew - bool - true if creating a new view state
            //      2. viewState - viewState Object - null if creating a new view state, otherwise this is the view state we are trying to edit
            //These variables are attached to the modal box itself

            scope.setViewStateSettings($(this).parents('#view-settings-form').data("newView"), $(this).parents('#view-settings-form').data("viewState"));
            
        }); 
    });

    $('#new-view-state-button').click(function(){
        //This button is clicked when creating a new view state
        $("#custom-view-dialog .modal-title").text("New Custom View");
        $("#new-view-state-submitt").text("Save View");

        //Show the view state dialog, and pass in data to create a NEW view stte
        $('#view-settings-form').data('newView', true);
        $('#view-settings-form').data('viewState', null);
        //Make sure the form values are blank
        $("#view-settings-title").val("");
        $("#view-settings-description").val("");
        //Show the modal (dialog)
        $('#view-settings-form').modal('show')

    })        

    this.setViewStateSettings = function(isNew, viewState){
        //This is the onclick handler for the new view states dialog OK button
        var viewStateSettings = {};

        viewStateSettings.title = $("#view-settings-title").val();
        viewStateSettings.description = $("#view-settings-description").val();    
        
           
        
        if(isNew){
            scope.createNewViewState(viewStateSettings);    
        }else{
            scope.commitEditViewStateSettings(viewState, viewStateSettings);
        }
        
        //endNewViewState();
         
        
    }

    this.commitEditViewStateSettings = function(viewState, viewStateSettings){
              
        //update the object
        viewState.setName(viewStateSettings.title);
        viewState.setDescription(viewStateSettings.description);
        //update the UI object
        
        $('#' + viewState.id).children('#area-title').html(viewStateSettings.title);
        console.log($('#' + viewState.id).children('#area-title'))
        
        scope.closeViewStateEditing(viewState)       
        



    }


    this.createNewViewState = function(settings){

        var visibility = {
            visibleNodes: equip.getVisibleNodes(),
            hiddenNodes: equip.getHiddenNodes()
        };

        var visibleNodePositions = equip.getNodePositions(visibility.visibleNodes);
        
        visibility.nodePositions = visibleNodePositions;
       

        var cam = equip.getCameraPosition();
        var img = scope.takeCanvasSnapshot();

        newViewState = new CustomViewState(cam, img, visibility, settings.title, settings.description);
        //scope.persistNewViewState(newViewState, "project");
        //scope.persistNewViewState(currentProject, newViewState);


        //persistNewViewState(newViewState)




        //Add UI components:
        var nodeElements = $('<li class="areas-list-item" id="' +newViewState.id + '"><img src="./img/Settings-Gear-Curve.png" class="cvs-settings-button"><img class="areas-list-img" src="'+img+'"><p id="area-title">' + newViewState.name + '</p></li>');
        $(nodeElements).data('viewState', newViewState);
        $(".custom-view-states-list-items").append(nodeElements);

        var itemWidth = $(nodeElements).width();
        var imageWidth = $(nodeElements).find('.areas-list-img').width();

        var offSet = itemWidth/2 - imageWidth/2;

        $(nodeElements).find('.areas-list-img').css('left', offSet + 'px');

        $(nodeElements).find('.areas-list-img').click(function(){ 
            // Activate the custom view state:
            viewState = $(nodeElements).data('viewState');
            //set the camera
            equip.setCameraPosition(viewState.cameraPosition, 1);                
            
            //Loop through and hide all nodes that should be hidden
            for(var i = 0; i < viewState.visibility.hiddenNodes.length; i++){
                equip.hideNode(viewState.visibility.hiddenNodes[i])
            }
            //Loop through and show all nodes that should be shown
            for(var i = 0; i < viewState.visibility.visibleNodes.length; i++){
                equip.showNode(viewState.visibility.visibleNodes[i]);
            }
            /*//Loop through visible nodes and set position:
            for (var i = 0; i < viewState.visibility.nodePositions.length; i++) {
                setNodePosition(viewState.visibility.nodePositions[i]);
            };*/

        });

        $(nodeElements).find('.cvs-settings-button').click(function(){
            //Change some of the modal wording:
            $("#new-view-state-submitt").text("Apply")
            $("#custom-view-dialog .modal-title").text("Edit View Details");

            var viewStates = $('.custom-view-states-list').find('.areas-list-item');

            for (var i = 0; i < viewStates.length; i++) {
                if($(viewStates[i]).hasClass('editing')){

                    //show the view state content
                    $(viewStates[i]).find('.areas-list-img').siblings().andSelf().slideDown(200);
                    //remove the editing buttons
                    $(viewStates[i]).find('#edit-view-settings-button-container').remove();
                    //remove the close icon
                    $(viewStates[i]).find('#edit-view-close-button').remove();
                    //remove the editing class
                    $(viewStates[i]).removeClass('editing');

                }
            };


            
            //Add a class to the view state to inicate that it is being edited:

            $(this).parent().addClass('editing');


            //When you click the settings button... show some editing options buttons, and pass in the current view state

            //Current view state is:
            var that = this;
            var viewState = $(this).parent().data('viewState');
            

            //Buttons:
            var buttons = $('<div id="edit-view-settings-button-container"><button id="edit-view-settings-button" type="button" class="btn btn-default edit-view-settings-button">Edit Details</button>' + 
                '<button id="change-view-button" type="button" class="btn btn-warning edit-view-settings-button">Change View</button>' +
                '<button id="delete-view-state-button" type="button" class="btn btn-danger edit-view-settings-button">Delete</button></div>' + 
                '<button type="button" id="edit-view-close-button" class="close">x</button>');
            
            //$(buttons).find('#edit-view-settings-button').data('viewState', viewState);
            $(buttons).find('#edit-view-settings-button').click(function(){
                var viewState = $(this).parents('.areas-list-item').data('viewState');
               
                //Show the view state settings dialog with the right things attached:
                $('#view-settings-form').data('newView', false);
                $('#view-settings-form').data('viewState', viewState);
                $('#view-settings-form').modal('show')
                
                $('#view-settings-title').val(viewState.name);
                $('#view-settings-description').val(viewState.description)
            })

            $(buttons).siblings('#edit-view-close-button').click(function(){
                
                
                $(that).siblings().andSelf().slideDown(200);
                $('#edit-view-settings-button-container').remove();
                $(this).remove();
            })

            $(buttons).find('#delete-view-state-button').click(function(){
                var viewState = $(this).parents('.areas-list-item').data('viewState');
                console.log(viewState);
                scope.deleteViewStateFromDB(currentProject, viewState.id)
                $(that).parent().remove();
                $(this).parent().siblings('#edit-view-close-button').remove()
                $(that).siblings().andSelf().slideDown(200);
                $(this).siblings().andSelf().remove();
            })

            //$(buttons).find('#change-view-button').data('viewState', viewState);
            $(buttons).find('#change-view-button').click(function(){
                var viewState = $(this).parents('.areas-list-item').data('viewState');
                scope.editViewStateCamera(viewState);
                scope.closeViewStateEditing(viewState);

                /*
                $(this).parent().siblings('#edit-view-close-button').remove();
                $(that).siblings().andSelf().slideDown(200);
                $(this).siblings().andSelf().remove();

                $('#' + viewState.id).find('.areas-list-img').css('border', '3px solid #F0AD4E');     


                var screenIndication = $('<div class="btn-group" id="change-view-buttons"><button id="save-new-view-button" type="button" class="btn btn-warning">Save View</button><button id="exit-button" type="button" class="btn btn-default">Cancel</button></div>')
                var displayWidth = $('#canvas-parent').outerWidth();
                var displayOffset = $('#canvas-parent').offset();
                var buttonGroupWidth = $(screenIndication).outerWidth();
                var offSet = displayWidth/2 - buttonGroupWidth/2 + displayOffset.left;

                
                $(screenIndication).css({
                    'position': 'absolute',
                    'left' : offSet,
                    'top' : '10px'
                });

                $('#canvas-parent').css('border', '5px solid #F0AD4E');
                
                $('body').append(screenIndication);
                $(screenIndication).data('viewState', viewState);

                $(screenIndication).children('#save-new-view-button').click(function(){
                    
                    var viewState = $(this).parent().data('viewState');
                    
                    editViewStateCamera(viewState);
                    $(this).parent().remove();
                    $('#edit-view-settings-button-container').remove();
                    $('#canvas-parent').css('border', 'none');


                })

                $(screenIndication).children('#exit-button').click(function(){
                    var viewState = $(this).parent().data('viewState');
                    $(this).parent().remove();
                    $('#edit-view-settings-button-container').remove();
                    $('#canvas-parent').css('border', 'none');
                    
                    console.log(viewState)
                    $("#" + viewState.id).children('.areas-list-img').css('border', '1px white solid')


                })
                */
            });
            
            $(this).siblings().andSelf().slideUp(200)
            $(this).parent().append(buttons);                
          
        });
    }

    this.closeViewStateEditing = function(viewState){
        //close the editing settings - bring back the view state
        $('#' + viewState.id).children().slideDown(200);
        $('#' + viewState.id).find('#edit-view-settings-button-container').remove(); 
        $('#' + viewState.id).find('#edit-view-close-button').remove() 

    }


    this.takeCanvasSnapshot = function(){

        /******

        To create screenshot of current canvas, get a reference to canvas, then use toDataURL():

        *******/
        var canvas = document.getElementById('canvas');
        //Pause rendering
        equip.oDvl.Helpers.SetRenderLoop(false);
        //Force jDVL to render the next frame
        equip.oDvl.Helpers.Refresh(equip.oDvl.Settings.RendererToken, true);
        //Take the snapshot
        var dataURL = canvas.toDataURL("image/png");   
        //window.open(dataURL);
        //Return to normal rendering         
        equip.oDvl.Helpers.SetRenderLoop(true);

        /******

        We want to crop the snapshot to a 4x3 resolution, containing the full height, and cropping off the sides to suit,
        To do this, we will create a new temporary canvas (not actually visible), draw the whole image onto the canvas
        then create a second temporary canvas, and draw the relevant pixels from the first.

        Lastly, call toDataURL on the second canvas---- this is our image!

        ********/

        var tempCanvas = document.createElement('canvas');
        var ctx = tempCanvas.getContext('2d');
        var tempCanvas2 = document.createElement('canvas');            
        var ctx2 = tempCanvas2.getContext('2d');
        var image = new Image();

        //Image to render on first canvas = snapshot image from above
        image.src = dataURL;

        var imageData;

        if(image.complete){
            //You have to set the canvas width & height to match the image
            imageWidth = image.naturalWidth;
            imageHeight = image.naturalHeight;
            ctx.canvas.width = imageWidth;
            ctx.canvas.height = imageHeight;
            //now draw the image onto first canvas
            ctx.drawImage(image, 0,0);

            //Crop image dimensions
            var cropWidth = 1.33 * imageHeight;
            var startX = (imageWidth - cropWidth)/2;
            //Set dimensions of 2nd canvas
            ctx2.canvas.width = cropWidth;
            ctx2.canvas.height = imageHeight;
            //Select cropped pixels of 1st canvas:
            imageData = ctx.getImageData(startX,0,cropWidth, imageHeight);
            //Draw croped pixels onto 2nd canvas
            ctx2.putImageData(imageData, 0, 0);
            ctx2.scale(0.125, 0.125)
            //Save contents of sencond canvas
            var newImage = tempCanvas2.toDataURL("image/png");

            window.open(newImage)

            return newImage;
            //$('#trial-image').attr('src', newImage);
        }else{
            
        }   
        

    }

    this.editViewStateCamera = function(viewState){
        // get new camera position and snapshot
        
        var cam = equip.getCameraPosition();
        
        var visibility = {
            visibleNodes: equip.getVisibleNodes(),
            hiddenNodes: equip.getHiddenNodes()
        };
        var img = scope.takeCanvasSnapshot();
        //change the image of editing view state:            
        $("#" + viewState.id).children('.areas-list-img').attr('src', img);
        $("#" + viewState.id).children('.areas-list-img').css('border', '1px white solid')
        console.log($("#" + viewState.id))

        //change the object image data and camera position:
        
        viewState.cameraPosition = cam;
        viewState.visibility = visibility;

    }



    this.persistNewViewState = function(project, viewState){
        

        data.saveCustomView(project, viewState, function(results){
            //console.log(results)
        })
    }

    this.deleteViewStateFromDB = function(project, viewStateID){
        //console.log(project,viewStateID)
        data.deleteCustomView(project, viewStateID, function(results){
            console.log(results)
        })
    }


    this.retrieveViewStates = function(project){


        db.projects.find({});

    }

    function CustomViewState(cameraPosition, imageData, visibility, title, description){
        this.cameraPosition = cameraPosition;
        this.visibility = visibility;
        this.imageData = imageData;
        this.name = title;
        this.id = makeid(7);
        this.description = description;
        this.flyTo = 1;
        that = this;

        this.setName = function(name){
            this.name = name;
        }

        this.setDescription = function(description){
            this.description = description;
        }   

    }


    function makeid(length)
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


 }
