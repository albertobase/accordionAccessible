'use strict';
var app = {};
jQuery( document ).ready(function(){
	app.main = (function () {
		var settings = {
				target: '.js-tabs',
				tabsList: '.js-tabs-list',
				tabsListItem: '.js-tablist-item',
				tabsListLink: '.js-tablist-link',
				tabsPanelItem: '.js-tabs-panel-item',
				active: 'active',
				classTabs: 'tabsItems_',
				contadorTabs: 1,
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
			var $elementsLinks = $elem.find(settings.tabsList + ' ' + settings.tabsListLink),
				$accordionLink = $elem.find(settings.tabsListLink),
				$accordionList = $elem.find(settings.tabsListItem);

			$elementsLinks.on('click', function(event){
				event.preventDefault();
				var $this 			= $(this),
					$parent 		= $elem,
					$tabListItems 	= $parent.find( settings.tabsListItem);

				//busco todos los tabs y los reseteo
				if( $tabListItems.length > 0 ){
					$tabListItems.find(settings.tabsListLink).attr('tabindex', '-1');
					$tabListItems.attr('aria-selected', 'false');
				}

				//activamos el elemento clicado
				
				//si el elemento clicado esta activo
					//tengo que cerrarlo
				//si el elemento clicado no esta activo
					//tengo que abrirlo
				

				var $parentActivate = $this.parents( settings.tabsListItem );
				//si el elemento clicado esta activo
				if( $parentActivate.hasClass( settings.active ) ){
					//cerrar
					$parentActivate
						.addClass( settings.active )
						.attr('aria-selected', 'true');
					$this.attr('tabindex', '0');


				}else{//si el elemento clicado no esta activo
					//cerrar los otros paneles
					var $tabPanelItems = $parent.find( settings.tabsPanelItem);
					$tabPanelItems.slideUp( function(){
						$tabPanelItems
							.attr('aria-hidden','true')
							.removeClass( settings.active );
					});

					//cambiamos atributos enlace
					$parentActivate
						.addClass( settings.active )
						.attr('aria-selected', 'true');
					$this.attr('tabindex', '0');

					//abrimos el panel
					var $panelActivate = $('#' + $parentActivate.attr('aria-controls'))
					$panelActivate.slideDown( function(){
						$panelActivate
							.attr('aria-hidden','false')
							.addClass( settings.active);
					});
				}

				// //panels
				// var $tabPanelItems = $parent.find( settings.tabsPanelItem);
				// $tabPanelItems.attr('aria-hidden','true').removeClass( settings.active );

				// $('#' + $parentActivate.attr('aria-controls')).attr('aria-hidden','false').addClass( settings.active);
			});

			$accordionLink.on('keydown', function(e) {
				var $that 			= jQuery(this),
					$parent 		= $that.parents(settings.tabs),
					$accordionAgrup = $that.parents(settings.tabsListItem),
					elementsTab 	= $elem.find(settings.tabsListItem).length - 1,
					currentTab		= $accordionAgrup.index(),
					$element,
					expanded 		= false;
					
				if( $parent.attr('data-expanded') === "true" ){
					expanded = true;
				}

				if (!(e.shiftKey && e.keyCode === 9)) {
					if (!(e.keyCode === 9)) { //tab
						//e.preventDefault();
						//key left or key up - previous tab
						if ((e.keyCode === 37 || e.keyCode === 38)) {
							e.preventDefault();
							$accordionList.eq(currentTab).find(settings.tabsListLink).attr('tabindex', '-1');
							if (currentTab <= elementsTab) {
								//there is elements-tab on left
								$element = $accordionList.eq(currentTab - 1).find(settings.tabsListLink).focus().attr('tabindex', '0');
							} else {
								if (currentTab == 0) {
									//start on last tab again
									$element = $accordionList.eq(elementsTab).find(settings.tabsListLink).focus().attr('tabindex', '0');
								}
							}
							if(expanded){
								$element.trigger('click');
							}
						} else {
							
							//key right or key down - next tab
							if ((e.keyCode === 39 || e.keyCode === 40)) {
								e.preventDefault();
								$accordionList.eq(currentTab).find(settings.tabsListLink).attr('tabindex', '-1');
								if (currentTab < elementsTab) {
									//there is elements-tab on right
									$element = $accordionList.eq(currentTab + 1).find(settings.tabsListLink).focus().attr('tabindex', '0');
								} else {
									if (currentTab == elementsTab) {
										//start on first tab again
										$element = $accordionList.eq(0).find(settings.tabsListLink).focus().attr('tabindex', '0');
									}
								}
								if(expanded){
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
			var $tabListContainer 		= $elem.find( settings.tabsListItem ),
				$tabListContainerActive = $elem.find( settings.tabsListItem + ".active" );

			var $parent 				= $elem,
				$tabPanelItems 			= $parent.find( settings.tabsPanelItem +":not("+ settings.active +")" ),
				$parentActivate 		= $parent.find( settings.tabsListItem + '.' + settings.active),
				$parentActivatePanel 	= $('#' + $parentActivate.attr('aria-controls'));
			
			tabItemAtributesLink( $tabListContainer, $tabListContainerActive, $elementsLinks );
			tabItemAtributesPanel( $tabPanelItems, $parentActivatePanel );
		},
		tabItemAtributesLink = function($tabListContainer, $tabListContainerActive, $elementsLinks){
			//link
			$tabListContainer.attr('aria-selected', 'false');
			$elementsLinks.attr('tabindex', '-1');
			
			if($tabListContainerActive.length > 0) {
				$tabListContainerActive.attr('aria-selected', 'true');
				$tabListContainerActive.find(settings.tabsListLink).attr('tabindex', '0');
			}else{ //si no tenemos ninguno activo dejo el atributo a 0 el del primer elemento para que se pueda acceder
				$tabListContainer.first().find(settings.tabsListLink).attr('tabindex', '0');
			}
		},
		tabItemAtributesPanel = function($tabPanelItems, $parentActivatePanel){
			//panels
			$tabPanelItems.attr('aria-hidden','true').removeClass( settings.active );
			$parentActivatePanel.attr('aria-hidden','false').addClass( settings.active );
		};

		// Public API
		return {
			init: init
		};
	}());

	app.main.init();
});
