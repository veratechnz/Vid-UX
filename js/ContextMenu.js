function ContextMenu(equip){

  var scope = this;

  this.activate3DContextMenu = function(nodeID, mouse){
     
     var node = equip.findNodeById(nodeID);


      var container = $('<div id="context-3D-menu"></div>');
      $('body').append(container);
      $(container).load('./templates/context_3D_menu_template.html', function(){
          
          $('#context-3D-menu').find('.context-3D-menu').css({
              
              'top' : mouse.y + equip.offsetY - 84 - 15,
              'left': mouse.x + equip.offsetX - 4 - 15
              
          });
          
          //button handlers:

          $('#context-3D-menu').find("#context-3D-section").data('node', node)
          $('#context-3D-menu').find("#context-3D-section").click(function(e){
             e.stopPropagation();
             var node = $(this).data('node');

              var isolate;
              var parents = [];

              for (var i = 0; i < node.parentNodes.length; i++) {
                  parents.push(equip.findNodeById(node.parentNodes[i]));
              };            
              
              isolate = parents[parents.length - 1];          
              
              equip.isolateNode(isolate);

             
             scope.remove3DContextMenu();
          })

          $('#context-3D-menu').find("#context-3D-area").data('node', node)
          $('#context-3D-menu').find("#context-3D-area").click(function(e){
             e.stopPropagation();
             var node = $(this).data('node');

              var isolate;
              var parents = [];

              for (var i = 0; i < node.parentNodes.length; i++) {
                  parents.push(equip.findNodeById(node.parentNodes[i]));
              };            
              
              isolate = parents[parents.length - 2];          
              
              equip.isolateNode(isolate);

             console.log($(this).data('node'));
             scope.remove3DContextMenu();
          })

          $('#context-3D-menu').find("#context-3D-hide").data('node', node)
          $('#context-3D-menu').find("#context-3D-hide").click(function(e){
             e.stopPropagation();
             var node = $(this).data('node');
             equip.hideNode(node);
             equip.visibilityChanged(node)
             scope.remove3DContextMenu();
          })
      })

  }

  this.remove3DContextMenu = function(){
      $('#context-3D-menu').fadeOut(400, function(){
          $(this).remove();
      });
  }
}
