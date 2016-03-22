
function Equip(canvasID, canvasParentID){

	
	/**
		Public Varialbles:
	**/
	var scope = this;
	scope.canvasID = canvasID;
	scope.canvasParentID = canvasParentID;
	scope.oDvl = Dvl.Create(scope.canvasID, true, {configureCanvas: true});

	scope.controls = new mouseControls(scope);
	scope.touchControls = new touchControls(scope);

	/**
		Private Varialbles:
	**/
	scope.dpi_scale = window.devicePixelRatio;
	
	
	var lastSelectedNode = [];
	var currentSelectionID;

	//Auto jdvl initialisation				
	
	
	
	this.oDvl;
	this.sceneID;
	this.offsetX;
	this.offsetY;	
	this.steps;
	this.stepsList = [];		
	this.modelViewsList = [];
	this.topNodes = [];
	this.nodeList = [];
		
	


	//TODO: this should go in the calling code
	window.onresize=function(){
		scope.resetCanvas()

	};

	/*********************
		
		File Handling

	*********************/

	this.LoadAndDisplayFile = function (file)
	{
		
		scope.oDvl.Helpers.LoadLocalFile(file,null,function(fileToken, pwd) {
			scope.sceneID = scope.oDvl.Core.LoadScene(fileToken, pwd);

			
			
			scope.getTopLevelNodes();
			
			scope.getProcedures();

			scope.oDvl.Renderer.AttachScene(scope.sceneID);
			scope.oDvl.Helpers.Refresh();	
			
			//Set Shadows:	
			var result = scope.oDvl.Renderer.SetOption(2, true);
			//Set Ambient occlusion:
			var result = scope.oDvl.Renderer.SetOption(5, false);
			//Set Double resolution:
			var result = scope.oDvl.Renderer.SetOption(8, false);
			//Set dpi scale

			scope.setCanvas();
			
			scope.fileLoadCallback();
				
					
		}, null, null)

		


	};

	this.fileLoadCallback = function(){
		console.log(scope.topNodes)
	}


	setRenderOption = function(option, on){
		switch(option){			
			case "ambient-occlusion":
				scope.oDvl.Renderer.SetOption(5, on);
				break;
			case "shadows":
				scope.oDvl.Renderer.SetOption(5, on);
				break;
			case "double-resolution":
				scope.oDvl.Renderer.SetOption(8, on);
		}
	}

	

	/*********************
		
		Canvas Operations

	*********************/

	this.setCanvas = function(){

		scope.offsetX = document.getElementById(scope.canvasParentID).offsetLeft;
		scope.offsetY = document.getElementById(scope.canvasParentID).offsetTop;

		scope.canvasWidth = document.getElementById(canvasParentID).offsetWidth;
		scope.canvasHeight = document.getElementById(canvasParentID).offsetHeight;

		scope.oDvl.Helpers.ConfigureCanvas(scope.canvasWidth, scope.canvasHeight);
	}

	this.resetCanvas = function(){
		
		//TODO this should be in the calling code:
		///
		
		///

		var newWidth = document.getElementById(scope.canvasParentID).offsetWidth;
		var newHeight = document.getElementById(scope.canvasParentID).offsetHeight;
		scope.oDvl.Helpers.ConfigureCanvas(newWidth, newHeight);
		scope.offsetX = document.getElementById(scope.canvasParentID).offsetLeft;
		scope.offsetY = document.getElementById(scope.canvasParentID).offsetTop;


		

		

	}

	/*********************
		
		End canvas operations

	*********************/



	this.oDvl.Client.OnNodeSelectionChanged = function(clientId, sceneId, numberofSelectedNodes, idFirstSelectedNode){
		//This function overrides the default on node selection changed
		//TODO I think perhaps the calling code should override this entire function? 
		//....... a lot of the code that goes on in here is quite application specific (context menus etc.)
		/*
		if (numberofSelectedNodes > 0){
					
				if(scope.hideTool){
					node = scope.findNodeById(idFirstSelectedNode)
					if(node != 0){
						
						scope.hideNode(node);
						scope.visibilityChanged(node);
						scope.hideToolList.push(idFirstSelectedNode);	
					}
					
					return
				}

				if(scope.selectTool){
					if(scope.selectToolSelectedList.length == 0){
						scope.activateMultiSelectContextMenu();
					}
					scope.selectToolSelectedList.push(idFirstSelectedNode);
					

					for (i = 0; i < scope.selectToolSelectedList.length; i++){
						scope.oDvl.Scene.ChangeNodeFlags(scope.sceneID, scope.selectToolSelectedList[i], scope.oDvl.Enumerations.DVLNODEFLAG.DVLNODEFLAG_SELECTED, DvlEnums.DVLFLAGOPERATION.DVLFLAGOP_SET);

					}
					
					return
				}

				if(idFirstSelectedNode == scope.lastSelectedNode){
					var mousePosition = {
						x:scope.ox,
						y:scope.oy
					}
					scope.activate3DContextMenu(idFirstSelectedNode, mousePosition);
					
				}else{
					
					var selectedNode = scope.findNodeById(idFirstSelectedNode);				

					for (var i = 0; i < scope.topNodes[0].childNodes.length; i++) {

						if(scope.topNodes[0].childNodes[i].id == selectedNode.id){
							scope.activateHotSpot(selectedNode);
						}	
					};
					
					scope.nodeSelectionEvent(idFirstSelectedNode);
					
				}
		}else{
			if(selectTool){
				return
			}
			currentSelectionID = null;
			clearSceneTreeSelected();
			//hide in context menu
			$('.context-menu').hide();
			//show tabs menu
			$('.tabs-menu-items').show();
		}
		lastSelectedNode = idFirstSelectedNode;	
		*/	
		
	}

	this.nodeSelectionEvent = function(nodeID){
		//Calling code should override this function
		scope.clearSceneTreeSelected();
		scope.expandSceneTreeToSelected(idFirstSelectedNode);

	}

	this.oDvl.Client.OnStepEvent = function(clientId, type, stepId){
		//TODO: this method should be overriden by the calling code.
		if(type == 0){
			//the step was paused (0), but event has been called so its now playing... change the play icont to a pause:
			var step = scope.findStepByID(stepId);
			$('#' + stepId).find('.areas-list-play-img').attr('src', './img/Pause.png');
			
		}
		if(type == 2){
			//the step has been completed (2),change the play icon back to play:
			var step = scope.findStepByID(stepId);
			$('#' + stepId).find('.areas-list-play-img').attr('src', './img/Play.png');
			step.isPlaying = "stopped";
		}
		
	}

	/*********************
		
		Node operations

	*********************/


	this.getTopLevelNodes = function(){
		//TODO this function needs to be configured to return the tree from the highest node down....


		var sceneInfo = scope.oDvl.Scene.RetrieveSceneInfo(scope.sceneID, scope.oDvl.Enumerations.DVLSCENEINFO.DVLSCENEINFO_CHILDREN);

		for (var i = 0; i < sceneInfo.ChildNodes.length; i ++){
			var node = new Node(sceneInfo.ChildNodes[i]);
			scope.topNodes.push(node);	
		}
		
		//TODO: the folliwng code should be implemented by the calling code, not here
		/*
		for(i = 0; i < scope.topNodes[0].childNodes.length; i++){
			addNodeToSceneTree(topNodes[0].childNodes[i], false);

		}			
		traverseTree();
		*///
		
		scope.buildNodeList();
	}

	this.buildNodeList = function(){
		//This function builds out a flat list of nodes... easy for searching and for looping through all nodes

		var hasChildren = [];

	    	//loop through all top nodes, add them to the node list
	        var parentNode = scope.topNodes[0];
	        
	        scope.nodeList.push(parentNode[i]);              
	        for (j = 0; j < parentNode.childNodes.length; j++){
	        	//loop through each top nodes children, add them to the node list
	            var childNode = parentNode.childNodes[j];
	            scope.nodeList.push(childNode);            

	            //If the chld nodes have children of their own, add them to a temp list
	            if(childNode.childNodes.length > 0){
	                hasChildren.push(childNode);
	                
	            }
	        }
	  
	    
	    while(hasChildren.length > 0){
	    	//recursive loop through temp list of remaning nodes with children
	        
	        var newHasChildren = [];
	        for (i = 0; i < hasChildren.length; i++){
	            var parentNode = hasChildren[i];
	                                
	            for (j = 0; j < parentNode.childNodes.length; j++){
	                var childNode = parentNode.childNodes[j]; 
	                scope.nodeList.push(childNode);
	                
	                if(childNode.childNodes.length > 0){
	                    newHasChildren.push(childNode);                        
	                }
	            }
	        }
	        hasChildren = newHasChildren;	        
	    }
	    
	    for (var i = 0; i < scope.nodeList.length; i++) {
	    	if (typeof scope.nodeList[i] === undefined){
	    		badNodesList.push(i);
	    	}
	    };
	    //TODO figure out why some nodes are undefined..... get rid of this hard coded shit
	    scope.nodeList.splice(0,1);   
	    
	}

	function Node(nodeId){		
		//ID
		this.id = nodeId;
		//Name
		var nodeName = scope.oDvl.Scene.RetrieveNodeInfo(scope.sceneID, nodeId, scope.oDvl.Enumerations.DVLNODEINFO.DVLNODEINFO_NAME);
		this.nodeName = nodeName.NodeName;

		//Parents
		var nodeParents = scope.oDvl.Scene.RetrieveNodeInfo(scope.sceneID, nodeId, scope.oDvl.Enumerations.DVLNODEINFO.DVLNODEINFO_PARENTS);
		this.parentNodes = nodeParents.ParentNodes;

		//Matrix:
		var position = scope.getNodePosition(this.id);
		this.matrix = position.matrix;

		var list = [];
		context = this;

		
		//Children
		var childList = scope.oDvl.Scene.RetrieveNodeInfo(scope.sceneID, nodeId, scope.oDvl.Enumerations.DVLNODEINFO.DVLNODEINFO_CHILDREN);
		
		
		for (var i = 0; i < childList.ChildNodes.length; i++){			
			
			var newNode = new Node (childList.ChildNodes[i]);
						
			list.push(newNode);

		}
		this.childNodes = list;
	}

	this.getInverseNodes = function(inputNodes){
		var allNodeIDs = [];
		var inputNodeIDs = [];
		var outputNodes = []
		
		for (var i = 0; i < scope.nodeList.length; i++) {
			allNodeIDs.push(scope.nodeList[i].id)
		}

		try{
			for (var i = 0; i < inputNodes.length; i++) {
				inputNodeIDs.push(inputNodes[i].id);
			}
		}catch(err){
			console.log("Caught an error...", err.message)
		}

		for (var i = 0; i < inputNodeIDs.length; i++) {
			var index = allNodeIDs.indexOf(inputNodeIDs[i]);
			allNodeIDs.splice(index, 1);
		};

		for (var i = 0; i < allNodeIDs.length; i++) {
			var node = scope.findNodeById(allNodeIDs[i]);
			outputNodes.push(node);
		};

		return outputNodes;

	}

	this.findNodeByParent = function(inputNode){
		
		var outputNodes = [];
			
		for (var i = 0; i < scope.nodeList.length; i++) {
			scope.nodeList[i]
			for(var j = 0; j < scope.nodeList[i].parentNodes.length; j++){
				try{
					if(scope.nodeList[i].parentNodes[j] == inputNode.id){
						outputNodes.push(scope.nodeList[i]);
					}
				}catch(err){
					console.log("Caught an error...", err.message);
				}
				
			}
				
		}
		
		return outputNodes;
	}

	


	this.findNodeById = function(nodeID){
		for (var i = 0; i < scope.nodeList.length; i++) {
			
			if(scope.nodeList[i].id == nodeID){
				return scope.nodeList[i];
			}	
				
		}
		return 0;
	}

	/*********************
		
		End of Node operations

	*********************/

	/*********************
		
		Visibility

	*********************/

	this.visibilityChanged = function(){
		//designed to be overwritten
	}
	

	this.hideNode = function(node){
		
		scope.oDvl.Scene.ChangeNodeFlags(scope.sceneID ,node.id, 
	    	scope.oDvl.Enumerations.DVLNODEFLAG.DVLNODEFLAG_VISIBLE, 
	    	scope.oDvl.Enumerations.DVLFLAGOPERATION.DVLFLAGOP_CLEAR);
	}

	this.showNode = function(node){
		
		scope.oDvl.Scene.ChangeNodeFlags(equip.sceneID ,node.id, 
	    	scope.oDvl.Enumerations.DVLNODEFLAG.DVLNODEFLAG_VISIBLE, 
	    	scope.oDvl.Enumerations.DVLFLAGOPERATION.DVLFLAGOP_SET);
	}

	this.showAllNodes = function(){
		for (var i = 0; i < scope.nodeList.length; i++) {
			scope.showNode(scope.nodeList[i]);
			scope.visibilityChanged(scope.nodeList[i])
		};
	}

	this.getVisibleNodes = function(){
		var visibleNodes = []

		for (var i = 0; i < scope.nodeList.length; i++) {
			//console.log(typeof nodeList[i])
			if(typeof scope.nodeList[i] == "undefined"){

			}else{
				var flags = scope.oDvl.Scene.RetrieveNodeInfo(scope.sceneID, scope.nodeList[i].id, scope.oDvl.Enumerations.DVLNODEINFO.DVLNODEINFO_FLAGS);
				var visible = flags.Flags & scope.oDvl.Enumerations.DVLNODEFLAG.DVLNODEFLAG_VISIBLE;
				if(visible){
					visibleNodes.push(scope.nodeList[i]);
				}
			}
			
		}
		return visibleNodes;	
	}

	this.getHiddenNodes = function(){
		var hiddenNodes = []

		for (var i = 0; i < scope.nodeList.length; i++) {
			//console.log(typeof nodeList[i])
			if(typeof scope.nodeList[i] == "undefined"){

			}else{
				var flags = scope.oDvl.Scene.RetrieveNodeInfo(scope.sceneID , scope.nodeList[i].id, scope.oDvl.Enumerations.DVLNODEINFO.DVLNODEINFO_FLAGS);
				var visible = flags.Flags & scope.oDvl.Enumerations.DVLNODEFLAG.DVLNODEFLAG_VISIBLE;
				if(!visible){
					hiddenNodes.push(scope.nodeList[i]);
				}
			}
			
		}
		return hiddenNodes;	
	}

	this.checkNodeVisibility = function(inputNode){
		var flags = scope.oDvl.Scene.RetrieveNodeInfo(scope.sceneID, inputNode.id, scope.oDvl.Enumerations.DVLNODEINFO.DVLNODEINFO_FLAGS);
		var visible = flags.Flags & scope.oDvl.Enumerations.DVLNODEFLAG.DVLNODEFLAG_VISIBLE;
		return visible;
	}

	this.toggleNodeAndChildrenVisibility = function(inputNode){

	   //find any node with this node as a parent:
	    var allChildren = scope.findNodeByParent(inputNode);
	    
	    if(scope.checkNodeVisibility(inputNode)){
	        //node is currently visible, so hide it along with children
	        scope.hideNode(inputNode);
	        scope.visibilityChanged(inputNode);
	        
	        for (var i = 0; i < allChildren.length; i++) {
	            scope.hideNode(allChildren[i]);
	            scope.visibilityChanged(allChildren[i]);
	        }
	    }else{
	        //node is currently not visible, so show it along with all children
	        scope.showNode(inputNode);
	        scope.visibilityChanged(inputNode);
	        for (var i = 0; i < allChildren.length; i++) {
	            scope.showNode(allChildren[i]);
	            scope.visibilityChanged(allChildren[i]);
	        }
	    }    
		
	}

	this.isolateNode = function(node){
		//firstly, show everything
		scope.showAllNodes();
		//find all children of node to isolate:
		var nodesToIsolate = scope.findNodeByParent(node);
		nodesToIsolate.push(node);

		//now get all nodes to hide (inverse of nodes to isolate)
		var inverseNodes = scope.getInverseNodes(nodesToIsolate);

		//loop through nodes to hide and hide them
		for (var i = 0; i < inverseNodes.length; i++) {
			scope.hideNode(inverseNodes[i])
			scope.visibilityChanged(inverseNodes[i])
		}
		//finally, zoom to the isolated node
		scope.zoomToNode(node);

	}

	this.isolateNodes = function(nodes){
		//TODO could probably combine this with the above method to handle single and multiple nodes
		scope.showAllNodes();
		var nodesToIsolate = [];

		for (var i = 0; i < nodes.length; i++) {
			nodesToIsolate.push(nodes[i]);
			var childNodes = scope.findNodeByParent(nodes[i]);

			nodesToIsolate = arrayUnique(nodesToIsolate.concat(childNodes));
			
		};

		var inverseNodes = scope.getInverseNodes(nodesToIsolate);

		for (var i = 0; i < inverseNodes.length; i++) {
			scope.hideNode(inverseNodes[i])
			scope.visibilityChanged(inverseNodes[i])
		}

		scope.zoomToSelected()

	}

	this.makeTransparent = function(node, opacity){

		
		var command = 'exact_match($name, "' + node.nodeName + '") set_opacity(' + opacity + ')';

		var result = scope.oDvl.Scene.Execute(scope.sceneID, scope.oDvl.Enumerations.DVLEXECUTE.DVLEXECUTE_QUERY, command);
	}

	/*********************
		
		End of Visibility

	*********************/

	/*********************
		
		Selection

	*********************/
	this.selectNode = function(node){
		//TODO this is a duplicate
		nodeID = node.id;
		scope.oDvl.Scene.ChangeNodeFlags(scope.sceneID, nodeID, scope.oDvl.Enumerations.DVLNODEFLAG.DVLNODEFLAG_SELECTED, scope.oDvl.Enumerations.DVLFLAGOPERATION.DVLFLAGOP_SET);
	}

	this.selectNodeIn3D = function(nodeID){
		//TODO this is a duplicate
	    scope.oDvl.Scene.ChangeNodeFlags(scope.sceneID, scope.nodeID, scope.oDvl.Enumerations.DVLNODEFLAG.DVLNODEFLAG_SELECTED, scope.oDvl.Enumerations.DVLFLAGOPERATION.DVLFLAGOP_SET);
	}

	this.clearSelectedNodes = function(){
		 var sceneInfo = scope.oDvl.Scene.RetrieveSceneInfo(scope.sceneID, scope.oDvl.Enumerations.DVLSCENEINFO.DVLSCENEINFO_SELECTED);
	    //deselect currently selcected nodes:
	    for (i = 0; i < sceneInfo.SelectedNodes.length; i++){
	    	var node = scope.findNodeById(sceneInfo.SelectedNodes[i])
	        scope.removeSelection(node)
	    }
	}

	this.getSelectedNodeIds = function(){
		var sceneInfo = scope.oDvl.Scene.RetrieveSceneInfo(scope.sceneID, scope.oDvl.Enumerations.DVLSCENEINFO.DVLSCENEINFO_SELECTED);
		return sceneInfo.SelectedNodes;
	}


	this.removeSelection = function(node){
		
		scope.oDvl.Scene.ChangeNodeFlags(scope.sceneID, node.id, scope.oDvl.Enumerations.DVLNODEFLAG.DVLNODEFLAG_SELECTED, DvlEnums.DVLFLAGOPERATION.DVLFLAGOP_CLEAR);
	}


	/*********************
		
		End of selection

	*********************/

	/*********************
		
		View manipulation

	*********************/

	this.getCameraPosition = function(){		
		return scope.oDvl.Renderer.GetCameraMatrices();
	}

	this.setCameraPosition = function(cameraPosition, seconds){
		scope.oDvl.Renderer.SetCameraMatrices(cameraPosition.view, cameraPosition.projection, seconds);
	}

	this.zoomToNode = function(node){
		scope.oDvl.Renderer.ZoomTo(scope.oDvl.Enumerations.DVLZOOMTO.DVLZOOMTO_NODE, node.id, 1);
	}

	this.zoomToSelected = function(){
		scope.oDvl.Renderer.ZoomTo(scope.oDvl.Enumerations.DVLZOOMTO.DVLZOOMTO_SELECTED, null, 1);
	}
	
	this.resetView = function(){
		scope.oDvl.Renderer.ResetView();
	}

	this.activateDefaultView = function(view){
		switch(view){
			case "top":
				scope.oDvl.Renderer.ZoomTo(DvlEnums.DVLZOOMTO.VIEW_TOP, null, 1);
				break;
			case "left":
				scope.oDvl.Renderer.ZoomTo(DvlEnums.DVLZOOMTO.VIEW_LEFT, null, 1);
				break;
			case "right":
				scope.oDvl.Renderer.ZoomTo(DvlEnums.DVLZOOMTO.VIEW_RIGHT, null, 1);
				break;
			case "front":
				scope.oDvl.Renderer.ZoomTo(DvlEnums.DVLZOOMTO.VIEW_FRONT, null, 1);
				break;
			case "back":
				scope.oDvl.Renderer.ZoomTo(DvlEnums.DVLZOOMTO.VIEW_BACK, null, 1);
				break;
			case "bottom":
				scope.oDvl.Renderer.ZoomTo(DvlEnums.DVLZOOMTO.VIEW_BOTTOM, null, 1);
				break;

		}
	}

	/*********************
		
		End of View Manipulation

	*********************/
	
	/*********************
		
		Procedures

	*********************/

	this.activateStep = function(stepID){
		scope.oDvl.Scene.ActivateStep(scope.sceneID, stepID, false, false);
	}

	this.pauseCurrentStep = function(){
		scope.oDvl.Scene.PauseCurrentStep(scope.sceneID);
	}

	this.getProcedures = function(){
		//Method to extract steps and model views from scene
		var procedures = scope.oDvl.Scene.RetrieveProcedures(scope.sceneID);
		console.log(procedures)
		//TODO this currently only looks at the first procedure in the scene... fix this hard coded shit
		var modelViews = procedures.portfolios[0].steps;
		var steps = procedures.procedures[0].steps;

		for (var i =0; i < modelViews.length; i++){
			var modelView = new Step(modelViews[i]);
			scope.modelViewsList.push(modelView);
			//This loop collects all model views within scene and populates the area views list'
			var imgDataBase64 = oDvl.Scene.RetrieveThumbnail(scope.sceneID, modelViews[i].id);
			modelViews[i].imgData = imgDataBase64;

			//TODO calling code needs to grab model views and implement this
			//scope.addModelViewToUI(scope.modelViews[i]);
		}
		
		for (var i =0; i < steps.length; i++){
			
			

			//This loop collects all steps within scene and populates the view states list'
			
			var imgDataBase64 = scope.oDvl.Scene.RetrieveThumbnail(scope.sceneID, steps[i].id);
			var step = new Step(steps[i], imgDataBase64);
			scope.stepsList.push(step);
			//TODO calling code needs to grab model views and implement this
			//scope.addStepsToUI(steps[i]);	
		}
	}

	function Step(step, imgData){
		this.imgData = imgData
		this.id = step.id;
		this.name = step.name;
		this.isPlaying = "stopped";
	}


	this.findStepByID = function(searchid){
		

		for (var i = 0; i < this.stepsList.length; i++) {
			
			if (this.stepsList[i].id == searchid){
				return this.stepsList[i]
			}
		};
	}

	
	/*********************
		
		End of procedures

	*********************/
	
	/*********************
		
		Positions

	*********************/	

	this.getNodePositions = function(nodes){
		var nodePositions = [];

		for (var i = 0; i < nodes.length; i++) {
			position = {
				id: nodes[i].id,
				position: this.getNodePosition(nodes[i].id)
			}
			nodePositions.push(position);
		}
		return nodePositions
	}

	this.getNodePosition = function(nodeID){
		return this.oDvl.Scene.GetNodeWorldMatrix(this.sceneID, nodeID)
	}

	

	/*********************
		
		End of Positions

	*********************/

	/*********************
		
		Find

	*********************/

	this.findNodesByString = function(searchString){
		results = scope.oDvl.Scene.FindNodes(scope.sceneID, scope.oDvl.Enumerations.DVLFINDNODETYPE.DVLFINDNODETYPE_NODENAME, 3, searchString);	
		return results;
	}
	

	
	/*
	this.activateHotSpot = function(node){
		//make everything except the current node transparent:
		var childNodes = findNodeByParent(node);

		makeTransparent(node, 1.0);
		for (var i = 0; i < childNodes.length; i++) {
			makeTransparent(childNodes[i], 1.0)
		};

		var childNodeIds = [];
		for (var i = 0; i < childNodes.length; i++) {
			childNodeIds.push(childNodes[i].id);
		};



		var inverseNodes = [];

		for (var i = 0; i < nodeList.length; i++) {
			inverseNodes.push(nodeList[i].id);
		};

		for(var i = 0; i < childNodeIds.length; i++){
			var index = inverseNodes.indexOf(childNodeIds[i]);
			inverseNodes.splice(index, 1);
		}

		parentNodeId = node.id;

		var index = inverseNodes.indexOf(parentNodeId);
		inverseNodes.splice(index, 1);

		

		
		var opacity = 0.5;

		for (var i = 0; i < inverseNodes.length; i++) {
			var inverseNode = findNodeById2(inverseNodes[i]);
			
			makeTransparent(inverseNode, opacity);
		};
		
	}

	this.paintNode = function(){


		var command = 	'<?xml version="1.0"?>' + 
						'<PAINT_LIST>' + 
							'<PAINT COLOR="#00ff80" OPACITY="1.0" VISIBLE="true">' + 
								'<NODE ID="Compressor Casing"/>' + 
							'</PAINT>'
						'</PAINT_LIST>';
		//var command = '<?xml version="1.0"?><PAINT_LIST><PAINT COLOR="#000000" OPACITY="1" ALLOW_OVERRIDE="false" DEFAULT="true"/><PAINT COLOR="#00ff80" OPACITY="1.0" VISIBLE="true"><NODE ID="Compressor Casing"/></PAINT></PAINT_LIST>'



		var result = oDvl.Scene.Execute(sceneID, oDvl.Enumerations.DVLEXECUTE.DVLEXECUTE_PAINTXML, command);
	}

	


	

	

		this.placeDynamicLabel = function(node, text){

		var command = '<dynamic-labels><dynamic-label text="' + text + '" name="' + node.nodeName + '"/></dynamic-labels>';
				
		var result = oDvl.Scene.Execute(sceneID, oDvl.Enumerations.DVLEXECUTE.DVLEXECUTE_DYNAMICLABELS, command);
		console.log("odvl result: ", result);
		console.log(DvlEnums)
	}
	*/


	

	

	function arrayUnique(array) {
	    var a = array.concat();
	    for(var i=0; i<a.length; ++i) {
	        for(var j=i+1; j<a.length; ++j) {
	            if(a[i] === a[j])
	                a.splice(j--, 1);
	        }
	    }

	    return a;
	}

	this.handleTouchStart = function(){
		console.log("now")
		//designed to be overriden by calling code
	}


}


