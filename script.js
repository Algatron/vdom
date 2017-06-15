
require.config({
    paths: {
        'virtual-dom': './node_modules/virtual-dom/dist/virtual-dom'
    }
});

require(['virtual-dom'], function(vdomlib) {

    function getSlot(slot) {
        var slotH = vdomlib.h('div.slot#slot-' + slot.id, [getComponent({id: 324234}), getComponent({id: 9889890})]);
        return slotH;
    }

    function getComponent(component) {
        return vdomlib.h('div', {
            className: 'component-' + component.id,
            style: {
                backgroundColor: 'green',
                textAlign: 'center',
                border: '1px solid red',
                width: '10px',
                height: '40px'
            }
        });
    }

    function render(data) {
        return vdomlib.h('div.container#container', [
            getSlot({id: 123}),
            getSlot({id: 456}),
            getSlot({id: 789}),
        ]);
    }

    // 2: Initialise the document
    var count = 0;      // We need some app data. Here we just store a count.

    var tree = render(count);               // We need an initial tree

    var rootNode = vdomlib.create(tree);     // Create an initial root DOM node ...
    document.body.appendChild(rootNode);    // ... and it should be in the document

    // 3: Wire up the update logic
    setInterval(function () {
        count++;
        var newTree = render(count);
        var patches = vdomlib.diff(tree, newTree);
        rootNode = vdomlib.patch(rootNode, patches);
        tree = newTree;
    }, 1000);

});
