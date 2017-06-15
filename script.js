

// Definition of a component/slot
//     property            default value
// {
//     id,                 [""]
//     type:               [""]
//     components:         []  //only for slots
//     view: {
//         class,          [""]
//         hasTemplate,    [false]
//         showHeader,     [true]
//     }
// }

var slots = [
    {
        id: 'slot001',
        type: 'header',
        view: {
            class: '',
            hasTemplate: true,
            showHeader: false
        },
        components: [{
            id: 'component001',
            type: 'banner',
            view: {
                hasTemplate: true
            }
        },{
            id: 'component003',
            type: 'paragraph',
            view: {
                hasTemplate: false
            }
        },{
            id: 'component004',
            type: 'paragraph',
            view: {
                hasTemplate: false
            }
        }]
    },
    {
        id: 'slot002',
        type: 'middle',
        view: {
            class: 'hellothere',
            hasTemplate: false
        },
        components: []
    },
    {
        id: 'slot003',
        type: 'footer',
        view: {
            hasTemplate: true
        },
        components: [{
            id: 'component002',
            type: 'paragraph',
            view: {
                hasTemplate: true
            }
        }]
    }
];

var loadingDelays = {
    components: {
        slot002: 2000,
        component002: 1000,
        component003: 3000
    },
    content: {
        component001: 4000
    }
};

var INSERTION_POINT;

$(document).ready(function() {
    INSERTION_POINT = $("#insertion-point");
    slots.forEach(function(slot, index) {
        loadSlot(slot, index);
    });
});

function addSlotToPageAndProcessComponents(slotElement, slot, slotIndex) {
    // INSERTION_POINT.append(slotElement);
    insertAtIndex(INSERTION_POINT, slotElement, slotIndex);
    window.setTimeout(loadComponents.bind(this, slot), 0);
}

function addComponentToSlot(slotName, componentElement, componentIndex) {
    var slotElement = $('#' + slotName).children().first();
    insertAtIndex(slotElement, componentElement, componentIndex);
}

function insertAtIndex(root, element, index) {
    var siblings = root.children('[data-component-index]');
    if (siblings.length == 0) {
        root.append(element);
        return;
    }
    for (var i = 0; i < siblings.length; i++) {
        var jqSibling = $(siblings[i]);
        var currentIndex = Number(jqSibling.attr('data-component-index'));
        if (currentIndex > index) {
            jqSibling.before(element);
            return;
        }
    }
    // if we get to here its the last element
    root.append(element);
}

function loadSlot(slot, slotIndex) {
    var slotElement = createElement(slot, true);
    addSlotAttributes(slot, slotElement, slotIndex);
    var componentLoadDelay = getComponentLoadDelay(slot.id);
    var addSlotFunction = addSlotToPageAndProcessComponents.bind(this, slotElement, slot, slotIndex);
    if (componentLoadDelay <= 0) {
        addSlotFunction();
    } else {
        window.setTimeout(addSlotFunction, componentLoadDelay);
    }
}

function loadComponents(slot) {
    slot.components.forEach(function(component, componentIndex) {
        var componentElement = createElement(component, false);
        addComponentAttributes(component, componentElement, componentIndex);
        var componentLoadDelay = getComponentLoadDelay(component.id);
        var addToSlotFunction = addComponentToSlot.bind(this, slot.id, componentElement, componentIndex);
        if (componentLoadDelay <= 0) {
            addToSlotFunction();
        } else {
            window.setTimeout(addToSlotFunction, componentLoadDelay);
        }
    });
}

function getTemplateUrl(config, isSlot) {
    return './' + (isSlot ? 'slots/' : 'components/') + config.id + '.html';
}

function createElement(config, isSlot) {
    var element = $('<div>');
    var contentRoot = $('<div>');
    if (!(config.view && config.view.showHeader === false)) {
        element.html('<span>' + config.id + '<span>');
    }
    if (config.view && config.view.hasTemplate) {
        contentRoot.load(getTemplateUrl(config, isSlot));
    }
    var loadContentFunction = function() {
        element.append(contentRoot);
    };
    var contentLoadDelay = getContentLoadDelay(config.id);
    if (contentLoadDelay <= 0) {
        loadContentFunction();
    } else {
        window.setTimeout(loadContentFunction, contentLoadDelay);
    }
    return element;
}

function addSlotAttributes(slot, slotElement, index) {
    slotElement.attr('id', slot.id);
    slotElement.attr('class', 'slot yCmsContentSlot smartEditComponent ' + (slot.view && slot.view.class ? slot.view.class : ""));
    addCommonAttributes(slot, slotElement, index);
}

function addComponentAttributes(component, componentElement, index) {
    componentElement.attr('id', component.id);
    componentElement.attr('class', 'component');
    addCommonAttributes(component, componentElement, index);
}

function addCommonAttributes(config, element, index) {
    element.attr('data-smartedit-component-id', config.id);
    element.attr('data-smartedit-component-uuid', config.id);
    element.attr('data-smartedit-component-type', config.type);
    element.attr('data-component-index', index);
}

function getComponentLoadDelay(id) {
    return loadingDelays.components[id] || 0;
}

function getContentLoadDelay(id) {
    return loadingDelays.content[id] || 0;
}