/*----------------------------

	Mouse Events

------------------------------*/

mouseControls = function(scope){

	var controls = this;

	this.el = document.getElementById(scope.canvasParentID);

	this.el.addEventListener("mousedown", onMouseDown, false);
	this.el.addEventListener("mousemove", onMouseMove, false);
	this.el.addEventListener("mouseup", onMouseUp, false);
	this.el.addEventListener("mousewheel", onScrollWheel, false);

	//el.addEventListener("touchstart", onTouchStart, false);



	this.zoomSpeed = 0.1;

	this.mouseRotating = false;
	this.mousePanning = false;
	this.mouseZooming = false;;
	this.mouseRotateCenter_01;
	this.leftClickMove = false;
	this.mouseDown = false;
	this.mouseMoved = false;
	this.ox;
	this.oy;



	function onMouseDown(event){
		event.preventDefault();

		if (controls.mouseDown){
			return;
		}	

		if(event.button == 2){
			controls.mouseDown = false;

		}else{

			controls.mouseDown = true;
			
		}
		
		controls.mouseDown = true;

		controls.ox = event.clientX - scope.offsetX;
		controls.oy = event.clientY - scope.offsetY;

		
		controls.mouseMoved = false;
		scope.oDvl.Helpers.CommandQueue.push(function () {
			scope.oDvl.Renderer.BeginGesture(controls.ox * scope.dpi_scale, controls.oy * scope.dpi_scale);    
		});
	}

	function onMouseUp(event){
		event.preventDefault();

		
		if (!controls.mouseDown){
			scope.oDvl.Helpers.CommandQueue.push(function () {
				scope.oDvl.Renderer.EndGesture();
			});
			return;
		}

		

		controls.mouseDown = false;

		scope.oDvl.Helpers.CommandQueue.push(function () {
			scope.oDvl.Renderer.EndGesture();
		});

		

		if(!controls.mouseMoved && event.button == 0){
			
			scope.oDvl.Helpers.CommandQueue.push(function () {
				scope.oDvl.Renderer.Tap(controls.ox * scope.dpi_scale, controls.oy * scope.dpi_scale);
			});

					
		}

		
	}



	function onMouseMove(event){
		event.preventDefault();

		if (!controls.mouseDown){
			return;
		}

		

		var dx = (event.clientX - scope.offsetX) - controls.ox;
		var dy = (event.clientY - scope.offsetY) - controls.oy;

		

		controls.ox = event.clientX - scope.offsetX;
		controls.oy = event.clientY - scope.offsetY;

		if (Math.abs(dx) > 0 || Math.abs(dy) > 0){
			
			controls.mouseMoved = true;

			if(event.button == 0){
				scope.oDvl.Helpers.CommandQueue.push(function () {
					scope.oDvl.Renderer.Rotate(dx, dy);    
				});
				
			}else if(event.button == 1){
				
				scope.oDvl.Helpers.CommandQueue.push(function () {
					scope.oDvl.Renderer.Pan(dx, dy);
				});

			}else if (event.button == 2){
				var z = 1 - (dy / 150);
				if(z < 0.1){
					z = 0.1;
				}else if (z > 10){
					z = 10;
				}
				
				scope.oDvl.Helpers.CommandQueue.push(function () {
					scope.oDvl.Renderer.Zoom(z);
				});
						

			}

			
		}

		
	}




	function onScrollWheel(event){
		var z;
		
		var ox = event.clientX - scope.offsetX;
		var oy = event.clientY - scope.offsetY;
		
		scope.oDvl.Helpers.CommandQueue.push(function () {
			scope.oDvl.Renderer.BeginGesture(ox * scope.dpi_scale, oy * scope.dpi_scale);    
		});

		if(event.wheelDelta > 0){
			z = 1 - controls.zoomSpeed;
		}else{
			z = 1 + controls.zoomSpeed;
		}


		scope.oDvl.Helpers.CommandQueue.push(function () {
			scope.oDvl.Renderer.Zoom(z);
		});


		scope.oDvl.Helpers.CommandQueue.push(function () {
			scope.oDvl.Renderer.EndGesture();
		});
	}

	$('#canvas').bind('contextmenu',function(e){
		
		return false;
	});


	
}

