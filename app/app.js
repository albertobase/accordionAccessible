'use strict';
var app = {};
jQuery(document).ready(function() {
    app.main = (function() {
        var settings = {
                target: '.js-accordion',
                accordionList: '.js-accordions-list',
                accordionListItem: '.js-accordionlist-item',
                accordionListLink: '.js-accordionlist-link',
                accordionPanelItem: '.js-accordions-panel-item',
                active: 'active',
                classAccordion: 'accordionItems_',
                contadorAccordions: 1,
                itemActivate: 'itemActivate',
                itemsWorking: 'itemsWorkingAccordion',
                expanded: false
            },
            init = function() {
                accordion();
            },
            accordion = function() {
                var $accordionElements = $(settings.target);
                if ($accordionElements.length > 0) {
                    $accordionElements.each(function() {
                        var container = $(this);
                        accordionItem(container);
                    });
                }
            },

            accordionItem = function($elem) {
                var $elementsLinks = selectedElementsWorkings($elem, settings.accordionListLink);

                $elementsLinks.on('click', function(event) {
                    event.preventDefault();
                    var $this = $(this),
                        $parent = $this.parents(settings.target + ":first"),
                        $accordionListItems = $parent.find(settings.accordionListItem);

                    markElementsWorkings($parent, settings.accordionListItem);
                    markElementsWorkings($parent, settings.accordionListLink);
                    markElementsWorkings($parent, settings.accordionPanelItem);

                    //busco todos los accordions y los reseteo
                    if ($accordionListItems.length > 0) {
                        $accordionListItems.find(settings.accordionListLink + "." + settings.itemsWorking)
                            .attr('tabindex', '-1')
                            .attr('aria-selected', 'false');
                    }

                    var $parentActivate = $this.parents(settings.accordionListItem + ":first");
                    var $panelActivate = $('#' + $this.attr('aria-controls'));
                    //si el elemento clicado esta activo
                    if ($parentActivate.hasClass(settings.active)) {
                        //cerrar
                        $panelActivate.slideUp(function() {
                            $parentActivate
                                .removeClass(settings.active);
                            $this
                                .attr('tabindex', '0')
                                .attr('aria-selected', 'true')
                                .attr('aria-expanded', 'false');
                            deleteElementsWorkings();
                        });

                    } else { //si el elemento clicado no esta activo
                        $panelActivate.addClass(settings.itemActivate);
                        //cerrar los otros paneles;
                        var $accordionPanelItems = $parent.find(settings.accordionPanelItem + ':not(.' + settings.itemActivate + ')' + "." + settings.itemsWorking);

                        var $accordionItemActive = $parent.find(settings.accordionListItem + "." + settings.itemsWorking);
                        $accordionItemActive.removeClass(settings.active);

                        $accordionPanelItems.slideUp(function() {
                            $accordionPanelItems
                                .attr('aria-hidden', 'true')
                                .removeClass(settings.active);

                            $accordionListItems.find(settings.accordionListLink + "." + settings.itemsWorking)
                                .attr('tabindex', '-1')
                                .attr('aria-selected', 'false')
                                .attr('aria-expanded', 'false');
                            deleteElementsWorkings();
                        });
                        //activamos el elemento nuevo
                        $parentActivate
                            .addClass(settings.active);
                        //abrimos el panel
                        $panelActivate.slideDown(function() {
                            //cambiamos atributos enlace
                            $this
                                .attr('aria-selected', 'true')
                                .attr('aria-expanded', 'true')
                                .attr('tabindex', '0');

                            $panelActivate
                                .attr('aria-hidden', 'false')
                                .addClass(settings.active);

                            $panelActivate.removeClass(settings.itemActivate);
                            deleteElementsWorkings();
                        });
                    }
                    deleteElementsWorkings();
                });

                $elementsLinks.on('keydown', function(e) {
                    var $that = jQuery(this),
                        $parent = $that.parents(settings.target + ":first"),
                        $accordionAgrup = $that.parents(settings.accordionListItem + ":first"),
                        currentAccordion = $accordionAgrup.index(),
                        $element;

                    //marcamos los elementos en los que estamos trabajando
                    markElementsWorkings($parent, settings.accordionListItem);
                    markElementsWorkings($parent, settings.accordionListLink);

                    var $elementsAccordion = $parent.find(settings.accordionListItem + "." + settings.itemsWorking),
                        elementsAccordion = $elementsAccordion.length - 1;

                    if ($parent.attr('data-expanded') === "true") {
                        settings.expanded = true;
                    }
                    if (!(e.shiftKey && e.keyCode === 9)) {
                        if (!(e.keyCode === 9)) { //accordion
                            //e.preventDefault();
                            //key left or key up - previous accordion
                            if ((e.keyCode === 37 || e.keyCode === 38)) {
                                e.preventDefault();
                                $elementsAccordion.eq(currentAccordion).find(settings.accordionListLink + "." + settings.itemsWorking)
                                    .attr('tabindex', '-1')
                                    .attr('aria-selected', 'false');
                                if (currentAccordion <= elementsAccordion) {
                                    //there is elements-accordion on left
                                    $element = $elementsAccordion.eq(currentAccordion - 1).find(settings.accordionListLink + "." + settings.itemsWorking)
                                        .focus()
                                        .attr('tabindex', '0')
                                        .attr('aria-selected', 'true');
                                } else {
                                    if (currentAccordion == 0) {
                                        //start on last accordion again
                                        $element = $elementsAccordion.eq(elementsAccordion).find(settings.accordionListLink + "." + settings.itemsWorking)
                                            .focus()
                                            .attr('tabindex', '0')
                                            .attr('aria-selected', 'true');
                                    }
                                }
                                if (settings.expanded) {
                                    $element.trigger('click');
                                }
                            } else {

                                //key right or key down - next accordion
                                if ((e.keyCode === 39 || e.keyCode === 40)) {
                                    e.preventDefault();
                                    $elementsAccordion.eq(currentAccordion).find(settings.accordionListLink + "." + settings.itemsWorking)
                                        .attr('tabindex', '-1')
                                        .attr('aria-selected', 'false');
                                    if (currentAccordion < elementsAccordion) {
                                        //there is elements-accordion on right
                                        $element = $elementsAccordion.eq(currentAccordion + 1).find(settings.accordionListLink + "." + settings.itemsWorking)
                                            .focus()
                                            .attr('tabindex', '0')
                                            .attr('aria-selected', 'true');
                                    } else {
                                        if (currentAccordion == elementsAccordion) {
                                            //start on first accordion again
                                            $element = $elementsAccordion.eq(0).find(settings.accordionListLink + "." + settings.itemsWorking)
                                                .focus()
                                                .attr('tabindex', '0')
                                                .attr('aria-selected', 'true');
                                        }
                                    }
                                    if (settings.expanded) {
                                        $element.trigger('click');
                                    }
                                }
                            }
                        }
                    }
                });

                accordionItemAtributes($elem, $elementsLinks);
            },
            accordionItemAtributes = function($elem, $elementsLinks) {
                //iniciar atributos
                var $accordionListContainer = $elem.find(settings.accordionListItem),
                    $accordionListContainerActive = $elem.find(settings.accordionListItem + ".active");

                var $parent = $elem,
                    $accordionPanelItems = $parent.find(settings.accordionPanelItem + ":not(" + settings.active + ")"),
                    $parentActivate = $parent.find(settings.accordionListItem + '.' + settings.active),
                    $parentActivatePanel = $('#' + $parentActivate.find(settings.accordionListLink).attr('aria-controls'));

                accordionItemAtributesLink($accordionListContainer, $accordionListContainerActive, $elementsLinks);
                accordionItemAtributesPanel($accordionPanelItems, $parentActivatePanel);
            },
            accordionItemAtributesLink = function($accordionListContainer, $accordionListContainerActive, $elementsLinks) {
                //link
                $elementsLinks
                    .attr('tabindex', '-1')
                    .attr('aria-selected', 'false')
                    .attr('aria-expanded', 'false');

                if ($accordionListContainerActive.length > 0) {
                    $accordionListContainerActive
                        .find(settings.accordionListLink)
                        .attr('tabindex', '0')
                        .attr('aria-expanded', 'true')
                        .attr('aria-selected', 'true');
                } else { //si no tenemos ninguno activo dejo el atributo a 0 el del primer elemento para que se pueda acceder
                    $accordionListContainer
                        .first()
                        .find(settings.accordionListLink)
                        .attr('aria-expanded', 'true')
                        .attr('tabindex', '0');
                }
            },
            accordionItemAtributesPanel = function($accordionPanelItems, $parentActivatePanel) {
                //panels
                $accordionPanelItems
                    .attr('aria-hidden', 'true')
                    .removeClass(settings.active);
                $parentActivatePanel
                    .attr('aria-hidden', 'false')
                    .addClass(settings.active)
                    .slideDown();
            },
            //selecciona los elemenos en los que estamos trabajando le añade una clase y devuelve los elementos que necesitamos
            selectedElementsWorkings = function($parentElements, elementsSearch) {
                var $elem = $parentElements.find(elementsSearch);
                $elem.addClass(settings.itemsWorking);
                $parentElements.find(settings.target + " ." + settings.itemsWorking).removeClass(settings.itemsWorking);
                $elem = $(elementsSearch + "." + settings.itemsWorking);
                $("." + settings.itemsWorking).removeClass(settings.itemsWorking);
                return $elem;
            },
            markElementsWorkings = function($elem, elementoMarcar) {
                $elem.find(elementoMarcar).addClass(settings.itemsWorking);
                $elem.find(settings.target + " ." + settings.itemsWorking).removeClass(settings.itemsWorking);
            },
            //eliminamos elementos workings
            deleteElementsWorkings = function() {
                $("." + settings.itemsWorking).removeClass(settings.itemsWorking);
            };

        // Public API
        return {
            init: init
        };
    }());

    app.main.init();
});