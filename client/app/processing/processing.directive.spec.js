'use strict';

describe('Directive: processing', function () {

  // load the directive's module
  beforeEach(module('midiserverApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<processing></processing>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the processing directive');
  }));
});