touchControls = function(equip){

	var touch = this;

	this.element = document.getElementById(equip.canvasID);
	this.touchX;
	this.touchY;
	this.pinchX_1;
	this.pinchY_1;
	this.pinchX_2;
	this.pinchY_2;
	this.rotation = false;
	this.zooming = false;
	this.distance;
	this.busy = false;
	this.timeOutInterval=200;
	this.timeoutHandle;
	this.rotateTimeoutHandle;
	this.rotateAvailable = true;
	this.selectAvailable = true;

	this.fingerOne;
	this.fingerOneStart;
	this.fingerTwo;
	this.counter;
	this.thresh = 50;

	this.hammertime = new Hammer(this.element);
	this.hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
	this.hammertime.get('pinch').set({ enable: true });
	this.hammertime.get('press').set({enable: true});

	this.hammertime.on('pressup', function(ev){
		console.log('press-up')

	})

	this.hammertime.on('press', function(ev){
		console.log('press')
	})

	/******* 
		Rotation Controls (uses the hammer.js 'pan' function)

	*********/


	this.hammertime.on('panstart', function(ev){

		equip.handleTouchStart();
		
		touch.rotateTimeoutHandle = setTimeout(touch.rotateTimerFunction, touch.timeOutInterval);
		touch.selectAvailable = false;

		touch.touchX = ev.center.x - equip.offsetX;
		touch.touchY = ev.center.y - equip.offsetY;
		if(touch.rotateAvailable){
			touch.rotation = true;
			touch.zooming = false;
		}
		

		equip.oDvl.Helpers.CommandQueue.push(function () {
			equip.oDvl.Renderer.BeginGesture(touch.touchX * equip.dpi_scale, touch.touchY * equip.dpi_scale);    
		});


	});

	this.hammertime.on('pan', function(ev) {
	    window.clearTimeout(touch.rotateTimeoutHandle);
	    touch.rotateTimeoutHandle = setTimeout(touch.rotateTimerFunction, touch.timeOutInterval);
		

	    var dx = (ev.center.x - equip.offsetX) - touch.touchX;
		var dy = (ev.center.y - equip.offsetY) - touch.touchY;

		touch.touchX = ev.center.x - equip.offsetX;
		touch.touchY = ev.center.y - equip.offsetY;

		if(touch.rotation){
			equip.oDvl.Helpers.CommandQueue.push(function () {
				equip.oDvl.Renderer.Rotate(dx, dy);    
			});
		}   
		



	});

	this.hammertime.on('panend', function(ev){
		equip.oDvl.Helpers.CommandQueue.push(function () {
			equip.oDvl.Renderer.EndGesture();
		});
		touch.rotation = false;
	})

	/******* 
		Zoom and pan controls (uses the hammer.js 'pinch' function)

	*********/

	this.hammertime.on('pinchstart', function(ev){

		equip.handleTouchStart();

		touch.fingerOne = {	x: ev.pointers[0].clientX,
							y: ev.pointers[0].clientY,
					};
		touch.fingerTwo = {	x: ev.pointers[1].clientX,
							y: ev.pointers[1].clientY,
						};

		touch.separation = {	x: Math.abs(touch.fingerOne.x - touch.fingerTwo.x),
								y: Math.abs(touch.fingerOne.y - touch.fingerTwo.y)
						}

		touch.deltaSeparation = {x: 0,
								y: 0,
								total:0
							};

		touch.counter = 0;

		touch.multiTouchX = ev.center.x;
		touch.multiTouchY = ev.center.y;

		touch.timeoutHandle = setTimeout(touch.zoomTimerFunction, touch.timeOutInterval);
		touch.rotateAvailable = false;
		
		touch.distance = 0;
		touch.rotation = false;

		equip.oDvl.Helpers.CommandQueue.push(function () {
			equip.oDvl.Renderer.BeginGesture((ev.center.x  - equip.offsetX) * equip.dpi_scale, (ev.center.y - equip.offsetY) * equip.dpi_scale);    
		});
		touch.zooming = true;
		touch.pinchX = ev.pointers[0].clientX;
		touch.pinchY = ev.pointers[0].clientY;

		

	})

	this.hammertime.on('pinch', function(ev){
		
		touch.fingerOne = {	x: ev.pointers[0].clientX,
							y: ev.pointers[0].clientY,
						};
		touch.fingerTwo = {	x: ev.pointers[1].clientX,
							y: ev.pointers[1].clientY,
						};

		touch.separation = {	x: Math.abs(touch.fingerOne.x - touch.fingerTwo.x),
								y: Math.abs(touch.fingerOne.y - touch.fingerTwo.y),
							}	
		
		//Calculate the finger separation, but only every 3 'ticks'
		if (touch.counter == 0){
			touch.oldSeperation = touch.separation;	
		}else if(touch.counter == 3){
			//calculate separation
			touch.deltaSeparation = {	x: touch.separation.x - touch.oldSeperation.x,
								y: touch.separation.y - touch.oldSeperation.y,
								total: Math.sqrt((touch.separation.x - touch.oldSeperation.x)^2 + (touch.separation.y - touch.oldSeperation.y)^2)
							}		
			//reset counter
			touch.counter = 0;
		}

		touch.counter++;
		
		
		if(Math.abs(touch.deltaSeparation.x) > touch.thresh || Math.abs(touch.deltaSeparation.y) > touch.thresh ){
			//Finger separation is greater than threshold... therefore we are zooming
			window.clearTimeout(touch.timeoutHandle);
			touch.timeoutHandle = window.setTimeout(touch.zoomTimerFunction, touch.timeOutInterval);
			touch.rotateAvailable = false;
			touch.distance = ev.distance - touch.distance;
				

			if(ev.additionalEvent == "pinchout"){
				touch.distance = -1 * touch.distance;
			}else if (ev.additionalEvent == "pinchin"){
				touch.distance = Math.abs(touch.distance);
			}

			if(touch.zooming){
				var z = 1 - (touch.distance / 150);
				if(z < 0.95){
					z = 0.95;
				}else if (z > 1.05){
					z = 1.05;
				}

				equip.oDvl.Helpers.CommandQueue.push(function () {
					equip.oDvl.Renderer.Zoom(z);
				});
			}
		}else{
			//Finger separation is less than threshold, therefore we are panning
			var dx = ev.center.x - touch.multiTouchX;
			var dy = ev.center.y - touch.multiTouchY;

			touch.multiTouchX = ev.center.x;
			touch.multiTouchY = ev.center.y;

			equip.oDvl.Helpers.CommandQueue.push(function () {
				equip.oDvl.Renderer.Pan(dx, dy);    
			});
			
		}
	});

	this.hammertime.on('pinchend', function(ev){
		equip.oDvl.Helpers.CommandQueue.push(function () {
			equip.oDvl.Renderer.EndGesture();
		});
		touch.zooming = false;
	});


	/******* 
		Tap controls

	*********/

	/*hammertime.on('tap', function(ev){

		if(ev.pointerType == "mouse"){
			return
		}
		console.log("tap from finger")
		if(selectAvailable){
			oDvl.Helpers.CommandQueue.push(function () {
				oDvl.Renderer.Tap(ev.center.x * dpi_scale, ev.center.y * dpi_scale);
			});
		}
		
	});*/

	this.hammertime.on('rotatestart', function(ev){
		
		console.log('pinch start');
	})

	this.hammertime.on("hammer.inputstart", function(ev) {
	   if (ev.pointers.length == 3){
	   	console.log(ev);
	   }
	});


	this.zoomTimerFunction = function(){
		console.log('zooming finished')
		touch.rotateAvailable = true;
	}

	this.rotateTimerFunction = function(){
		console.log('rotating finished')
		touch.selectAvailable = true;
	}
}




