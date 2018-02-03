"use strict"

var nodeController = {};

nodeController.stim_time = (node) => {
    if (node.element_type != 'stimulator') return
    var nodeDefaults = app.config.nest('node');
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    var options = nodeDefaults.stim_time;
    options.max = app.data.sim_time;
    options.value = [(node.params.start || 0), (node.params.stop || app.data.sim_time)]
    app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', (d) => {
            node.params.start = d.value[0]
            delete node.params.stop
            if (d.value[1] < app.data.sim_time) {
                node.params.stop = d.value[1]
            }
            app.simulation.simulate.init()
        })
    nodeElem.find('#stim_timeVal').on('change', function() {
        var values = $(this).val().split(',')
        for (var idx in values) {
            var value = values[idx];
            var valid = app.validation.validate(value, 'number')
            $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
            $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
            $(this).parents('.form-group').find('.help-block').html(valid.error)
            if (valid.error != null) return
        }
        var start = values[0];
        var stop = values[1];
        if (stop <= start) {
            $(this).parents('.form-group').find('.help-block').html('Start value should be smaller that stop value.')
            return
        }
        node.params.start = parseFloat(start);
        node.params.stop = parseFloat(stop);
        app.slider.update_nodeSlider(node)
        app.simulation.simulate.init()
    })
}

module.exports = nodeController;