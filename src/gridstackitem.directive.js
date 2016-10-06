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
