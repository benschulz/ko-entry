'use strict';

define(['knockout'], function (ko) {
    var BINDING_NAME = 'entry';
    var BINDING_NAME_OPTIONAL = 'optionalEntry';
    var OPTION_ENTRY_ID = 'identifiedBy';
    var OPTION_DATA_SOURCE = 'from';
    var OPTION_ENTRY_NAME = 'as';
    var DEFAULT_ENTRY_NAME = 'entry';

    createBinding(BINDING_NAME_OPTIONAL, true);
    return createBinding(BINDING_NAME, false);

    function createBinding(name, optional) {
        var binding = ko.bindingHandlers[name] = {
            'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var value = ko.unwrap(valueAccessor()),
                    dataSource = value && value[OPTION_DATA_SOURCE]
                        || allBindingsAccessor.has(OPTION_DATA_SOURCE) && allBindingsAccessor.get(OPTION_DATA_SOURCE),
                    entryName = value && value[OPTION_ENTRY_NAME]
                        || allBindingsAccessor.has(OPTION_ENTRY_NAME) && allBindingsAccessor.get(OPTION_ENTRY_NAME)
                        || DEFAULT_ENTRY_NAME;

                var bindingContextExtension = {};
                bindingContextExtension[entryName] = ko.observable(null);

                var innerHtml = element.innerHTML,
                    extendedBindingContext = bindingContext.extend(bindingContextExtension),
                    displaying = false;

                element.innerHTML = '';

                var entryView = null,
                    computer = ko.computed(function () {
                        var value = ko.unwrap(valueAccessor()),
                            entryId = ko.unwrap(value && value[OPTION_ENTRY_ID] || value),
                            newEntryView = entryId && dataSource.openOptionalEntryView(entryId),
                            observable = newEntryView && newEntryView.observable,
                            display = !!(optional || newEntryView && observable);

                        if (display) {
                            extendedBindingContext[entryName](observable);
                            if (!displaying) {
                                element.innerHTML = innerHtml;
                                ko.applyBindingsToDescendants(extendedBindingContext, element);
                            }
                        }
                        else if (displaying)
                            while (element.firstChild)
                                ko.removeNode(element.firstChild);

                        if (entryView)
                            entryView.dispose();
                        entryView = newEntryView;
                        displaying = display;
                    });

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    computer.dispose();
                    if (entryView)
                        entryView.dispose();
                });

                return {'controlsDescendantBindings': true};
            }
        };

        return binding;
    }
});