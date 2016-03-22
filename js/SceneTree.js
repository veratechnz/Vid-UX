function SceneTree(equip, containerID){

    var scope = this;

    this.levels = {level_1 : '#363636',
                level_2 : '#4d4d4d',
                level_3 : '#666666',
                level_4 : '#808080'};

    this.addNodeToSceneTree = function(node){
            
        var nodeElements = $('<li class="scene-tree-cell" id="' + node.id +'"><div class="scene-tree-name-container"><img class="expander" src="./img/Plus-White.png"><p>' + node.nodeName +'</p><img class="expander-triangle .hidden" src="./img/Expanded-Triangle.png"></div><img src="./img/Show.png" class="hide-node-icon"></li>');
        $(".scene-tree-accordion").append(nodeElements);
        $(nodeElements).find(".expander-triangle").hide();
        $(nodeElements).data('node', node);
        
        $(nodeElements).find('.expander').click(function(e){
            //Clicking on expander icon expand/collapses the node
            e.stopPropagation()
            scope.selectFromSceneTree(node);
            scope.expandToggleNode(nodeElements)
        });

        $(nodeElements).find('.scene-tree-name-container').click(function(){
            equip.clearSelectedNodes();
            scope.clearSceneTreeSelected();
            equip.selectNode(node);
            $(this).parent().addClass('selected-cell');
        })

        $(nodeElements).contextmenu(function(e){
            var node = $(this).data('node');
            scope.showSceneTreeContextMenu(e, node);

        })

        var element = document.getElementById(node.id)
        var itemHammer = new Hammer(element);

        itemHammer.on('swipe', function(ev){
            if(ev.deltaX > 0){
                console.log(node.nodeName);

                scope.showContextSwipeMenu(node);    
            }
            
        })

        $(nodeElements).find(".hide-node-icon").click(function(e){
            
            var node = $(this).parent().data('node');

            equip.toggleNodeAndChildrenVisibility(node);
            

        });
    }

    this.visibilityChanged = function(node){

        if(equip.checkNodeVisibility(node)){
            //node is visible, so show the visible icon and change text to normal
            $('#' + node.id).find(".hide-node-icon").attr('src', './img/Show.png')
            $('#' + node.id).find(".hide-node-icon").parent().css({
                'font-style' : 'normal'                    
            });
        }else{
            //node is not visible so show the hidden icon, and change text to italic
            $('#' + node.id).find(".hide-node-icon").attr('src', './img/Hide.png')
            $('#' + node.id).find(".hide-node-icon").parent().css({
                'font-style' : 'italic'                    
            });
        }

        
    }

    this.addSubNodesToSceneTree = function(subnode, parentID, level){

                    
        var nodeElements = $('<li class="scene-tree-cell-sub" id="' + subnode.id +'"data-node="' + subnode + '"><div class="scene-tree-name-container"><img class="expander" src="./img/Plus-White.png"><p>' + subnode.nodeName +'</p><img class="expander-triangle .hidden" src="./img/Expanded-Triangle.png"></div><img src="./img/Show.png" class="hide-node-icon"></li>');
        $(nodeElements).data('node', subnode);
        $(nodeElements).insertAfter("#" + parentID);
        //$(nodeElements).addClass("-hidden");
        $(nodeElements).hide();
        $(nodeElements).find(".expander-triangle").hide();
        $(nodeElements).find(".expander-triangle").addClass('expander-triangle-sub');
        

        switch(level){
            case 1:
                $(nodeElements).find(".expander-triangle").attr("src", "./img/Expanded-Triangle-Level-1.png");
                break;
            case 2:
                $(nodeElements).find(".expander-triangle").attr("src", "./img/Expanded-Triangle-Level-2.png");
                $(nodeElements).css("background-color", scope.levels.level_2);
                $(nodeElements).find("p").css("left", "60px")
                break;
            case 3:
                $(nodeElements).find(".expander-triangle").attr("src", "./img/Expanded-Triangle-Level-3.png");
                $(nodeElements).css("background-color", scope.levels.level_3);
                break;
            case 4:
                $(nodeElements).find(".expander-triangle").attr("src", "./img/Expanded-Triangle-Level-4.png");
                $(nodeElements).css("background-color", scope.levels.level_4);
                break;
        }

        
        $(nodeElements).find(".hide-node-icon").click(function(){
            var node = $(this).parent().data('node');

            equip.toggleNodeAndChildrenVisibility(node);
            

        });

        $(nodeElements).find('.scene-tree-name-container').click(function(){
            equip.clearSelectedNodes();
            scope.clearSceneTreeSelected();
            equip.selectNode(subnode);
            $(this).parent().addClass('selected-cell');
        })

        $(nodeElements).find('.expander').click(function(e){
            //Clicking on expander icon expand/collapses the node
            e.stopPropagation()
            scope.selectFromSceneTree(subnode);
            scope.expandToggleNode(nodeElements)
        });

        $(nodeElements).contextmenu(function(e){
            var node = $(this).data('node');
            scope.showSceneTreeSubContextMenu(e, node);

        })

        if(subnode.childNodes.length > 0){
            
        }else{
            //No child nodes, so remove expander icon
            $(nodeElements).find(".expander").hide();       
        }

        var element = document.getElementById(subnode.id)
        var itemHammer = new Hammer(element);

        itemHammer.on('swipe', function(ev){
            if(ev.deltaX > 0){
              
                scope.showContextSwipeMenu(subnode);    
            }
            
        })
        
    }

    this.traverseTree = function(){
        var a = $(".scene-tree-accordion").find(".scene-tree-cell");      

        var hasChildren = [];

        var level = 1;
        for (i = 0; i < a.length; i++){
            var parentNode = $(a[i]).data().node;                
            for (j = 0; j < parentNode.childNodes.length; j++){
                scope.addSubNodesToSceneTree(parentNode.childNodes[j], a[i].id, level);
                var childNode = parentNode.childNodes[j];
                //console.log(childNode);

                if(childNode.childNodes.length > 0){
                    hasChildren.push(childNode);
                    
                }
            }
        }
        
        while(hasChildren.length > 0){
            level ++;
            var newHasChildren = [];
            for (i = 0; i < hasChildren.length; i++){
                var parentNode = hasChildren[i];
                                    
                for (j = 0; j < parentNode.childNodes.length; j++){
                    var childNode = parentNode.childNodes[j]; 
                    scope.addSubNodesToSceneTree(childNode, parentNode.id, level);
                    
                    if(childNode.childNodes.length > 0){
                        newHasChildren.push(childNode);                        
                    }


                }

            }
            hasChildren = newHasChildren;
            
        }
            

    }

    this.expandToggleNode = function(element){
        
        var parentNode = $(element).data("node");
        //console.log(parentNode);

        if($(element).hasClass('expanded')){

            $(element).removeClass('expanded');
            $(element).find(".expander").attr("src", "./img/Plus-White.png");
            $(element).find(".expander-triangle").hide();
            var hasChildren = [];

            //find all child nodes currently in scene tree
            var nodeElements = $(".scene-tree-accordion").find('.scene-tree-cell, .scene-tree-cell-sub');
            var node;
            for (i = 0; i < nodeElements.length; i++){
                //loop through all scene tree nodes and extract individual nodes 
                node = $(nodeElements[i]).data('node');
                
                for (j = 0; j < node.parentNodes.length; j++){
                    //loop through individual nodes parent node list
                    if (node.parentNodes[j] == parentNode.id){
                        //if the value of one of the parents matches the expanded parent, hide it
                        var a = $("#" + node.id);
                        //$(a).addClass('-hidden');
                        $(a).hide();
                        //remove expanded class, make expander icon into plus and hide expander triangle:
                        $(nodeElements[i]).removeClass('expanded');
                        $(nodeElements[i]).find(".expander").attr("src", "./img/Plus-White.png");
                        $(nodeElements[i]).find(".expander-triangle").hide();

                    }
                }
            }


            
        }else{

            $(element).addClass('expanded');
            $(element).find(".expander").attr("src", "./img/Minus-White.png");
            $(element).find(".expander-triangle").show();

            for (i=0; i < parentNode.childNodes.length; i++){
                
                var a = $("#" + parentNode.childNodes[i].id)
                //$(a).removeClass('-hidden');
                $(a).show();

            }
        }
        
        
    }

    this.selectFromSceneTree = function(node){

        //Node has been selected in scene tree, need to select in 3D

        if(node.childNodes.length > 0){
            //If this is a parent node, do nothing
        }else{
            
            //Get currently selected nodes
            equip.clearSelectedNodes()
            //Unselect currently selected nodes in scene tree
            scope.clearSceneTreeSelected();
            // select the node in 3D:
            //oDvl.Scene.ChangeNodeFlags(sceneID, node.id, DvlEnums.DVLNODEFLAG.DVLNODEFLAG_SELECTED, DvlEnums.DVLFLAGOPERATION.DVLFLAGOP_SET);
            equip.selectNodeIn3D(node.id);
            
            var selectedNodeElement = $('.scene-tree-accordion').find("#" + node.id);
            $(selectedNodeElement).addClass('selected-cell');
        }
    }

    this.expandSceneTreeToSelected = function(nodeID){
        
        
        node = $("#" + nodeID).data("node");

        //collapse non parent nodes
       var expandedNodes = $('.expanded');
       
       for (i = 0; i < expandedNodes.length; i++){
            
            scope.expandToggleNode($(expandedNodes[i]))
            
       }
       

        // expand all the parent nodes:
        //console.log(node.parentNodes[0])
        for (i = 0; i < node.parentNodes.length; i++){

            var parentNodeID = node.parentNodes[i];
            var parentNode = equip.findNodeById(parentNodeID);
            //console.log('find by scene tree: ', $("#" + parentNodeID).data("node"));
            //console.log('find by id: ', parentNode);
            

            var element = $('.scene-tree-accordion').find('#' + parentNodeID);
            if(parentNode.hasOwnProperty('childNodes')){
                for (j = 0; j < parentNode.childNodes.length; j++){
                var a = $("#" + parentNode.childNodes[j].id)
                //$(a).removeClass('-hidden');
                $(a).show();
            }
            }
            


            $(element).addClass('expanded');
            $(element).find(".expander").attr("src", "./img/Minus-White.png");
            $(element).find(".expander-triangle").show();

        }
        var selectedNodeElement = $('.scene-tree-accordion').find("#" + nodeID);
         $(selectedNodeElement).addClass('selected-cell');
        //console.log($("#" + nodeID).offset().top)
        if ($(".scene-tree").is(":visible")){
            $('.side-bar-menu').animate({
                scrollTop: $("#" + nodeID).offset().top - 25 
                }, 500);
        }
        


        
        
    }

    this.clearSceneTreeSelected = function(){
        $('.scene-tree-accordion').find('.selected-cell').removeClass('selected-cell')
        

    }

    $('#scene-tree-search-icon').click(function(){
        //get list of currently visible sub-nodes:
        var visibleSubNodes = $('.scene-tree-cell-sub').find(':visible');
        


        //replace the scene tree headder with the search stuff:
        $('#scene-tree-headder-text').hide();
        var nodeElements = $('<div><div class="form-group" id="scene-tree-search-form"><input class="form-control" placeholder = "Search for nodes..." type="text" name="search-term" id="scene-tree-search-input"></div><img src="./img/Close.png" class="search-close-icon"></div>');
        $('#side-bar-title').append(nodeElements);

        //Animate the search icon to the left:
        $('#scene-tree-search-icon').animate({
            "right": "90%"
        }, 100);


        $('.search-close-icon').click(function(){
           scope.closeSceneTreeSearch(visibleSubNodes);
        });




        //replace the scene-tree-cells with a flat list of items
        $('.scene-tree-cell').hide();
        $('.scene-tree-cell-sub').hide();

        var results = equip.findNodesByString("");
        //var results = oDvl.Scene.FindNodes(sceneID, DvlEnums.DVLFINDNODETYPE.DVLFINDNODETYPE_NODENAME, 3, "");

        scope.populateSearchList(results.nodes, visibleSubNodes)

        //Handle live search:
        $('#scene-tree-search-input').keyup(function(){
            
            var searchTerm = $(this).val();
            console.log(searchTerm);
            var results = equip.findNodesByString(searchTerm);
            //var results = oDvl.Scene.FindNodes(sceneID, DvlEnums.DVLFINDNODETYPE.DVLFINDNODETYPE_NODENAME, 3, searchTerm)            
            $('.scene-tree-cell-search').remove();
            populateSearchList(results.nodes, visibleSubNodes)
        });
    })



    this.populateSearchList = function(nodes, visibleSubNodes){

        for(var i = 0; i < nodes.length; i++){
            var node = findNodeById(nodes[i]);
            if(node != 0){
                var nodeElements = $('<li class="scene-tree-cell-search" id="' + node.id +'"><div class="scene-tree-name-container"><p>' + node.nodeName +'</p></div></li>');
                //style the sections and items:
                if(node.parentNodes.length > 1){
                    //node is either an item or a section
                    if (node.childNodes.length == 0){
                        //node is an item
                        $(nodeElements).css("background-color" , scope.levels.level_2);
                    }else{
                        //node is a section
                        $(nodeElements).css("background-color" , scope.levels.level_1)
                    }
                }
                

                $(nodeElements).click(function(){
                    var nodeID = $(this).attr('id');
                    scope.closeSceneTreeSearch(visibleSubNodes);
                    scope.expandSceneTreeToSelected(nodeID);
                    equip.selectNodeIn3D(nodeID);
                }) 
            } 
            $(".scene-tree-accordion").append(nodeElements);
        }
    }

    this.closeSceneTreeSearch = function(visibleSubNodes){
        $(".scene-tree-accordion").find(".scene-tree-cell-search").remove();
        $('.scene-tree-cell').show();
        $(visibleSubNodes).parent().show();

        //Put the search icon back on the right:                
        $('#scene-tree-search-icon').animate({
            "right": "20px"
        }, 100);

        //Bring back the scene tree headder text:
        $('#scene-tree-headder-text').show();

        //Get rid of the form and close icon:
        $('.search-close-icon').parent().remove();
    }


    //var el = document.getElementById("side-bar");
    //el.addEventListener("mousedown", sideBarMouseDown, false);
    //el.addEventListener("mousemove", sideBarMouseMove, false);
    //el.addEventListener("mouseup", sideBarMouseUp, false);

    this.sceneTreeContext = false

    $('.side-bar-menu').bind('contextmenu',function(e){

        //show scene tree context menu:
        //showSceneTreeContextMenu(e);
        
        return false;
    });

    this.showSceneTreeContextMenu = function(e, node){
        var availableHeight = window.innerHeight - e.clientY;
            
        var container = $('<div id="scene-tree-context"></div>');
        $('body').append(container);
        $(container).load('./templates/scene_tree_custom_context_menu_template.html', function(){
           var menuHeight = $('#custom-context-menu').height();

            var placementY;

            if(availableHeight < (menuHeight + 10)){
                placementY = e.clientY - menuHeight;
            }else{
                placementY = e.clientY;
            }

            $('#custom-context-menu').css({
                'z-index' : '50',
                'top' : placementY,
                'left': e.clientX,
                'width': '150px'
            });

            if(equip.checkNodeVisibility(node)){
                $('#custom-context-menu').find('#hide-show-area-context').html("Hide Area");
            }else{
                $('#custom-context-menu').find('#hide-show-area-context').html("Show Area");
            }

            //menu option click handlers
            $('#custom-context-menu').find('#select-area-context').data('node', node)
            $('#custom-context-menu').find('#select-area-context').click(function(e, node){
                e.stopPropagation();
                var node = $(this).data('node');
                equip.selectNode(node);
                scope.removeSceneTreeContextMenu();
            })
            $('#custom-context-menu').find('#isolate-area-context').data('node', node)
            $('#custom-context-menu').find('#isolate-area-context').click(function(){
                e.stopPropagation();
                var node = $(this).data('node');
                equip.isolateNode(node);
                scope.removeSceneTreeContextMenu();
            })
            $('#custom-context-menu').find('#hide-show-area-context').data('node', node)
            $('#custom-context-menu').find('#hide-show-area-context').click(function(){
                e.stopPropagation();
                var node = $(this).data('node');
                equip.toggleNodeAndChildrenVisibility(node);

                scope.removeSceneTreeContextMenu();
            })
            $('#custom-context-menu').find('#area-data-context').data('node', node)
            $('#custom-context-menu').find('#area-data-context').click(function(){
                e.stopPropagation();
                scope.removeSceneTreeContextMenu();
            })
            
        });



    }

    this.showSceneTreeSubContextMenu = function(e, node){        
        var isItem;
        var availableHeight = window.innerHeight - e.clientY;       

        if(node.childNodes.length > 0){
            //must be a section
            isItem = false;
        }else{
            //must be an item
            isItem = true
        }   

        var container = $('<div id="scene-tree-context"></div>');
        $('body').append(container);
        $(container).load('./templates/scene_tree_sub_custom_context_menu_template.html', function(){

            if(!isItem){
                //remove the isolate item option
                 $('#custom-context-menu').find('#isolate-item-context').remove();
            }

            var menuHeight = $('#custom-context-menu').height();

            var placementY;

            if(availableHeight < (menuHeight + 10)){
                placementY = e.clientY - menuHeight;
            }else{
                placementY = e.clientY;
            }

            $('#custom-context-menu').css({
                'z-index' : '50',
                'top' : placementY,
                'left': e.clientX,
                'width': '150px'
            });

            
            
            //menu option click handlers
              
            $('#custom-context-menu').find('#isolate-area-context').data('node', node)
            $('#custom-context-menu').find('#isolate-area-context').data('isItem', isItem)
            $('#custom-context-menu').find('#isolate-area-context').click(function(){
                e.stopPropagation();
                var node = $(this).data('node');
                var isItem = $(this).data('isItem')
                var isolate;
                var parents = [];

                for (var i = 0; i < node.parentNodes.length; i++) {
                    parents.push(findNodeById(node.parentNodes[i]));
                };

                if(isItem){
                    //node is the parents parent node
                    isolate = parents[parents.length - 2];
                      
                }else{
                    //node is the parent node
                    isolate = parents[parents.length - 1];
                }
                
                equip.isolateNode(isolate);
                scope.removeSceneTreeContextMenu();
            })
          
            $('#custom-context-menu').find('#isolate-section-context').data('node', node)
            $('#custom-context-menu').find('#isolate-section-context').data('isItem', isItem)
            $('#custom-context-menu').find('#isolate-section-context').click(function(){
                e.stopPropagation();
                var node = $(this).data('node');
                var isItem = $(this).data('isItem')
                var isolate;
                var parents = [];

                for (var i = 0; i < node.parentNodes.length; i++) {
                    parents.push(findNodeById(node.parentNodes[i]));
                };

                if(isItem){
                    //node is the parents parent node
                    isolate = parents[parents.length - 1];
                      
                }else{
                    //node is the parent node
                    isolate = node;
                }
                
                equip.isolateNode(isolate);
                scope.removeSceneTreeContextMenu();
            })

            $('#custom-context-menu').find('#isolate-item-context').data('node', node)
            $('#custom-context-menu').find('#isolate-item-context').click(function(){
                e.stopPropagation();
                var node = $(this).data('node');
                equip.isolateNode(node);
                scope.removeSceneTreeContextMenu();
            })



            $('#custom-context-menu').find('#area-data-context').data('node', node)
            $('#custom-context-menu').find('#area-data-context').click(function(){
                e.stopPropagation();
                scope.removeSceneTreeContextMenu();
            })
            
        });



    }

    this.removeSceneTreeContextMenu = function(){
        
        $("#scene-tree-context").remove();
    }

    this.showContextSwipeMenu = function(node){
        var element = $("#" + node.id);
        
        //newElements = $('<div class="swipe-context-menu"><div><img src="./img/Hide.png"><p>Hide</p></div><div><img src="./img/Hide.png"><p>Hide</p></div><div><img src="./img/Hide.png"><p>Hide</p></div></div>')

        var newElements = $('<div id=swipe-context-menu class="swipe-context-menu"></div>');
        
        $(newElements).load('./templates/scene_tree_swipe_context_menu.html', function(){
            

            if(node.parentNodes.length == 1){
                //must be an area
                $(newElements).find("#swipe-isolate-section").remove();
                $(newElements).find('#swipe-isolate-area').css('margin-left', '15%')       
            }


            $(element).children().fadeOut().promise().then(function(){
                $(element).children().hide()
                $(element).append(newElements)

                var parents = [];

                for (var i = 0; i < node.parentNodes.length; i++) {
                    parents.push(equip.findNodeById(node.parentNodes[i]));
                };

                $(element).find("#swipe-isolate-area").data('node', node);
                $(element).find("#swipe-isolate-area").click(function(e){
                    e.stopPropagation();
                    var node = $(this).data('node')
                    console.log('fire');
                    if(parents.length == 1){
                        //node must be an area:
                        equip.isolateNode(node);
                    }else if(node.childNodes.length > 0){
                        //node must be a section

                        equip.isolateNode(parents[parents.length - 1])
                    }else if(node.childNodes.length == 0){
                        //must be an item
                        equip.isolateNode(parents[parents.length - 1])
                    }
                    //isolateNode(node.parentNodes[node.parentNodes.length - 2]);
                    scope.hideContextSwipeMenu()
                })

                $(element).find("#swipe-isolate-section").data('node', node);
                $(element).find("#swipe-isolate-section").click(function(e){
                    e.stopPropagation();
                    var node = $(this).data('node')
                    console.log('fire');
                    if(parents.length == 1){
                        //node must be an area:
                        
                    }else if(node.childNodes.length > 0){
                        //node must be a section

                        equip.isolateNode(node)
                    }else if(node.childNodes.length == 0){
                        //must be an item
                        equip.isolateNode(parents[parents.length - 2])
                    }
                    //isolateNode(node.parentNodes[node.parentNodes.length - 2]);
                    scope.hideContextSwipeMenu()
                })
                
                $(element).find("#swipe-context-menu").show()
                
            })
        });
            

        
    }

    this.hideContextSwipeMenu = function(){
        var element = $("#swipe-context-menu").parent();
        
        $("#swipe-context-menu").fadeOut().promise().then(function(){
            $("#swipe-context-menu").remove();
            $(element).children().fadeIn();
        });
        
        
    }
}



        

        

