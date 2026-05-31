frappe.ui.form.ControlNexlifyLink = class ControlNexlifyLink extends frappe.ui.form.ControlAutocomplete {
    make() {
        super.make();
        this.$wrapper = $(this.wrapper);
    }

    // Override to prevent base class from treating JSON as option list
    get_options() {
        return [];
    }

    refresh_input() {
        super.refresh_input();
        this.setup_custom_autocomplete();
    }

    setup_custom_autocomplete() {
        let me = this;
        let opts = {};
        try {
            opts = JSON.parse(this.df.options || '{}');
        } catch(e) {}

        let target_doctype = opts.target_doctype;
        let display_field = opts.display_field;
        let filter_field = opts.filter_field;

        if (!target_doctype || !display_field) {
            return;
        }

        // Get filter value from current form if filter_field is specified
        let filter_value = null;
        if (filter_field && this.frm) {
            filter_value = this.frm.doc[filter_field];
        }

        // Wait for jQuery UI autocomplete to be available
        let init_autocomplete = function() {
            if (!me.$input || typeof me.$input.autocomplete !== 'function') {
                setTimeout(init_autocomplete, 100);
                return;
            }

            me.$input.autocomplete({
                source: function(request, response) {
                    frappe.call({
                        method: 'nexlify_custom_fields.nexlify_fields.nexlify_link.api.get_nexlify_link_options',
                        args: {
                            target_doctype: target_doctype,
                            display_field: display_field,
                            filter_field: filter_field,
                            filter_value: filter_value
                        },
                        callback: function(r) {
                            let data = r.message || [];
                            response(data.map(d => ({ label: d.label, value: d.value })));
                        }
                    });
                },
                autoSelect: true,
                minLength: 0
            });

            // Set initial display label if value is already present
            if (me.value) {
                me.set_display();
            }
        };

        init_autocomplete();
    }

    set_display() {
        // Fetch and display the label for the current value
        if (!this.value) return;
        let me = this;
        let opts = {};
        try { opts = JSON.parse(this.df.options || '{}'); } catch(e) {}
        if (!opts.target_doctype || !opts.display_field) return;
        frappe.call({
            method: 'nexlify_custom_fields.nexlify_fields.nexlify_link.api.get_nexlify_link_options',
            args: {
                target_doctype: opts.target_doctype,
                display_field: opts.display_field,
                filter_field: opts.filter_field,
                filter_value: this.frm.doc[opts.filter_field]
            },
            callback: function(r) {
                let data = r.message || [];
                let item = data.find(d => d.value === me.value);
                if (item) {
                    me.$input.val(item.label);
                }
            }
        });
    }
};

frappe.ui.form.controltype_map = frappe.ui.form.controltype_map || {};
frappe.ui.form.controltype_map['Nexlify Link'] = frappe.ui.form.ControlNexlifyLink;

// Add to all_fieldtypes for Form Builder
frappe.model.all_fieldtypes = frappe.model.all_fieldtypes || [];
if (!frappe.model.all_fieldtypes.includes('Nexlify Link')) {
    frappe.model.all_fieldtypes.push('Nexlify Link');
}
