﻿$(function () {
    "use strict";

    var viewModel = function () {

        var
            logger = window.console || {
                log: function () { },
                debug: function () { }
            },      

            programId,

            jobId,

            hub,

            jobName = ko.observable(),

            browsers = ko.observableArray(),

            runResults = ko.observableArray(),

            statusChanged = function (data) {

            },

            parseIds = function () {
                programId = parseValueFromInput('programId');
                jobId = parseValueFromInput('jobId');

                return !isNaN(jobId) && !isNaN(programId);
            },

            parseValueFromInput = function (id) {
                var $input = $('#' + id);

                if ($input.length > 0) {
                    return parseInt($input.val(), 10);
                }
                else {
                    return NaN;
                }
            },

            hubCallbacks = {
                statusChanged: statusChanged
            },

            mapJobStatusData = function (data) {
                logger.debug('Subscription successful.');

                jobName(data.JobName);
            },

            subscriptionFailed = function (data) {
                //logger.error(data);

                //TODO: show msg to user
                jobName('not working'); // temp
            },

            hubStarted = function () {
                logger.log("Hub started");

                hub.server.subscribeTo(jobId)
                    .done(mapJobStatusData)
                    .fail(subscriptionFailed);
            },

            startHubFailed = function (msg) {
                //logger.error(data);

                //TODO: show msg to user
                jobName('not working'); // temp
            },

            startHub = function () {
                hub = $.connection.jobStatusHub;

                $.extend(hub.client, hubCallbacks);

                logger.log('Starting hub...');

                $.connection.hub.start()
                    .done(hubStarted)
                    .fail(startHubFailed);
            },

            init = function () {
                if (parseIds()) {
                    startHub();
                }
            };

        init();

        return {
            jobName: jobName,
            browsers: browsers,
            runResults: runResults
        };
    }();

    ko.applyBindings(viewModel);
});