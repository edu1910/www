'use strict';

/* global toastr: false */
/* global constants: false */

var app = angular.module('atadosApp');

app.controller('ProjectEditCtrl', function($scope, $filter, $state, $stateParams, Restangular, Project) {

  if (!$scope.loggedUser || $scope.loggedUser.role !== constants.NONPROFIT) {
    $state.transitionTo('root.home');
    toastr.error('Precisa estar logado como ONG do ato para editar');
  } else {
    var foundProject = false;
    $scope.loggedUser.projects.forEach(function(p) {
      if (p.slug === $stateParams.slug) {
        foundProject = true;
        $scope.project = p;
        return;
      }
    });
    if (!foundProject) {
      $state.transitionTo('root.home');
      toastr.error('A ONG logada não é dona deste ato e não tem acesso de edição.');
    }
  }

  for (var period = 0; period < 3; period++) {
    var periods = [];
    $scope.work.availabilities.push(periods);
    for (var weekday = 0; weekday < 7; weekday++) {
      periods.push({checked: false, weekday: weekday, period: period});
    }
  }

  $scope.$watch('project.name', function (value) {
    if (value) {
      Project.getSlug(value, function(success) {
        $scope.project.slug = success.slug;
      }, function (error) {
        console.error(error);
      });
    }
  });

  $scope.$watch('short_facebook_event', function (value) {
    $scope.project.facebook_event = 'https://www.facebook.com/events/' + value;
  });

  $scope.cityLoaded = false;

  $scope.$watch('start_date', function (value) {
    if (value) {
      $scope.job.start_date = value.getTime();
    }
  });
  $scope.$watch('end_date', function (value) {
    if (value) {
      $scope.job.end_date = value.getTime();
    }
  });

  $scope.$watch('project.address.state', function (value) {
    $scope.cityLoaded = false;
    $scope.stateCities = [];
    if (value && !value.citiesLoaded) {
      Restangular.all('cities').getList({page_size: 3000, state: value.id}).then(function (response) {
        response.forEach(function(c) {
          $scope.stateCities.push(c);
          if (!c.active) {
            $scope.cities().push(c);
          }
        });
        value.citiesLoaded = true;
        $scope.cityLoaded = true;
      });
    } else if(value){
      var cities = $scope.cities();
      cities.forEach(function (c) {
        if (c.state.id === $scope.project.address.state.id) {
          $scope.stateCities.push(c);
        }
      });
      $scope.cityLoaded = true;
    }
  });


  $scope.uploadProjectImage = function(files) {
    if (files) {
      if (!$scope.files) {
        $scope.files = new FormData();
      }
      $scope.files.append('image', files[0]);
      $scope.imageUploaded = true;
      $scope.$apply();
      return;
    }
    $scope.imageUploaded = false;
    $scope.$apply();
  };

  $scope.addCause = function(cause) {
    cause.checked = !cause.checked;
    if (cause.checked) {
      $scope.project.causes.push(cause);
    } else {
      var index = $scope.project.causes.indexOf(cause);
      if (index > -1) {
        $scope.project.causes.splice(index, 1);
      }
    }
    if ($scope.project.causes.length !== 0) {
      $scope.causeChoosen = true;
    } else {
      $scope.causeChoosen = false;
    }
  };

  $scope.addSkill = function(skill) {
    skill.checked = !skill.checked;
    if (skill.checked) {
      $scope.project.skills.push(skill);
    } else {
      var index = $scope.project.skills.indexOf(skill);
      if (index > -1) {
        $scope.project.skills.splice(index, 1);
      }
    }
    if ($scope.project.skills.length !== 0) {
      $scope.skillChoosen = true;
    } else {
      $scope.skillChoosen = false;
    }
  };

  $scope.minDate = new Date();
  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  
  $scope.removeRole = function (role) {
    $scope.project.roles.splice($scope.project.roles.indexOf(role), 1);
  };

  $scope.addRole = function (role) {
    if (role.vacancies && role.name && role.details) {
      $scope.project.roles.push($scope.newRole);
      $scope.newRole = {};
    } else {
      toastr.error('Esqueceu alguma informação do cargo?');
    }
  };

  $scope.createProject = function () {
    if ($scope.jobActive) {
      $scope.project.job = $scope.job;
    } else {
      $scope.project.work = $scope.work;
      var ava = [];
      $scope.work.availabilities.forEach(function (period) {
        period.forEach(function (a) {
          if (a.checked) {
            ava.push(a);
          }
        });
      });
      $scope.work.availabilities = ava;
    }

    $scope.files.append('project', angular.toJson($scope.project));

    Project.create($scope.files, function () {
      toastr.success('Ato criado com sucesso. Agora espere o Atados entrar em contato para aprovação');
      $scope.loggedUser.projects.push($scope.project);
      $state.transitionTo('root.nonprofitadmin' , {slug: $scope.loggedUser.slug});
    }, function (error) {
      console.error(error);
      toastr.error('Não consigo criar novo Ato. Entre em contato com o Atados.');
    });
  };
});
