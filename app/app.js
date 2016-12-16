'use strict';
var app = {};
jQuery( document ).ready(function(){
	app.main = (function () {
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
				expanded: false
		},
		init = function(){
			accordion();
		},
		accordion = function(){
			var $accordion = $(settings.target);
			if ($accordion.length > 0){
				$accordion.each(function(){
					var container = $(this);
					accordionItem(container);
				});
			}
		},

		accordionItem = function($elem){
			var $elementsLinks = $elem.find(settings.accordionList + ' ' + settings.accordionListLink),
				$accordionLink = $elem.find(settings.accordionListLink),
				$accordionList = $elem.find(settings.accordionListItem);

			$elementsLinks.on('click', function(event){
				event.preventDefault();
				var $this 			= $(this),
					$parent 		= $elem,
					$accordionListItems 	= $parent.find( settings.accordionListItem);

				//busco todos los accordions y los reseteo
				if( $accordionListItems.length > 0 ){
					$accordionListItems.find(settings.accordionListLink)
						.attr('tabindex', '-1')
						.attr('aria-selected', 'false');
				}

				var $parentActivate = $this.parents( settings.accordionListItem );
				var $panelActivate = $('#' + $this.attr('aria-controls'));
				//si el elemento clicado esta activo
				if( $parentActivate.hasClass( settings.active ) ){
					//cerrar
					$panelActivate.slideUp( function(){
						$parentActivate
							.removeClass( settings.active );
						$this
							.attr('tabindex', '0')
							.attr('aria-selected', 'true')
							.attr('aria-expanded','false');
					});

				}else{//si el elemento clicado no esta activo
					$panelActivate.addClass(settings.itemActivate);
					//cerrar los otros paneles;
					var $accordionPanelItems = $parent.find( settings.accordionPanelItem + ':not(.'+settings.itemActivate+')' );
					$accordionListItems
							.removeClass( settings.active );
					$accordionPanelItems.slideUp( function(){
						$accordionPanelItems
							.attr('aria-hidden','true')
							.removeClass( settings.active );

						$accordionListItems.find( settings.accordionListLink )
							.attr('tabindex', '-1')
							.attr('aria-selected', 'false')
							.attr('aria-expanded','false');
					});
					//activamos el elemento nuevo
					$parentActivate
						.addClass( settings.active );
					//abrimos el panel
					$panelActivate.slideDown( function(){
						//cambiamos atributos enlace
						$this
							.attr('aria-selected', 'true')
							.attr('aria-expanded','true')
							.attr('tabindex', '0');

						$panelActivate
							.attr('aria-hidden','false')
							.addClass( settings.active);

						$panelActivate.removeClass(settings.itemActivate);
					});
				}
			});

			$accordionLink.on('keydown', function(e) {
	      var $that 			= jQuery(this),
	      	$parent 		= $that.parents(settings.target),
	        $accordionAgrup = $that.parents(settings.accordionListItem),
	        elementsAccordion 	= $elem.find(settings.accordionListItem).length - 1,
	        currentAccordion 		= $accordionAgrup.index(),
	        $element;

	      if( $parent.attr('data-expanded') === "true" ){
					settings.expanded = true;
				}
	      if (!(e.shiftKey && e.keyCode === 9)) {
					if (!(e.keyCode === 9)) { //accordion
						//e.preventDefault();
						//key left or key up - previous accordion
						if ((e.keyCode === 37 || e.keyCode === 38)) {
							e.preventDefault();
							$accordionList.eq(currentAccordion).find(settings.accordionListLink).attr('tabindex', '-1').attr('aria-selected','false');
							if (currentAccordion <= elementsAccordion) {
								//there is elements-accordion on left
								$element = $accordionList.eq(currentAccordion - 1).find(settings.accordionListLink).focus().attr('tabindex', '0').attr('aria-selected','true');
							} else {
								if (currentAccordion == 0) {
									//start on last accordion again
									$element = $accordionList.eq(elementsAccordion).find(settings.accordionListLink).focus().attr('tabindex', '0').attr('aria-selected','true');
								}
							}
							if(settings.expanded){
								$element.trigger('click');
							}
						} else {

							//key right or key down - next accordion
							if ((e.keyCode === 39 || e.keyCode === 40)) {
								e.preventDefault();
								$accordionList.eq(currentAccordion).find(settings.accordionListLink).attr('tabindex', '-1').attr('aria-selected','false');
								if (currentAccordion < elementsAccordion) {
									//there is elements-accordion on right
									$element = $accordionList.eq(currentAccordion + 1).find(settings.accordionListLink).focus().attr('tabindex', '0').attr('aria-selected','true');
								} else {
									if (currentAccordion == elementsAccordion) {
										//start on first accordion again
										$element = $accordionList.eq(0).find(settings.accordionListLink).focus().attr('tabindex', '0').attr('aria-selected','true');
									}
								}
								if(settings.expanded){
									$element.trigger('click');
								}
							}
						}
					}
				}
	    });

			accordionItemAtributes($elem, $elementsLinks);
		},
		accordionItemAtributes = function($elem, $elementsLinks){
			//iniciar atributos
			var $accordionListContainer 		= $elem.find( settings.accordionListItem ),
				$accordionListContainerActive = $elem.find( settings.accordionListItem + ".active" );

			var $parent 				= $elem,
				$accordionPanelItems 			= $parent.find( settings.accordionPanelItem +":not("+ settings.active +")" ),
				$parentActivate 		= $parent.find( settings.accordionListItem + '.' + settings.active),
				$parentActivatePanel 	= $('#' + $parentActivate.find(settings.accordionListLink).attr('aria-controls'));

			accordionItemAtributesLink( $accordionListContainer, $accordionListContainerActive, $elementsLinks );
			accordionItemAtributesPanel( $accordionPanelItems, $parentActivatePanel );
		},
		accordionItemAtributesLink = function($accordionListContainer, $accordionListContainerActive, $elementsLinks){
			//link
			$elementsLinks
				.attr('tabindex', '-1')
				.attr('aria-selected', 'false')
				.attr('aria-expanded','false');

			if($accordionListContainerActive.length > 0) {
				$accordionListContainerActive
					.find(settings.accordionListLink)
					.attr('tabindex', '0')
					.attr('aria-expanded','true')
					.attr('aria-selected', 'true');
			}else{ //si no tenemos ninguno activo dejo el atributo a 0 el del primer elemento para que se pueda acceder
				$accordionListContainer
					.first()
					.find(settings.accordionListLink)
					.attr('aria-expanded','true')
					.attr('tabindex', '0');
			}
		},
		accordionItemAtributesPanel = function($accordionPanelItems, $parentActivatePanel){
			//panels
			$accordionPanelItems
				.attr('aria-hidden','true')
				.removeClass( settings.active );
			$parentActivatePanel
				.attr('aria-hidden','false')
				.addClass( settings.active )
				.slideDown();
		};

		// Public API
		return {
			init: init
		};
	}());

	app.main.init();
});
