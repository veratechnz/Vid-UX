// New Custom  JS

  
var MYAPP = MYAPP || {};


   MYAPP.nameSpace = function (ns_string) {
        var parts = ns_string.split('.'),
            parent = MYAPP,
            pl, i;

        //Strip redundant leading global    
        if (parts[0] == "MYAPP") {
            parts = parts.slice(1);
        }

        pl = parts.length;
        for (i = 0; i < pl; i++) {
            //create a property if it doesnt exist
            if (typeof parent[parts[i]] == 'undefined') {
                parent[parts[i]] = {};
            }

            parent = parent[parts[i]];
        }

        return parent;
    };

  // Popup Images
   MYAPP.galleryReady = function () {
    
    $('#popImagesA').magnificPopup({
      delegate: 'a',
      type: 'image',
      tLoading: 'Loading image #%curr%...',
      mainClass: 'mfp-img-mobile',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0,1] // Will preload 0 - before current, and 1 after the current image
      },
      image: {
        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
        titleSrc: function(item) {
          return item.el.attr('title') + '';
        }
      }
    });

    // Popup Video
    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });

  };

  // Textualize Text Effects
  MYAPP.textEffect = function () {

  	var list = ['THAMES DRAINAGE & DIGGING'];  // list of blurbs

  	var txt = $('#txtlzr');  // The container in which to render the list

  	var options = {
  	  duration: 2000,          // Time (ms) each blurb will remain on screen
  	  rearrangeDuration: 5, // Time (ms) a character takes to reach its position
  	  effect: 'random',        // Animation effect the characters use to appear
  	  centered: true           // Centers the text relative to its container
  	};

  	txt.textualizer(list, options); // textualize it!
  	txt.textualizer('start'); // start
  };


  //Display the year in the footer
  MYAPP.yearDisplay = function () {
    
    var year = new Date().getFullYear();
    var footSpan = document.getElementById('theYear');
    footSpan.textContent = year;


  };


// Angles Tag line roatation and display in hero unit. 
  MYAPP.tagLines = function () {

    var divs = $('h4[id^="tagLine"]').hide(),
        i = 0;

        setTimeout(function(){ 

          (function cycle(){
            divs.eq(i).fadeIn(1000)
                      .delay(2500)
                      .fadeOut(1000, cycle);
            i = ++i % divs.length; // increment i,           
          })();


         }, 3000);

  };

  MYAPP.init = function () {
      
      MYAPP.textEffect();
      MYAPP.galleryReady();
      MYAPP.yearDisplay();  
      MYAPP.tagLines();

  };


  // sample usage:
  // extend myApp with a deeply nested namespace
  var mod = MYAPP.nameSpace('MYAPP.modules.module2');
  // the correct object with nested depths is output
  console.log(mod);
  // minor test to check the instance of mod can also
  // be used outside of the myApp namesapce as a clone
  // that includes the extensions
  console.log(mod == MYAPP.modules.module2); //true
  // further demonstration of easier nested namespace
  // assignment using extend
  MYAPP.nameSpace('moduleA.moduleB.moduleC.moduleD');
  MYAPP.nameSpace('longer.version.looks.like.this');
  console.log(MYAPP);



window.onload = MYAPP.init();


//Ending
