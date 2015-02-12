'use strict';
/*eslint consistent-this:[2,  "yooSideMenuContentCtrl"] */
var directivename = 'yooSideMenuContent';

module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {
        var yooSideMenuContentCtrl = this;
        yooSideMenuContentCtrl.directivename = directivename;
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = [app.name + '.famousHelper', '$timeline'];
    var directive = function(famousHelper, $timeline) {
        return {
            restrict: 'E',
            scope: true,
            controller: controller,
            controllerAs: 'yooSideMenuContentCtrl',
            require: ['yooSideMenuContent', '^yooSideMenus'],
            bindToController: true,
            compile: function(tElement, tAttrs) {
                famousHelper.manualTransclude(require('./yooSideMenuContent.html'), tElement, 'fa-surface', '<fa-surface></fa-surface>');
                var surfaces = tElement.find('fa-surface');

                surfaces.attr('fa-pipe-to', 'yooSideMenusCtrl.eventHandler');
                surfaces.attr('class', 'full-height');
                //surfaces.attr('fa-z-index', 'yooSlideBoxCtrl.pages - yooSlideCtrl.pageIndex');

                return {
                    pre: function(scope, element, attrs, ctrls) {

                    },
                    post: function(scope, element, attrs, ctrls) {
                        // copying parent controller on the local scope, so we have easy access in the template
                        var yooSideMenusCtrl = ctrls[1];
                        //var yooSideMenuContentCtrl = ctrls[0];
                        scope.yooSideMenusCtrl = yooSideMenusCtrl;

                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
