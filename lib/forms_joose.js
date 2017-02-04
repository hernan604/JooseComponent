(function () {
"use strict";

Role("ElemEvents", {
    requires : [
        'setElem', // requires other class to have attr elem -- or this.setElem
    ],
    has : {
        events : { is : "rw", init : ( function () { return {} } ) },
    },
    methods : {
        init_events : function () {
            var self = this;
            for ( var event in this.events ) {
                if ( this.events.hasOwnProperty( event ) ) {
                    this.elem[ event ]( function ( ev ) { 
                        //[].unshift.call(arguments, self);
                        self.events[ event ].apply(self, arguments );
                    } )
                }
            }
        },
    },
    after : {
        render : function () {
            this.init_events();
        }
    }
})

Role( "BeforeAfter", {
    has : {
        before_initialize : { is : "rw" },
        after_initialize : { is : "rw" },
        before_render : { is : "rw" },
        after_render : { is : "rw" },
        before_appendTo : { is : "rw" },
        after_appendTo : { is : "rw" },
        before_prependTo : { is : "rw" },
        after_prependTo : { is : "rw" },
    },
    before : {
        initialize : function () {
            if ( this.before_initialize ) {
                this.before_initialize();
            }
        },
        render : function () {
            if ( this.before_render ) {
                this.before_render();
            }
        },
        appendTo : function () {
            if ( this.before_appendTo ) {
                this.before_appendTo();
            }
        },
        prependTo : function () {
            if ( this.before_prependTo ) {
                this.before_prependTo();
            }
        },
    },
    after : {
        initialize : function () {
            if ( this.after_initialize ) {
                this.after_initialize();
            }
        },
        render : function () {
            if ( this.after_render ) {
                this.after_render();
            }
        },
        appendTo : function () {
            if ( this.after_appendTo ) {
                this.after_appendTo();
            }
        },
        prependTo : function () {
            if ( this.after_prependTo ) {
                this.after_prependTo();
            }
        },
    },
} )

Role("Elem", {
    does : [ BeforeAfter ],
    has : {
        elem : { is : "rw" },
        content : { is : "rw" },
        css_class : { is : "rw" },
        form : { is : "rw" },
        form_field : { is : "rw" },
        is_required : { is : "rw", init : ( function () { return false } ) },
    },
    before : {
        initialize : function () {
        }
    },
    methods : {
        render : function () {
            this.elem.html( this.content );
        },
        show : function () {
            this.elem.show();
        },
        hide : function () {
            this.elem.hide();
        },
        add_error : function ( error ) {
            this.form_field.errors.push( error );
        },
        trigger : function ( event ) {
            //shortcut to field_data
            this.field_data.elem.trigger( event );
        },
        appendTo : function ( elem ) {
            this.elem.appendTo( elem )
        },
        prependTo : function ( elem ) {
            this.elem.prependTo( elem )
        },
        append : function ( elem ) {
            this.elem.append( elem )
        },
        prepend : function ( elem ) {
            this.elem.prepend( elem )
        },
    },
    after : {
        initialize : function () {
            this.render();
        },
    },
});

Class("FormButton", {
    does : [ Elem, ElemEvents ],
    has : {
    },
    before : {
        initialize : function () {
            this.setElem( $( "<button/>" ) );
        }
    },
    methods : {
        render : function () {
            this.elem.html( this.content );
        },
    },
});

Class("FormFieldInput", {
    does : [ Elem, ElemEvents ],
    has : {
        placeholder : { is : "rw" },
        value : { is : "rw" },
        validate : { is : "rw" },
    },
    before : {
        initialize : function () {
            this.setElem( $( '<input/>' ) );
        }
    },
    methods : {
        render : function () {
            this.elem.addClass( this.css_class )
            this.elem.attr( 'placeholder', this.placeholder )
            this.elem.val( this.value )
            return this;
        },
        hide_validation_errors : function () {
            this.elem.removeClass('has_error');
        },
        show_validation_errors : function () {
            this.elem.addClass('has_error')
        },
        set_value : function ( value ) {
            this.elem.val( value )
        },
        get_value : function () {
            return this.elem.val();
        },
        clear : function () {
            this.elem.val('')
        }
    },
})

Class("FormFieldCheckbox", {
    does : [ Elem, ElemEvents ],
    has : {
        value : { is : "rw" },
        validate : { is : "rw" },
    },
    before : {
        initialize : function () {
            this.setElem( $( '<input/>' ).attr('type', 'checkbox') );
        }
    },
    methods : {
        set_value : function ( value ) {
            this.elem.prop( 'checked', value )
        },
        get_value : function () {
            return this.elem.prop( 'checked' );
        },

        hide_validation_errors : function () {
            this.elem.removeClass('has_error');
        },
        show_validation_errors : function () {
            this.elem.addClass('has_error')
        },
        clear : function () {
            this.elem.prop('checked', false)
        }
    }
});

Class("FormFieldSelect", {
    does : [ Elem, ElemEvents ],
    has : {
        value : { is : "rw" },
        validate : { is : "rw" },

        options : { is : "rw", init : ( function () { return [] } )() },
        is_multiple : { is : "rw" },
    },
    before : {
        initialize : function () {
            this.setElem( $( '<select/>' ).attr('type', 'checkbox') );
        }
    },
    methods : {
        set_value : function ( value ) {
            this.elem.val( value );
        },
        get_value : function () {
            return this.elem.val();
        },

        hide_validation_errors : function () {
            this.elem.removeClass('has_error');
        },
        show_validation_errors : function () {
            this.elem.addClass('has_error')
        },
        clear : function () {
            this.elem.val('');
        },
        update : function ( options ) {
            if ( options ) { this.setOptions( options ) }
            this.elem.html('');
            for ( var i = 0, item ; item = this.options[ i++ ] ; ) {
                this.elem.append( $('<option>', item ) ); 
            }
        }
    },
    after : {
        initialize : function () {
        },
        render : function () {
            this.update();
            this.elem.attr('multiple', this.is_multiple )
        }
    }
})

Class("FormFieldTable", {
    does : [ Elem, ElemEvents ],
    has : {
        column : { is : "rw", init: ( function () { return {} } ) },
        columns : { is : "rw", init: ( function () { return [] } ) },
        value : { is : "rw", init: ( function () { return [] } ) },
    },
    before : {
        initialize : function () {
            this.setElem( $( '<table/>' ).addClass('table').addClass('table-bordered') );
        }
    },
    methods : {
        clear : function () {
        },
        update : function ( value ) {
            if ( value ) {
                this.setValue( value )
            }
            this.elem.html('');
            this.set_headers();
            var tbody = $( '<tbody/>' );
            tbody.appendTo( this.elem );
            console.log('set items', this.value );
            for ( var i = 0, item; item = this.value[ i++ ] ;  ) {
            console.log( item );
                var tr = $('<tr/>');
                for ( var k in item ) {
                    if ( this.column[ k ] ) {
                        var td = $('<td/>').html( this.column[ k ].build( item, item[ k ] ) );
                        td.appendTo(tr);
                    }
                }
                tr.appendTo( tbody )
                console.log( tr );
            }
            console.log( this.elem )
        },
        set_headers : function () {
            var thead = $('<thead/>');
            var tr = $('<tr/>');
            thead.appendTo( this.elem );
            tr.appendTo( thead );
            for ( var i = 0, item ; item = this.columns[ i++ ] ; ) {
                $('<td/>').html( item.label ).appendTo(tr);
            }
        },
        set_value : function ( value ) {
            this.update( value );
        }
    },
    after : {
        setColumns : function () {
            var column = {}
            for ( var i=0, col; col = this.columns[ i++ ] ; ) {
                column[ col.id ] = col;
            }
            this.setColumn( column );
        },
        render : function ( ) {
            this.update();
        },
    }
})

Class("FormFieldLabel", {
    does : [ Elem, ElemEvents ],
    has : {
    },
    before : {
        initialize : function () {
            this.setElem( $( '<label/>' ) );
        }
    },
    methods : {
        render : function () {
            this.elem.html( this.content )
        }
    },
    after : {
        initialize : function () {
            this.render();
        }
    },
} )

Class("SectionHeader", {
	does : [ Elem, ElemEvents ],
	has : {},
	before : {
        initialize : function () {
            this.setElem( $( '<h2/>' ) );
        }
	},
	methods : {
		render : function () {
			this.elem.html( this.content )
		}
	},
	after : {
        initialize : function () {
            this.render();
        }
	},
});

Class("FormField", {
    does : [ Elem, ElemEvents ],
    has : {
        id : { is : 'rw', },
        field_label : { is : "rw" },
        field_data : { is : "rw" },

        errors : { is : "rw", init : ( function () { return [] } ) },
    },
    before : {
        initialize : function () {
            this.setElem( $( '<ul/>' ) );
        }
    },
    methods : {
        set_label : function ( elem ) {
            this.setField_label( elem );
            return this;
        },
        set_data_field : function ( elem ) {
            this.setField_data( elem );
            return this;
        },
        render : function () {
            this.elem.addClass('field').addClass( this.css_class ).attr( 'id', this.id );
            return this;
        },
        get_value : function () {
            return this.field_data.get_value();
        },
        validate : function () {
            this.setErrors( [] );
            if ( ! this.field_data || ! this.field_data.get_value ) { return }
            var value = this.field_data.get_value();
            if ( this.is_required && ( typeof value == 'undefined' || value === '' ) ) {
                this.errors.push('This field is required.');
            }
            if ( this.field_data.validate ) {
                this.field_data.validate( this.field_data.get_value() );
            }
        },
        hide_validation_errors : function ( ) {
            this.elem.removeClass('has_error');
            this.elem.find('.error_list').remove();
        },
        show_validation_errors : function () {
            this.elem.addClass('has_error')
            var error_list = $('<ul/>');
            for ( var i = 0, error; error = this.errors[ i++ ] ; ) {
                error_list.append( $('<li/>').html( error ) );
            }
            $( '<li/>' ).addClass('error_list').html( error_list ).appendTo( this.elem )
        },
        set_value : function ( value ) {
            this.field_data.set_value( value );
        },
        clear : function () {
            if ( ! this.field_data || ! this.field_data.clear ) { return } 
            this.field_data.clear()
        }
    },
    after : {
        initialize : function () {
        },
        setForm : function () {
            if ( this.field_label ) {
                this.field_label.setForm( this.form );
                this.field_label.setForm_field( this );
            }
            if ( this.field_data ) {
                this.field_data.setForm( this.form );
                this.field_data.setForm_field( this );
            }
        },
        setField_label :  function () { 
            $('<li/>').addClass('label').append(this.field_label.elem).appendTo( this.elem );
            this.field_label.setForm( this.form );
            this.field_label.setForm_field( this ); 
        },
        setField_data :  function () { 
            $('<li/>').addClass('input').append(this.field_data.elem).appendTo( this.elem );

            this.field_data.setForm( this.form );
            this.field_data.setForm_field( this );
        },
    },
})

Class("Form", {
    does : [ Elem, ElemEvents ],
    has : {
        fields : { is : 'rw', init: ( function () { return [] } ) },
        field : { is : 'rw', init: ( function () { return {} } ) },
        is_valid : { is : 'rw' }
    },
    before : {
        initialize : function () {
            this.setElem( $( '<ul/>' ).addClass('field_list') );
        }
    },
    methods : {
        validate : function () {
            //check each vield value and make sure all of them are valid
            var is_valid = true;
            for ( var id in this.field ) {
                if ( this.field.hasOwnProperty( id ) ) {
                    var field = this.field[ id ];
                    field.validate();
                    field.hide_validation_errors();
                    if ( field.errors.length ) {
                        is_valid = false;
                        field.show_validation_errors();
                    }
                }
            }
            this.setIs_valid( is_valid );
            return this.setIs_valid;
        },
        render: function () {
            this.elem.addClass(this.css_class)
            this.render_elements( this.fields );
        },
        render_elements : function ( elements ) {
            for ( var i = 0, fields; fields = elements[ i++ ] ; ) {
                var li = $( '<li/>' ).addClass('field_row').appendTo( this.elem );
                for ( var j = 0, field; field = fields[j++]; ) {
                    if ( field.id ) { this.field[ field.id ] = field; }
                    field.setForm( this );
                    li.append( field.elem )
                }
            }
        },
        fill : function ( obj ) {
            for ( var attr in obj ) {
                if ( obj.hasOwnProperty( attr ) ) {
                    try {
                        this.field[ attr ].set_value( obj[ attr ] );
                    } catch ( e ) {}
                }
            }
        },
        clear : function () {
            var elements = this.fields;
            for ( var i = 0, fields; fields = elements[ i++ ] ; ) {
                for ( var j = 0, field; field = fields[j++]; ) {
                    if ( field.hide_validation_errors ) {
                        field.hide_validation_errors();
                    }
                    if ( field.clear ) {
                        field.clear();
                    }
                }
            }
        }
    },
    after : {
        initialize : function () {
        }
    },
})

})()
