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
				contadorTabs: 1,
				itemActivate: 'itemActivate',
				expanded: false
		},
		init = function(){
			tabs();
		},
		tabs = function(){
			var $tabs = $(settings.target);
			if ($tabs.length > 0){
				$tabs.each(function(){
					var container = $(this);
					tabItem(container);
				});
			}
		},

		tabItem = function($elem){
			var $elementsLinks = $elem.find(settings.accordionList + ' ' + settings.accordionListLink),
				$accordionLink = $elem.find(settings.accordionListLink),
				$accordionList = $elem.find(settings.accordionListItem);

			$elementsLinks.on('click', function(event){
				event.preventDefault();
				var $this 			= $(this),
					$parent 		= $elem,
					$tabListItems 	= $parent.find( settings.accordionListItem);

				//busco todos los tabs y los reseteo
				if( $tabListItems.length > 0 ){
					$tabListItems.find(settings.accordionListLink)
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
					var $tabPanelItems = $parent.find( settings.accordionPanelItem + ':not(.'+settings.itemActivate+')' );
					$tabPanelItems.slideUp( function(){
						$tabPanelItems
							.attr('aria-hidden','true')
							.removeClass( settings.active );
						$tabListItems
							.removeClass( settings.active );
						$tabListItems.find( settings.accordionListLink )
							.attr('tabindex', '-1')
							.attr('aria-selected', 'false')
							.attr('aria-expanded','false');
					});
					//activamos el elemento nuevo

					//abrimos el panel
					$panelActivate.slideDown( function(){
						//cambiamos atributos enlace
						$parentActivate
							.addClass( settings.active );
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
                    elementsTab 	= $elem.find(settings.accordionListItem).length - 1,
                    currentTab 		= $accordionAgrup.index(),
                    $element;

                if( $parent.attr('data-expanded') === "true" ){
					settings.expanded = true;
				}
                if (!(e.shiftKey && e.keyCode === 9)) {
					if (!(e.keyCode === 9)) { //tab
						//e.preventDefault();
						//key left or key up - previous tab
						if ((e.keyCode === 37 || e.keyCode === 38)) {
							e.preventDefault();
							$accordionList.eq(currentTab).find(settings.accordionListLink).attr('tabindex', '-1').attr('aria-selected','false');
							if (currentTab <= elementsTab) {
								//there is elements-tab on left
								$element = $accordionList.eq(currentTab - 1).find(settings.accordionListLink).focus().attr('tabindex', '0').attr('aria-selected','true');
							} else {
								if (currentTab == 0) {
									//start on last tab again
									$element = $accordionList.eq(elementsTab).find(settings.accordionListLink).focus().attr('tabindex', '0').attr('aria-selected','true');
								}
							}
							if(settings.expanded){
								$element.trigger('click');
							}
						} else {
							
							//key right or key down - next tab
							if ((e.keyCode === 39 || e.keyCode === 40)) {
								e.preventDefault();
								$accordionList.eq(currentTab).find(settings.accordionListLink).attr('tabindex', '-1').attr('aria-selected','false');
								if (currentTab < elementsTab) {
									//there is elements-tab on right
									$element = $accordionList.eq(currentTab + 1).find(settings.accordionListLink).focus().attr('tabindex', '0').attr('aria-selected','true');
								} else {
									if (currentTab == elementsTab) {
										//start on first tab again
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

			tabItemAtributes($elem, $elementsLinks);
		},
		tabItemAtributes = function($elem, $elementsLinks){
			//iniciar atributos
			var $tabListContainer 		= $elem.find( settings.accordionListItem ),
				$tabListContainerActive = $elem.find( settings.accordionListItem + ".active" );

			var $parent 				= $elem,
				$tabPanelItems 			= $parent.find( settings.accordionPanelItem +":not("+ settings.active +")" ),
				$parentActivate 		= $parent.find( settings.accordionListItem + '.' + settings.active),
				$parentActivatePanel 	= $('#' + $parentActivate.find(settings.accordionListLink).attr('aria-controls'));
			
			tabItemAtributesLink( $tabListContainer, $tabListContainerActive, $elementsLinks );
			tabItemAtributesPanel( $tabPanelItems, $parentActivatePanel );
		},
		tabItemAtributesLink = function($tabListContainer, $tabListContainerActive, $elementsLinks){
			//link
			$elementsLinks
				.attr('tabindex', '-1')
				.attr('aria-selected', 'false')
				.attr('aria-expanded','false');
			
			if($tabListContainerActive.length > 0) {
				$tabListContainerActive
					.find(settings.accordionListLink)
					.attr('tabindex', '0')
					.attr('aria-expanded','true')
					.attr('aria-selected', 'true');
			}else{ //si no tenemos ninguno activo dejo el atributo a 0 el del primer elemento para que se pueda acceder
				$tabListContainer
					.first()
					.find(settings.accordionListLink)
					.attr('aria-expanded','true')
					.attr('tabindex', '0');
			}
		},
		tabItemAtributesPanel = function($tabPanelItems, $parentActivatePanel){
			//panels
			$tabPanelItems
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
