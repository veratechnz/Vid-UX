//Home View Tool

function Tools(equip, canvasParentID){

    var scope = this;

    this.hideTool = false;
    this.hideToolList = [];
    this.selectTool = false;
    this.selectToolSelectedList = [];

    $('#reset-view-tool').click(function(){
        $(this).addClass('clicked');
        window.setTimeout(function(){
            $('#reset-view-tool').removeClass('clicked');
        }, 50);
        equip.resetView();
        equip.showAllNodes();
    });

    /*
    //Hot spot Tool
    $('#hot-spot-tool').click(function(){
        $(this).addClass('clicked');

        window.setTimeout(function(){
            $('#hot-spot-tool').removeClass('clicked');
        }, 50);
        for(var i = 0; i < topNodes[0].childNodes.length; i++){
            var node = topNodes[0].childNodes[i];
            placeDynamicLabel(node , node.nodeName);
        }       
    });
    */

    //Select Tool
    $('#select-tool').click(function(){

        if($(this).hasClass('clicked')){
            $(this).removeClass('clicked');
            scope.selectTool = false;
            scope.selectToolSelectedList = [];
            scope.removeScreenIndication();
        }else{selectTool = false;
            scope.removeScreenIndication()
            scope.hideTool = false;
            if($('#hide-tool').hasClass('clicked')){
              $('#hide-tool').removeClass('clicked')  
            }
            scope.selectTool = true;
            scope.selectToolSelectedList = [];
            var currentSelection = equip.getSelectedNodeIds();

            scope.selectToolSelectedList = (currentSelection);
            

            if(scope.selectToolSelectedList.length > 0){
                
                scope.activateMultiSelectContextMenu()
            }


            $(this).addClass('clicked');
            scope.addScreenIndication('select mode')
            //activate3DContextMenu();
        } 
    });

    //Hide tool
    $('#hide-tool').click(function(){
        if($(this).hasClass('clicked')){
            $(this).removeClass('clicked');

            //disable the hide tool
            scope.hideTool = false
            //Remove border around screen

            scope.removeScreenIndication();
            $('#canvas-parent').css('border', 'none');

            //remove the buttons
            $('#hide-mode-buttons').remove();


        }else{
            scope.removeScreenIndication();
            scope.selectTool = false;
            if($('#select-tool').hasClass('clicked')){
              $('#select-tool').removeClass('clicked')  
            }

            //activate hide mode
            scope.hideTool = true;
            //Activate the button
            $(this).addClass('clicked');
            //Add the indication and buttons:

            scope.addScreenIndication('hide mode');
           
            
        } 
    }); 


    //Zoom to tool
    $('#zoom-to-tool').click(function(){
        $(this).addClass('clicked');
        window.setTimeout(function(){
            $('#zoom-to-tool').removeClass('clicked');
        }, 50);
        //Zoom to selected:
        equip.zoomToSelected();            
        
        
    });

    //Views tool
    $('#default-views-tool').click(function(e){
        e.stopPropagation();
        $(this).addClass('clicked');
        window.setTimeout(function(){
            $('#default-views-tool').removeClass('clicked');
        }, 50);
        //TODO: Activate default views
        $('.default-views-menu').show();
        //oDvl.Renderer.ZoomTo(DvlEnums.DVLZOOMTO.VIEW_TOP, null, 1);
    });

    $('#view-top').click(function(e){
        e.stopPropagation();
        $(this).addClass('clicked');
        equip.activateDefaultView("top");
        window.setTimeout(function(){
            $('#view-top').removeClass('clicked');
            scope.removeDefaultViews();
        }, 50);
    });

    $('#view-left').click(function(e){
        e.stopPropagation();
        $(this).addClass('clicked');
        equip.activateDefaultView("left");
        window.setTimeout(function(){
            $('#view-left').removeClass('clicked');
            scope.removeDefaultViews();
        }, 50);
    }); 

    $('#view-right').click(function(e){
        e.stopPropagation();
        $(this).addClass('clicked');
        equip.activateDefaultView("right");
        window.setTimeout(function(){
            $('#view-right').removeClass('clicked');
            scope.removeDefaultViews();
        }, 50);
    }); 

    $('#view-bottom').click(function(e){
        e.stopPropagation();
        $(this).addClass('clicked');
        equip.activateDefaultView("bottom");
        window.setTimeout(function(){
            $('#view-bottom').removeClass('clicked');
            scope.removeDefaultViews();
        }, 50);
    }); 

    $('#view-back').click(function(e){
        e.stopPropagation();
        $(this).addClass('clicked');
        equip.activateDefaultView("back");
        window.setTimeout(function(){
            $('#view-back').removeClass('clicked');
            scope.removeDefaultViews();
        }, 50);
    });

    $('#view-front').click(function(e){
        e.stopPropagation();
        $(this).addClass('clicked');
        equip.activateDefaultView("front");
        window.setTimeout(function(){
            $('#view-front').removeClass('clicked');
            scope.removeDefaultViews();
        }, 50);
    });




    this.addScreenIndication = function(mode){



        var screenIndication = $('<div class="btn-group" id="screen-indication-buttons"><button id="undo-button" type="button" class="btn btn-default">Undo</button><button id="exit-button" type="button" class="btn btn-default">Exit</button></div>')
        var displayWidth = $('#' + canvasParentID).outerWidth();
        var displayOffset = $('#' + canvasParentID).offset();
        var buttonGroupWidth = $(screenIndication).outerWidth();
        var offSet = displayWidth/2 - buttonGroupWidth/2 + displayOffset.left;
        
        
        $('body').append(screenIndication);
        $(screenIndication).css({
                'position': 'absolute',
                'left' : offSet,
                'top' : '10px'
        });

        //Orange border around 3D window:
        $('#canvas-parent').css('border', '#F0AD4E solid 5px');

        //Hide mode button handlers:
        $(screenIndication).children('#undo-button').click(function(){
           
            
            if(mode == "hide mode"){
                
                var nodeID = scope.hideToolList[scope.hideToolList.length - 1];
                var node = equip.findNodeById(nodeID);
                equip.showNode(node);
                scope.hideToolList.pop();  
            }else if(mode == "select mode"){
                
                var nodeID = scope.selectToolSelectedList[selectToolSelectedList.length - 1];
                var node = equip.findNodeById(nodeID);
                equip.removeSelection(node);
                scope.selectToolSelectedList.pop();
            }

            

        })

         $(screenIndication).children('#exit-button').click(function(){
            scope.removeScreenIndication();           
        })
    }


    this.removeScreenIndication = function(){
        $('#hide-tool').removeClass('clicked');
        $('#select-tool').removeClass('clicked');
         //disable the mode

        scope.hideTool = false
        scope.selectTool = false
        //Remove border around screen
        $('#canvas-parent').css('border', 'none');

        //remove the buttons
        $('#screen-indication-buttons').remove();

        scope.removeMultiSelectContextMenu()
    }


    this.removeDefaultViews = function(){
        $('.default-views-menu').hide();
        
    }

    this.activateMultiSelectContextMenu = function(){  

      var container = $('<div id="multi-context-menu"></div>');
      $('body').append(container);
      $(container).load('./templates/context_3D_menu_template.html', function(){
        $(container).find('.triangle').hide();
        $(container).find('.context-3D-menu').css({
          'left' : '50%',
          'bottom' : '10%'
        })
        $(container).find("#context-3D-area span").text("Isolate Areas");
        $(container).find("#context-3D-section span").text("Isolate Sections");
        $(container).find("#context-3D-hide span").text("Hide Items");


        $(container).find("#context-3D-area").click(function(e){
          var nodes = [];
          for (var i = 0; i < scope.selectToolSelectedList.length; i++) {
            
            node = equip.findNodeById(scope.selectToolSelectedList[i]);
            nodes.push(node);
          };

          //Get the areas of selected nodes.
          var areas = []
          var original = true;
          for (var i = 0; i < nodes.length; i++) {
            var area = equip.findNodeById(nodes[i].parentNodes[nodes[i].parentNodes.length - 2])
            
            for(var j = 0; j < areas.length; j++){
              if(areas[j].id == area.id){
                original = false
              }else{
                original = true
              }
            }

            if (original){
              areas.push(area)
            }        
            
          };
          
          equip.isolateNodes(areas);

          scope.removeScreenIndication();


        })
        $(container).find("#context-3D-section").click(function(e){
          var nodes = [];
          for (var i = 0; i < scope.selectToolSelectedList.length; i++) {
            
            node = equip.findNodeById(scope.selectToolSelectedList[i]);
            nodes.push(node);
          };

          //Get the areas of selected nodes.
          var sections = []
          var original = true;
          for (var i = 0; i < nodes.length; i++) {
            var section = equip.findNodeById(nodes[i].parentNodes[nodes[i].parentNodes.length - 1])
            
            for(var j = 0; j < sections.length; j++){
              if(sections[j].id == section.id){
                original = false
              }else{
                original = true
              }
            }

            if (original){
              sections.push(section)
            }        
            
          };

          equip.isolateNodes(sections);

          scope.removeScreenIndication();


        })

      })


    }


    this.removeMultiSelectContextMenu = function(){
      
      $('#multi-context-menu').remove()

      

    }
 
}




