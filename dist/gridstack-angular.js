/**
 * gridstack-angular - Angular Gridstack.js directive
 * @version v0.6.0-dev
 * @author Kevin Dietrich
 * @link https://github.com/kdietrich/gridstack-angular#readme
 * @license MIT
 */
(function() {
'use strict';

angular.module('gridstack-angular', []);

var app = angular.module('gridstack-angular');

app.controller('GridstackController', ['$scope', function($scope) {

  var gridstack = null;

  this.init = function(element, options) {
    gridstack = element.gridstack(options).data('gridstack');
    return gridstack;
  };

  this.removeItem = function(element) {
    if(gridstack) {
      return gridstack.removeWidget(element, false);
    }
    return null;
  };

  this.addItem = function(element) {
    if(gridstack) {
      gridstack.makeWidget(element);
      return element;
    }
    return null;
  };

}]);
})();
(function() {
'use strict';

var app = angular.module('gridstack-angular');

app.directive('gridstack', ['$timeout', function($timeout) {

  return {
    restrict: 'A',
    controller: 'GridstackController',
    scope: {
      onChange: '&',
      onDragStart: '&',
      onDragStop: '&',
      onResizeStart: '&',
      onResizeStop: '&',
      gridstackHandler: '=?',
      options: '='
    },
    link: function(scope, element, attrs, controller, ngModel) {

      var gridstack = controller.init(element, scope.options);
      scope.gridstackHandler = gridstack;

      element.on('change', function(e, items) {
        $timeout(function() {
          scope.$apply();
          scope.onChange({event: e, items: items});
        });
      });

      element.on('dragstart', function(e, ui) {
        scope.onDragStart({event: e, ui: ui});
      });

      element.on('dragstop', function(e, ui) {
        $timeout(function() {
          scope.$apply();
          scope.onDragStop({event: e, ui: ui});
        });
      });

      element.on('resizestart', function(e, ui) {
        scope.onResizeStart({event: e, ui: ui});
      });

      element.on('resizestop', function(e, ui) {
        $timeout(function() {
          scope.$apply();
          scope.onResizeStop({event: e, ui: ui});
        });
      });

    }
  };

}]);
})();

(function() {
'use strict';

var app = angular.module('gridstack-angular');

app.directive('gridstackItem', ['$timeout', function($timeout) {

  return {
    restrict: 'A',
    controller: 'GridstackController',
    require: '^gridstack',
    scope: {
      gridstackItem: '=',
      onItemAdded: '&',
      onItemRemoved: '&',
      gsItemId: '=?',
      gsItemX: '=',
      gsItemY: '=',
      gsItemWidth: '=',
      gsItemHeight: '=',
      gsItemAutopos: '=',
      gsItemMinHeight: '=?',
      gsItemMaxHeight: '=?',
      gsItemMinWidth: '=?',
      gsItemMaxWidth: '=?'
    },
    link: function(scope, element, attrs, controller) {
      var jqElement = $(element);

      if (scope.gsItemId) {
        jqElement.attr('data-gs-id', scope.gsItemId);
      }
      jqElement.attr('data-gs-x', scope.gsItemX);
      jqElement.attr('data-gs-y', scope.gsItemY);
      jqElement.attr('data-gs-width', scope.gsItemWidth);
      jqElement.attr('data-gs-height', scope.gsItemHeight);
      jqElement.attr('data-gs-min-width', scope.gsItemMinWidth);
      jqElement.attr('data-gs-min-height', scope.gsItemMinHeight);
      jqElement.attr('data-gs-max-width', scope.gsItemMaxWidth);
      jqElement.attr('data-gs-max-height', scope.gsItemMaxHeight);
      jqElement.attr('data-gs-auto-position', scope.gsItemAutopos);
      var widget = controller.addItem(element);
      var item = element.data('_gridstack_node');
      $timeout(function() {
        scope.onItemAdded({item: item});
      });

      item._grid.container.on('change', function(ev, elements) {
        if (!elements) {
          return;
        }

        var i, element;
        for(i = 0; i < elements.length; i++) {
          element = elements[i];
          if(element.el.get(0) == jqElement.get(0)) {
            scope.gsItemId = element.id;
            scope.gsItemX = element.x;
            scope.gsItemY = element.y;
            scope.gsItemWidth = element.width;
            scope.gsItemHeight = element.height;
          }
        }
      });

      element.bind('$destroy', function() {
        var item = element.data('_gridstack_node');
        scope.onItemRemoved({item: item});
        controller.removeItem(element);
      });

    }

  };

}]);
})();
