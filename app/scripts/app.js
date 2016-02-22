/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  


  app.handleResponse = function(ev) {
    var athJson = app.ajaxAth;

    athJson.map(function(el) {
      el.toString = function() {
        return el.name;
      };
    });

    app.$.searchText.items = athJson;
    
  };
  
  app.itemSelected = function(ev) {
    var meetJson = app.ajaxResponsess;
    var fcd = meetJson.filter(function (el) {
        return  el.gender == ev.currentTarget.selected;
    });
    var chartData = fcd.map(function(el) {
      return [
          el.bweight,
          el.total,
          el.name + " (" + el.total + ")"
      ];
    });

    var filteredChartData = chartData.filter(function (el) {
      return  el[1] > 0;
    });
    filteredChartData.unshift(["Body Weight", "Total", {'type': 'string', 'role': 'tooltip'}]);
    app.$.meetChart.data = filteredChartData;
    app.$.meetChart.drawChart();
  }

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };
  


  //global vars
  var arrWc = ['W48', 'W53', 'W63', 'W69', 'W75', 'Wp75', 'M56', 'M62', 'M69', 'M77', 'M85', 'M94', 'M105', 'Mp105'];
  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
    //var app = document.querySelector('#app');
      
  });
  app.listenerMethod = function(ev) {
        var selected = ev.currentTarget.selection.selected();
        if (selected.length == 1) {
      
          var selectedIndex = selected[0];
          ev.currentTarget.getItem(selectedIndex, function(err, item) {
            if (!err) {
              app.selected = item;
              app.meetId = item.eventId
              //app.$.maj.params  = {"t": 1, "meetId": app.meetId };
              //app.$.maj.generateRequest();
              page.show("/meet/" + app.meetId);
              
          } 
          else {
            console.log(err);
          }
        });
      } else {
        app.selected = null;
      }
    };

    app.handleMeetResponse = function(ev) {
        
        var meetJson = app.ajaxResponsess;
        var ObjMeet = {};

        meetJson.reduce(function(previousValue, currentValue, currentIndex, array) {
          if(!ObjMeet.hasOwnProperty(currentValue.gender + currentValue.category)) {
            ObjMeet[currentValue.gender + currentValue.category] = [currentValue];
          }
          else {
            ObjMeet[currentValue.gender + currentValue.category].push(currentValue);
          }
            return ObjMeet;
        });

        /*
        for (var i = 0; i < arrWc.length; i++ ) {
          if (typeof ObjMeet[arrWc[i]] != "undefined") {
            //app.$.meetTemp[arrWc[i]].items = ObjMeet[arrWc[i]];
            document.querySelector("#" + arrWc[i]).items =  ObjMeet[arrWc[i]];
          }
        }
        */
        var arrMeet = Object.keys(ObjMeet).map(function(k) { return ObjMeet[k] });
        document.querySelector("#meetTemp").items =  arrMeet;
        document.querySelector("#meetTemp").render();
        console.log(ObjMeet);
        
        /*
        var men = meetJson.filter(function (el) {
          return  el.gender == "M";
        });
        var chartData = men.map(function(el) {
          return [
              el.bweight,
              el.total,
              el.name + " (" + el.total + ")"
          ];
        });

        var filteredChartData = chartData.filter(function (el) {
          return  el[1] > 0;
        });
        

        filteredChartData.unshift(["Body Weight", "Total", {'type': 'string', 'role': 'tooltip'}]);
        app.$.meetChart.options = {
          legend: 'none',
          crosshair: { trigger: 'both' }, // Display crosshairs on focus and selection.
          trendlines: { 0: {} } 
        };


        


        //app.$.meetChart.data = filteredChartData;

        */



      };
  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
      var btn = app.$.btnTogMen;
      
      var grid = app.$.myGrid;
      //var meetGrid = app.$.meetGrid;
      var athGrid = app.$.athGrid;
      var combobox = app.$.searchText;
      combobox.addEventListener('value-changed', function() {
        var l_athleteId = combobox.value.athleteId;

          
          app.athleteName = combobox.value.name;
          
          page.show("/athlete/" + l_athleteId);
      });
      

      


      

      //handle Meet response from iron-ajax and put each category in own table

      
      

      

    

    app.showSearch = function(ev) {
      app.$.searchText.style.visibility = "visible";
    };

    app.sortResponses = function (e) {
      var idx = grid.sortOrder[0].column;
      var lesser = grid.sortOrder[0].direction == 'asc' ? -1 : 1;
      app.ajaxResponses.sort(function(a, b) {
        return (a[idx] < b[idx]) ? lesser : -lesser;
      });
    };
  });



  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  window.addEventListener('paper-header-transform', function(e) {
    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    // appName max size when condensed. The smaller the number the smaller the condensed size.
    var maxMiddleScale = 0.50;
    var auxHeight = heightDiff - detail.y;
    var auxScale = heightDiff / (1 - maxMiddleScale);
    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

})(document);
