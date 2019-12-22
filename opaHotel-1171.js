'use strict';

(function($){

	var OpalHotelSite = {

		init: function () {

			
			/* process single room page */
			this.single.init();
			
			this.video_initialize();
			
			// Ajax Filter Ajax
			this.ajax_filter_hotel.init();

			// load rooms availabel of hotel
			$( '.opalhotel_load_rooms_of_hotel' ).on( 'submit', this.load_rooms_of_hotel );
		},

		search: {

			collapse: function( e ) {
				e.preventDefault();
				var _self = $( this );
				var	_collapse = _self.parents( '.opalhotel-available-form:first' ).find( '.opalhotel-room-package-wrapper' );

				// alert();
				_self.toggleClass( 'active' );

				if ( _self.hasClass( 'active' ) ) {
					_collapse.addClass( 'active' );
				} else {
					_collapse.removeClass( 'active' );
				}
				return false;
			},




			package_details: function( e ) {
				e.preventDefault();
				var _self = $( this ),
					_form = _self.parents( '.opalhotel-room-package-item:first' ),
					_package_details = _form.find( '.opalhotel-package-desc' );

				setTimeout(function(){
					_package_details.toggleClass( 'hide' );
					_package_details.toggleClass( 'active' );
				}, 100 );
				return false;
			},

			close_pricing: function( e ) {
				e.preventDefault();
				var _self = $( this ),
					_lightbox = _self.parents( '.opalhotel-modal-pricing:first' );
				_lightbox.removeClass( 'active' );

			}
		},

		single: {

			/* init single process. Eg: tabs ... */
			init: function() {				
				var _doc = $( document );

				/* room gallery */
				this.gallery();

				/* init tabs */
				this.init_tabs();

				/* review */
				this.review();

				/* submit review */
				_doc.on( 'submit', '.opalhotel-comment-form', this.submit_review );
				_doc.on( 'click', '.opalhotel-single-tabs .opalhotel-single-tabs-ul .tab', this.single_tabs );

				$('.package-item .package-description').hide();
				_doc.on( 'click', '.package-item .package-content', this.package_action );
			},
			package_action:function(){
				console.log('click package description.................')
				$(this).parent().toggleClass('active').find('.package-description').toggle();
			},
			init_tabs: function() {
				$( '.opalhotel-single-tabs .opalhotel-single-tabs-ul .opalhotel-single-tabs a.tab:first' ).addClass( 'active' );
				$( '.opalhotel-single-tabs .opalhotel-single-tab-panel:first' ).addClass( 'active' );
			},

			review: function() {
				var reviews = $( '.opalhotel-star' );
				for( var i = 0; i < reviews.length; i++ ) {
					var _review = $( reviews[i] ),
						type = _review.attr( 'data-type' ),
						html = [];

					html.push( '<p>' );
					html.push( '<span class="star-wrapper" data-type="' + type + '">' )
					html.push( '<span href="#" class="star" data-star="1"></span>' );
					html.push( '<span href="#" class="star" data-star="2"></span>' );
					html.push( '<span href="#" class="star" data-star="3"></span>' );
					html.push( '<span href="#" class="star" data-star="4"></span>' );
					html.push( '<span href="#" class="star" data-star="5"></span>' );
					html.push( '<input type="hidden" name="opalhotel_rating[' + type + ']" />' );
					html.push( '</span>' );
					html.push( '</p>' );
					_review.append( html.join( '' ) );
					_review = _review.find( '.star-wrapper' );
					_review.mousemove( function( e ){
						e.preventDefault();
						var parentOffset = $( this ).offset(),
							relX = e.pageX - parentOffset.left,
							star = $(this).find( '.star' ),
							width = star.width(),
							rate = Math.ceil( relX / width );

						for( var y = 0; y < star.length; y++ ) {
							var st = $( star[y] ),
								_data_star = parseInt( st.attr( 'data-star' ) );
							if( _data_star <= rate ) {
								st.addClass( 'active' );
							}
						}
					}).mouseout( function( e ){
						var parentOffset = $( this ).offset(),
							relX = e.pageX - parentOffset.left,
							star = $(this).find( '.star' ),
							width = star.width(),
							rate = $(this).find( '.star.selected' );

						if( rate.length === 0 ) {
							star.removeClass( 'active' );
						} else {
							for( var y = 0; y < star.length; y++ ) {
								var st = $( star[y] ),
									_data_star = parseInt( st.attr( 'data-star' ) );

								if( _data_star <= parseInt( rate.attr( 'data-star' ) ) ) {
									st.addClass( 'active' );
								} else {
									st.removeClass( 'active' );
								}
							}
						}
					}).mousedown( function( e ){
						e.preventDefault();
						var parentOffset = $( this ).offset(),
							relX = e.pageX - parentOffset.left,
							star = $(this).find( '.star' ),
							width = star.width(),
							type = $( this ).attr( 'data-type' ),
							rate = Math.ceil( relX / width );
						star.removeClass( 'selected' ).removeClass( 'active' );
						for( var y = 0; y < star.length; y++ ) {
							var st = $( star[y] ),
								_data_star = parseInt( st.attr( 'data-star' ) );
							if( _data_star === rate ) {
								st.addClass( 'selected' ).addClass( 'active' );
								break;
							} else {
								st.addClass( 'active' );
							}
						}
						$( this ).find( 'input[name="opalhotel_rating[' + type + ']"]' ).val( rate );
					} );
				}
			},

			submit_review: function( e ) {
				var _self = $( this ),
					_rating = _self.find( 'input[name^="opalhotel_rating"]' );
					// _rating_val = _rating.val();

				if ( typeof OpalHotel.options.enabled_require_rating !== 'undefined' && typeof OpalHotel.options.enabled_rating !== 'undefined'
					&& OpalHotel.options.enabled_rating == '1'
					&& OpalHotel.options.enabled_require_rating == '1' ) {

					var rated = true;
					for ( var i = 0; i < _rating.length; i++ ) {
						var __rate = $( _rating[i] );
						if ( __rate.val() === '' ) {
							rated = false;
						}
					}

					if ( rated === false ) {
						_self.opalhotel_modal({
			                tmpl: 'opalhotel-alert',
			                settings: {
			                	message: OpalHotel.require_rating
			                }
			            });

			            return false;
					}
				}
				// _self.submit();
				return true;
			},

			single_tabs: function( e ) {
				e.preventDefault();
				var _self = $( this ),
					_parent = _self.parents( '.opalhotel-single-tabs:first' ),
					_tab = _self.find( 'a:first' ).attr( 'href' );

				_parent.find( '.tab' ).removeClass( 'active' );
				_self.addClass( 'active' );
				_parent.find( '.opalhotel-single-tab-panel' ).removeClass( 'active' );
				_parent.find( _tab ).addClass( 'active' );

			},

			gallery: function() {

				if ( ! $.fn.owlCarousel ){
					return;
				}

			    var sync1 = $( '.opalhotel-room-single-gallery' );
			    var sync2 = $( '.opalhotel-room-single-gallery-thumb' );

			    sync1.owlCarousel({
					singleItem 	: true,
					slideSpeed 	: 500,
					navigation	: true,
					navigationText : false,
					pagination	:false,
					afterAction : syncPosition,
					responsiveRefreshRate : 200,
				});

				$( ".owl-prev").html('<i class="fa fa-angle-left"></i>');
 				$( ".owl-next").html('<i class="fa fa-angle-right"></i>');

			    sync2.owlCarousel({
				    items : 10,
				    itemsDesktop      : [1199,10],
				    itemsDesktopSmall : [979,10],
				    itemsTablet       : [768,8],
				    itemsMobile       : [479,4],
				    pagination:false,
				    responsiveRefreshRate : 100,
				    afterInit : function(el){
				      el.find( '.owl-item' ).eq(0).addClass( 'synced' );
				    }
				});

				function syncPosition(el){
				    var current = this.currentItem;
				    sync2.find( '.owl-item' ).removeClass( 'synced' ).eq( current ).addClass( 'synced' )
					    if( sync2.data( 'owlCarousel' ) !== undefined ){
					      	center( current )
					    }
			 	}

				sync2.on( 'click', ".owl-item", function(e){
					e.preventDefault();
					var number = $(this).data( 'owlItem' );
					sync1.trigger(( 'owl.goTo' ), number );
				});

				function center( number ){
					var sync2visible = sync2.data( 'owlCarousel' ).owl.visibleItems;
					var num = number;
					var found = false;
					for( var i in sync2visible ){
					  	if(num === sync2visible[i]){
					    	var found = true;
					  	}
					}

					if( found === false ){
					  	if( num > sync2visible[sync2visible.length-1] ){
					    	sync2.trigger(( 'owl.goTo' ), num - sync2visible.length+2)
					  	} else {
					    if( num - 1 === -1 ){
							num = 0;
					    }
							sync2.trigger( ( 'owl.goTo' ), num );
					  	}
					} else if( num === sync2visible[ sync2visible.length - 1 ] ){
						sync2.trigger( ( 'owl.goTo' ), sync2visible[1] )
					} else if( num === sync2visible[0] ){
						sync2.trigger( ( 'owl.goTo' ), num-1 )
					}

				}
			}

		},

		cart: {

			init: function() {

				var _doc = $( document );

				/* add to cart function */
				_doc.on( 'submit', '.opalhotel-available-form', this.add_to_cart );

				_doc.on( 'click', '.opalhotel-reservation-available-review .cart_remove_item', this.remove_cart_item );
			},

			add_to_cart: function( e ) {
				e.preventDefault();

				var _self = $( this ),
					_button = _self.find( '.opalhotel-button-submit' ),
					_data = OpalHotelSite.form_data( _self );

				if ( _data.qty == 0 ) {
					// _self.opalhotel_modal({
		   //              tmpl: 'opalhotel-alert',
		   //              settings: {
		   //              	message: OpalHotel.quantity_invalid
		   //              }
		   //          });
		            opalhotel_print_notice( OpalHotel.quantity_invalid );
		            return false;
				}

				$.ajax({
					url: OpalHotel.ajaxurl,
					type: 'POST',
					data: _data,
					beforeSend: function(){
						_button.append( '<i class="fa fa-spinner fa-spin"></i>' );
					}
				}).done( function( res ){
					_button.find( '.fa' ).remove();
					if ( res.status === false && typeof res.message !== 'undefined' ) {
						_self.opalhotel_modal({
			                tmpl: 'opalhotel-alert',
			                settings: {
			                	message: res.message
			                }
			            });
					} else if ( res.status === true && typeof res.review !== 'undefined' ) {
						var reviews = $( '.opalhotel-reservation-available-review' ),
							header = $( '.opalhotel_check_availability header' );
						if ( reviews.length > 0 ) {
							reviews.slideUp( 400, function(){
								$( this ).slideDown( 400, function(){
									$( this ).replaceWith( res.review );
								});
							});
						} else {
							header.after( res.review );
						}

						if ( typeof res.message !== 'undefined' ) {
							$( 'body' ).prepend( res.message );
							$( '.opalhotel-flash-message' ).slideDown( 400, function(){
								var timeout = setTimeout( function(){
									$( '.opalhotel-flash-message' ).slideUp( 400, function(){
										$( this ).remove();
									});
									clearTimeout( timeout );
								}, 2000);
							});
							if( $( 'body' ).find('.reservation_step').length ){
								$('html, body').animate({
				                    scrollTop: $( 'body' ).find('.reservation_step').offset().top - 200
				                }, 2000);
							}
						}
					}
					if ( typeof res.redirect !== 'undefined' ) {
						window.location.href = res.redirect;
					}
				} ).fail( function( jqXHR, textStatus ){
					_button.find( '.fa' ).remove();
					_self.opalhotel_modal({
		                tmpl: 'opalhotel-alert',
		                settings: {
		                	message: textStatus
		                }
		            });
		            return false;
				});
			},

			remove_cart_item: function( e ) {
				e.preventDefault();
				var _self = $( this ),
					_cart_item_id = _self.attr( 'data-id' );

				$.ajax({
					url: OpalHotel.ajaxurl,
					type: 'POST',
					data: {
						action: 'opalhotel_remove_cart_item',
						cart_item_id: _cart_item_id
					},
					beforeSend: function(){
						_self.addClass( 'fa-spin' );
						OpalHotelSite.reservation.beforeSend();
					}
				}).always( function(){
					_self.removeClass( 'fa-spin' );
				 	OpalHotelSite.reservation.afterSend();
				}).done( function( res ){
					if ( res.status === false && res.message !== '' ) {
						_self.opalhotel_modal({
			                tmpl: 'opalhotel-alert',
			                settings: {
			                	message: res.message
			                }
			            });
			            return false;
					}
					if ( typeof res.checkout_review !== 'undefined' ) {
	    				$( '.opalhotel-checkout-review' ).html( res.checkout_review );
	    			}
					if ( typeof res.reservation_review !== 'undefined' ) {
						$( '.opalhotel-reservation-available-review' ).replaceWith( res.reservation_review );
					}

					if ( typeof res.cart_empty !== 'undefined' ) {
						$( '.opalhotel-checkout-form' ).replaceWith( res.cart_empty );
					}
				} ).fail( function( jqXHR, textStatus ){
					_self.opalhotel_modal({
		                tmpl: 'opalhotel-alert',
		                settings: {
		                	message: textStatus
		                }
		            });
		            return false;
				});
			},

		},

	    // form data
	    form_data: function( form ){
	    	var _data = form.serializeArray(),
	    		data = {};

	    	$.each ( _data, function( index, value ){
	    		if ( data.hasOwnProperty( value.name ) ) {
					data[ value.name ] = $.makeArray( data[ value.name ] );
					data[ value.name ].push( value.value );
				} else {
					data[ value.name ] = value.value;
				}
	    	} );

	    	return data;
	    },

	    reservation: {

	    	select: false,

	    	init: function(){

	    		var _doc = $( document );

	    		_doc.on( 'click', '.opalhotel-reservation-step .reservation_step, .opalhotel-pagination-available .opalhotel-page', this.step );

	    	},

	    	step: function( e ) {
	    		e.preventDefault();
	    		var _self = $( this ),
	    			step = _self.attr( 'data-step' ),
	    			current_page_id = _self.attr( 'data-pageid' ),
	    			arrival = _self.attr( 'data-arrival' ),
	    			departure = _self.attr( 'data-departure' ),
	    			adult = _self.attr( 'data-adult' ),
	    			child = _self.attr( 'data-child' ),
	    			room_type = _self.attr( 'data-room-type' ),
	    			page = _self.attr( 'data-page' ),
	    			container = $( '.opalhotel-reservation-container' );

	    		var data = {
	    				action: 'opalhotel_reservation_step',
	    				step: step,
	    				current_page_id: current_page_id,
	    				arrival_datetime: arrival,
	    				departure_datetime: departure,
	    				adult: adult,
	    				child: child,
	    				room_type: room_type,
	    				paged: page
	    			};
	    		$.ajax({
	    			url: OpalHotel.ajaxurl,
	    			type: 'POST',
	    			data: data,
	    			beforeSend: function() {
	    				OpalHotelSite.reservation.beforeSend();
	    			}
	    		}).always( function() {
	    			/* disappear effect */
				    OpalHotelSite.reservation.afterSend();
			    }).done( function( res ) {

			    	if ( typeof res.redirect !== 'undefined' ) {
			    		window.location.href = res.redirect;
			    	}

	    			if ( res.status === true && typeof res.html !== 'undefined' ) {
			    		OpalHotelSite.reservation.loadContent( res, data );
			    		if ( step == 2 ) {
			    			opalhotel_jBox_init();
			    		}
	    			}

	    			if( res.status === false && typeof res.message !== 'undefined' ) {
	    				_self.opalhotel_modal({
			                tmpl: 'opalhotel-alert',
			                settings: {
			                	message: res.message
			                }
			            });
	    			}

	    		} ).fail( function( jqXHR, textStatus ) {
	    			_self.opalhotel_modal({
		                tmpl: 'opalhotel-alert',
		                settings: {
		                	message: textStatus
		                }
		            });
	    		});

	    		return false;
	    	},

	    	beforeSend: function( element ) {
	    		var html = [];
	    		html.push( '<div class="opalhotel-reservation-loading">' );
	    		html.push( '<div class="content"></div>' );
	    		html.push( '</div>' );

	    		if ( typeof element === 'undefined' ) {
	    			element = $( '.opalhotel-reservation-container' );
	    		}
	    		element.append( html.join( '' ) );
	    	},

	    	afterSend: function( element ) {
	    		if ( typeof element === 'undefined' ) {
	    			element = $( '.opalhotel-reservation-container' );
	    		}
	    		element.find( '.opalhotel-reservation-loading' ).remove();
	    	},

	    	loadContent: function( res, data ) {
	    		var hashString = $.param( data );
		        if ( window.history.pushState ) {
		            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?'+ hashString;
		            window.history.pushState( { path : newurl }, data, newurl );
		        }

	    		var container = $( '.opalhotel-reservation-container' );
	    		var parent = container.parent();
	    		container.replaceWith( res.html );

				if ( res.step == 1 ) {
					opalhotel_datepicker_init();
				}

				if ( res.step == 3 ) {
					/* focus */
					OpalHotelSite.checkout.focus();
					/* validate payment input field. */
					OpalHotelSite.checkout.init_payment_validate();
				}
				OpalHotelSite.checkout.scroll_top( container.offset().top );
	    	}

	    },

	    checkout: {

	    	init: function() {

	    		var _doc = $( document );

	    		/* select payment method */
	    		_doc.on( 'change', 'input[name="payment_method"]', this.select_payment_method );

	    		/* apply coupon */
	    		_doc.on( 'click', '#opalhotel_apply_coupon', this.apply_coupon );

	    		/* remove coupon */
	    		_doc.on( 'click', '.opalhotel-review-subtotal .remove_coupon', this.remove_coupon );

	    		/* submit checkout form */
	    		_doc.on( 'submit', '.opalhotel-checkout-form', this.place_reservation );

	    		/* focus */
	    		this.focus();

	    		/* validate payment input field jquery.payment.min.js */
	    		this.init_payment_validate();
	    	},

	    	apply_coupon: function( e ) {
	    		e.preventDefault();

	    		var _self = $( this ),
	    			_coupon = $( '#opalhotel_coupon_code' ),
	    			_coupon_code = $( '#opalhotel_coupon_code' ).val(),
	    			_review = $( '.opalhotel-checkout-review' );

	    		if ( $.trim( _coupon_code ) === '' ) {
	    			_self.opalhotel_modal({
		                tmpl: 'opalhotel-alert',
		                settings: {
		                	message: OpalHotel.coupon_empty
		                }
		            });

		            _coupon.focus(); return false;
	    		}

	    		$.ajax({
	    			url: OpalHotel.ajaxurl,
	    			type: 'POST',
	    			data: {
	    				action: 'opalhotel_apply_coupon_code',
	    				coupon: _coupon_code
	    			},
	    			beforeSend: function(){
	    				OpalHotelSite.reservation.beforeSend( _review );
	    			}
	    		}).always( function(){
	    			OpalHotelSite.reservation.afterSend( _review );
	    		}).done( function( res ){
	    			if ( res.status === false && typeof res.message !== 'undefined' ) {
	    				_self.opalhotel_modal({
			                tmpl: 'opalhotel-alert',
			                settings: {
			                	message: res.message
			                }
			            });
			            return false;
	    			}

	    			if ( typeof res.checkout_review !== 'undefined' ) {
	    				$( '.opalhotel-checkout-review' ).html( res.checkout_review );
	    			}

	    			if ( typeof res.reservation_review !== 'undefined' ) {
	    				$( '.opalhotel_check_availability .opalhotel-reservation-available-review' ).slideUp( 400, function(){
								$( this ).slideDown( 400, function(){
									$( this ).replaceWith( res.reservation_review );
								});
							});
	    			}
	    		} ).fail( function( jqXHR, textStatus ){
	    			_self.opalhotel_modal({
		                tmpl: 'opalhotel-alert',
		                settings: {
		                	message: textStatus
		                }
		            });
	    		});

	    		return false;

	    	},

	    	/* remove coupon */
	    	remove_coupon: function( e ) {
	    		e.preventDefault();
	    		var _self = $( this ),
	    			_coupon_code = _self.attr( 'data-code' ),
	    			_review = $( '.opalhotel-checkout-review' );

	    		$.ajax({
	    			url: OpalHotel.ajaxurl,
	    			type: 'POST',
	    			data: {
	    				action: 'opalhotel_remove_coupon_code',
	    				coupon: _coupon_code
	    			},
	    			beforeSend: function(){
	    				OpalHotelSite.reservation.beforeSend( _review );
	    			}
	    		}).always( function(){
	    			OpalHotelSite.reservation.afterSend( _review );
	    		}).done( function( res ){
	    			if ( res.status === false && typeof res.message !== 'undefined' ) {
	    				_self.opalhotel_modal({
			                tmpl: 'opalhotel-alert',
			                settings: {
			                	message: res.message
			                }
			            });
			            return false;
	    			}

	    			if ( typeof res.checkout_review !== 'undefined' ) {
	    				$( '.opalhotel-checkout-review' ).html( res.checkout_review );
	    			}

	    			if ( typeof res.reservation_review !== 'undefined' ) {
	    				$( '.opalhotel_check_availability .opalhotel-reservation-available-review' ).slideUp( 400, function(){
								$( this ).slideDown( 400, function(){
									$( this ).replaceWith( res.reservation_review );
								});
							});
	    			}
	    		} ).fail( function( jqXHR, textStatus ){
	    			_self.opalhotel_modal({
		                tmpl: 'opalhotel-alert',
		                settings: {
		                	message: textStatus
		                }
		            });
	    		});

	    	},

	    	/* select payment method */
	    	select_payment_method: function( e ) {
	    		e.preventDefault();
	    		var _self = $( this ),
					_desc = $( '.opalhotel_payment_gateways .description' );

				_desc.slideUp( 300 );
				_self.parents( 'li:first' ).find( '.description' ).slideDown( 300 );

	    	},

	    	/* focus checkout fields */
	    	focus: function() {
	    		var _input = $( '.opalhotel-checkout-form input, .opalhotel-checkout-form select' );
	    		for( var i = 0; i < _input.length; i++ ) {
	    			var __input = $( _input[i] );
	    			__input.focusout(function() {
	    				var _parent = $( this ).parents( '.opalhotel-form-group' );
	    				if ( _parent.find( '.required' ).length > 0 ) {
						    if ( $(this).val() === '' ) {
						    	$( this ).removeClass( 'validated' ).addClass( 'error' );
						    } else {
						    	$( this ).removeClass( 'error' ).addClass( 'validated' );
						    }
	    				}
				  	});
	    		}
	    	},

	    	/* submit checkout form function handler */
	    	place_reservation: function( e ) {
	    		e.preventDefault();
	    		var _self = $( this ),
	    			_form_data = OpalHotelSite.form_data( _self ),
	    			_input_error = _self.find( 'input.error, select.error' ),
	    			_wrapper = $( '.opalhotel-reservation-container' ),
	    			_error_message = $( '.opalhotel-error-messages' ),
	    			_review = $( '.opalhotel-reservation-available-review' );

	    		if ( _input_error.length > 0 ) {
	    			var _position = $( _input_error[0] ).parents( '.opalhotel-form-group:first' ).offset().top - $( _input_error[0] ).outerHeight();
	    			OpalHotelSite.checkout.scroll_top( _position );
	    			return false;
	    		}

	    		$.ajax({
	    			url: OpalHotel.ajaxurl,
	    			type: 'POST',
	    			data: _form_data,
	    			beforeSend: function()  {
	    				_error_message.slideUp(function(){
	    					$( this ).remove();
	    				});
	    				OpalHotelSite.reservation.beforeSend();
	    			}
	    		}).always( function() {
	    			/* disapper effect */
				    OpalHotelSite.reservation.afterSend();
			    }).done( function( res ) {
			    	if ( res.status === true ) {
			    		_review.slideUp(400, function(){
			    			$( this ).remove();
			    		});
			    		if ( typeof res.redirect !== 'undefined' ) {
			    			window.location.href = res.redirect;
			    		}

			    		if ( typeof res.reservation !== 'undefined' ) {
			    			_wrapper.replaceWith( res.reservation );
			    		}

			    		if ( _self.parents('.opalhotel-reservation-container').length == 1 ) {
			    			if ( typeof res.order_received !== 'undefined' ) {
				    			var query = window.location.search.substring(1);
							    var vars = query.split( '&' );
							    var replaced = false;
							    for ( var i = 0; i < vars.length; i++ ) {
							        var pair = vars[i].split( '=' );
							        if ( pair[0] == 'step' ) {
							            vars[i] = pair[0] + '=' + 4;
							            replaced = true;
							        }
							    }
							    if ( ! replaced ) vars.push( 'step' + '=' + 4 );

							    vars.push( 'reservation-received=' + res.order_received );
						    	vars = vars.join('&');
						    	if ( window.history.pushState ) {
						            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?'+ vars;
						            window.history.pushState( { path : newurl }, '', newurl );
						        }
			    			}
			    		}

			    	} else if( res.status === false ) {
			    		if ( typeof res.messages !== 'undefined' ) {
			    			var _form = $( '.opalhotel-checkout-form' );
			    			_form.prepend( res.messages );
			    			OpalHotelSite.checkout.scroll_top( $('.opalhotel-error-messages').offset().top  );
			    		}

			    		if ( typeof res.fields !== 'undefined' ) {
			    			for ( var i = 0; i < res.fields.length; i++ ) {
			    				_wrapper.find( 'input[name="opalhotel_'+ res.fields[i] +'"]' ).removeClass( 'validated' ).addClass( 'error' );
			    				_wrapper.find( 'input[name="credit-card\['+ res.fields[i] +'\]"]' ).removeClass( 'validated' ).addClass( 'error' );
			    			}
			    		}
			    	}
			    } ).fail( function( jqXHR, textStatus ) {
	    			_self.opalhotel_modal({
		                tmpl: 'opalhotel-alert',
		                settings: {
		                	message: textStatus
		                }
		            });
	    		});

	    	},

	    	/* scroll top show error message */
	    	scroll_top: function( _position ) {
	    		$( 'html, body' ).animate({ scrollTop: _position }, 400 );
	    	},

	    	/* validate payment fields */
	    	init_payment_validate: function() {
	    		$( '.credit-card-cc-number' ).payment( 'formatCardNumber' );
		        $( '.credit-card-cc-exp' ).payment( 'formatCardExpiry' );
		        $( '.credit-card-cc-cvc' ).payment( 'formatCardCVC' );
	    	}

	    },

	    video_initialize: function() {
            var videos = $('.opalhotel-feature-video');
            this.getQueryVariable();
            for ( var i = 0; i < videos.length; i++ ) {
                var video = $( videos[i] ),
                    id = video.attr('id'),
                    loop = video.data('loop'),
                    url = video.data('url'),
                    mute = video.data('mute'),
                    autoplay = video.data('autoplay'),
                    control = video.data('control');
                var hostname = this.getDomain( url );
                switch( hostname ) {
                    case 'youtube.com':
                    case 'www.youtube.com':
                    case 'youtu.be':
                        var videoID = this.getQueryVariable( 'v', false, url );
                        var options = {
                            videoId: videoID,
                            playerVars: {
                                'autoplay': autoplay === 'yes' ? 1 : 0,
                                'controls': control === 'yes' ? 1 : 0,
                                'loop': loop === 'yes' ? 1 : 0,
                                'mute': mute === 'yes' ? 1 : 0
                            }
                        };

                        if ( typeof YT === 'undefined' || typeof YT.Player === 'undefined' ) {
                            $.getScript( '//www.youtube.com/iframe_api', function(){
                                youtubePlayer( id, options );
                            });
                        } else {
                            youtubePlayer( id, options );
                        }
                        break;
                }

            }

            function youtubePlayer( id, options ) {
                var player = new YT.Player( id, {
                        videoId: videoID,
                        playerVars: options,
                        events: {
                            onReady: function() {
                                if ( typeof options.playerVars.mute !== 'undefined' && options.playerVars.mute === 1 ) {
                                    player.mute();
                                }
                                if ( typeof options.playerVars.autoplay !== 'undefined' && options.playerVars.autoplay === 1 ) {
                                    player.playVideo();
                                }
                            }
                        }
                    } );
            }
        },

        getQueryVariable: function( variable, defaultVal, url ) {
            var query = typeof url == 'undefined' ? window.location.search.substring(1) : url.split('?')[1];
            var vars = query.split( '&' );
            for ( var i = 0; i < vars.length; i++ ) {
                var pair = vars[i].split( '=' );
                if( pair[0] == variable ){
                    return pair[1];
                }
            }

            if ( typeof defaultVal === 'undefined' )
                defaultVal = false;

            return defaultVal;
        },

        getDomain: function( url ) {
            var a = document.createElement('a');
                a.href = url;
            return a.hostname;
        },

        // Hotels Ajax Filter Search Results
        ajax_filter_hotel: {

        	ajax : null,

        	init: function() {
        		var _doc = $( document );

        		_doc.on( 'submit', '.opalhotel-loops-wrapper .display-mode', this.submitLayoutMode );

        		// sortable
			    _doc.on( 'change', '.opalhotel-loops-wrapper select[name="sortable"]', function(e){
			    	e.preventDefault();
			    	var url = $(this).val();
			    	var sortable = $(this).find( 'option:selected' ).data( 'sortable' );
						var wrapper = $(this).parents( '.opalhotel-loops-wrapper:first' );
						var data = [];
						data.push({ name: 'display', value: wrapper.find( '.display-mode .btn.active').val() });
						data.push({ name: 'sortable', value: $( this ).find( 'option:selected' ).data( 'sortable' ) });
						OpalHotelSite.ajax_filter_hotel.load_hotels( wrapper, data );
			    	return false;
			    } );

			    _doc.on( 'click', '.opalhotel-loops-wrapper a.page-numbers', function(e){
			    	e.preventDefault();
			    	var self = $( this );
			    	var wrapper = self.parents('.opalhotel-loops-wrapper:first');
			    	var sortable = wrapper.find( 'select[name="sortable"] option:selected' ).data( 'sortable' );

		    		var data = wrapper.data();
		    		var nData = [];
		    		nData.push({ name: 'sortable', value: sortable });
		    		for ( var i = 0; i < data.length; i++ ) {
		    			nData.push( { name: data[i].name, value: data[i].value } );
		    		}
		    		nData.push({ name: 'paged', value: self.data( 'paged' ) });
		    		OpalHotelSite.ajax_filter_hotel.load_hotels( wrapper, nData );
		    		return false;
			    } );
        	},

        	submitLayoutMode: function( e ) {
        		e.preventDefault();
				var wrapper = $(this).parents( '.opalhotel-loops-wrapper:first' );
				var data = [];
				data.push({ name: 'display', value: $( this ).find( 'button:focus' ).val() });
				data.push({ name: 'sortable', value: wrapper.find( 'select[name="sortable"] option:selected').data( 'sortable' ) });
				OpalHotelSite.ajax_filter_hotel.load_hotels( wrapper, data );	
        		return false;
        	},

        	// load hotels
        	load_hotels: function( wrapper, data ) {
    			var wdata = wrapper.data();
    			var sortable = wrapper.find( 'select[name="sortable"] option:selected' ).data('sortable');
    			if ( typeof data == 'undefined' ) {
    				var data = [];
    			}
    			// merge default arguments
				$.each( wdata, function( index, value ){
					data.push( { name: index, value: value } );
				} );

				data.push( { name: 'action', value: 'opalhotel_loops_hotel_ajax_action' } );

    			$.ajax({
        			url: OpalHotel.simpleAjaxUrl,
    				type: 'POST',
    				data: data,
    				beforeSend: function() {
    					wrapper.addClass( 'loading' );
    				}
    			}).always(function(){
    				for ( var i = 0; i < data.length; i++ ) {
	    				var item = data[i];
	    				if ( typeof item.name !== 'undefined' && ( item.name === 'args' || item.name === 'atts' || item.name === '_wp_http_referer' || item.name === 'departure' || item.name === 'arrival' ) ) {
	    					data.splice( i, 1 );
	    				}
	    			}
        			var hashString = $.param( data );
			        if ( window.history.pushState ) {
			            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?'+ hashString;
			            window.history.pushState( { path : newurl }, data, newurl );
			        }
			        opalhotel_jBox_init();
    			}).done(function( html ){
    				wrapper.removeClass( 'loading' );
    				wrapper.replaceWith( html );
    			}).fail(function(){

    			});
        	},

        	// Do Ajax Load Hotels
        	load_hotels_available: function( data ) {

        		// Stop ajax action before
        		if ( OpalHotelSite.ajax_filter_hotel.ajax && OpalHotelSite.ajax_filter_hotel.ajax.state() == 'pending' ) {
		            OpalHotelSite.ajax_filter_hotel.ajax.abort();
		        }

        		var wrapper = $('.opalhotel-hotel-available');

        		// merge default arguments
				$.each( wrapper.data(), function( index, value ){
					data.push( { name: index, value: value } );
				} );

				var sortable = wrapper.find( 'select[name="sortable"] option:selected' );
				if ( sortable.length == 1 ) {
					data.push({ name: 'sortable', value: sortable.data( 'sortable' ) });
				}

        		OpalHotelSite.ajax_filter_hotel.ajax = $.ajax({
        			type: 'POST',
        			url: OpalHotel.simpleAjaxUrl,
        			data: data,
        			beforeSend: function() {
        				wrapper.addClass( 'loading' );
        			}
        		}).always(function(){
	    			for ( var i = 0; i < data.length; i++ ) {
	    				var item = data[i];
	    				if ( typeof item.name !== 'undefined' && ( item.name === '_wp_http_referer' || item.name === 'departure' || item.name === 'arrival' ) ) {
	    					data.splice( i, 1 );
	    				}
	    			}
        			var hashString = $.param( data );
			        if ( window.history.pushState ) {
			            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?'+ hashString;
			            window.history.pushState( { path : newurl }, data, newurl );
			        }
			        opalhotel_jBox_init();
        		}).done(function( html ){
        			wrapper.replaceWith( html );
        		});

        		return OpalHotelSite.ajax_filter_hotel.ajax;
        	}

        },

    	// Load rooms availabel of hotel
    	load_rooms_of_hotel: function( e ) {
    		e.preventDefault();
    		var form = $( this );
    		var data = form.serializeArray();
    		var wrapper = $('.hotel-box.rooms-available');
    		var button = form.find('.opalhotel-button-submit');

    		$.ajax({
    			url: OpalHotel.simpleAjaxUrl,
    			type: 'POST',
    			data: data,
    			beforeSend: function() {
    				wrapper.addClass( 'loading' );
    				if ( typeof $.fn.button == 'function' ) {
    					button.button( 'loading' );
    				} else {
    					button.prepend( '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>' );
    					button.attr( 'disabled', true );
    				}
    			}
    		}).always(function(){
    			wrapper.removeClass( 'loading' );
    			if ( typeof $.fn.button == 'function' ) {
					button.button( 'reset' );
				} else {
					button.find( '.fa' ).remove();
					button.attr( 'disabled', false );
				}
    		}).done(function( html ){
    			var newData = [];
    			var states = [ 'arrival_datetime', 'departure_datetime', 'adult', 'child', 'number_of_rooms' ];
    			for ( var i = 0; i < data.length; i++ ) {
    				if ( states.indexOf( data[i].name ) >= 0 ) {
    					newData.push({ name: data[i].name, value: data[i].value });
    				}
    			}
    			var hashString = $.param( newData );
		        if ( window.history.pushState ) {
		            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?'+ hashString;
		            window.history.pushState( { path : newurl }, data, newurl );
		        }
    			wrapper.find( '.opalhotel-search-results' ).html( html );
    			// jBox Modal init
        		opalhotel_jBox_init();
    		});
    		return false;
    	}

	};

	$( document ).ready( function(){
		/* initialize*/
		OpalHotelSite.init();

	});

})(jQuery);