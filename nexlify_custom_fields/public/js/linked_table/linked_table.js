frappe.ui.form.ControlLinkedTable = class ControlLinkedTable extends frappe.ui.form.ControlHTML {
    make() {
        super.make();
        this.$wrapper = $(this.wrapper);
        $(this.disp_area).html(`<div class="linked-table-body"></div>`);
        this.field_labels = {};
    }

    refresh_input() {
        let $body = $(this.disp_area).find('.linked-table-body');
        if (!$body.length) {
            $(this.disp_area).html(`<div class="linked-table-body"></div>`);
            $body = $(this.disp_area).find('.linked-table-body');
        }

        if (!this.frm) return;

        let opts = {};
        try { opts = JSON.parse(this.df.options || '{}'); } catch(e) {}

        let child_doctype = opts.child_doctype;
        let filter_field  = opts.filter_field;
        let child_filter_field = opts.child_filter_field || filter_field;

        if (!child_doctype || !filter_field) {
            $body.html(`<p class="text-muted small">⚠️ Please specify child_doctype and filter_field</p>`);
            return;
        }

        let filter_value = this.frm.doc[filter_field];
        if (!filter_value) {
            $body.html(`<p class="text-muted small">No filter value found</p>`);
            return;
        }

        $body.html(`<p class="text-muted small">Loading...</p>`);

        let fetch_labels = frappe.call({
            method: 'nexlify_custom_fields.nexlify_fields.linked_table.api.get_doctype_fields_label',
            args: { doctype: child_doctype }
        });

        let fetch_data = frappe.call({
            method: 'nexlify_custom_fields.nexlify_fields.linked_table.api.get_linked_table_data',
            args: {
                doctype: child_doctype,
                filters: { [child_filter_field]: filter_value },
                fields: ['*']
            }
        });

        Promise.all([fetch_labels, fetch_data]).then(([labels_res, data_res]) => {
            if (labels_res.message) {
                this.field_labels = labels_res.message;
            }
            this.render_table($body, data_res.message || [], opts);
        });
    }

    render_table($body, rows, opts) {
        if (!rows.length) {
            $body.html(`<p class="text-muted small">No records found</p>`);
            return;
        }

        let technical_fields = ['name', 'owner', 'creation', 'modified', 'modified_by',
                                'docstatus', 'idx', 'parent', 'parentfield', 'parenttype',
                                'doctype', '_user_tags', '_comments', '_assign', '_liked_by'];

        let cols;
        if (opts.visible_columns && Array.isArray(opts.visible_columns)) {
            cols = opts.visible_columns;
        } else {
            cols = Object.keys(rows[0]).filter(k => !technical_fields.includes(k));
            if (cols.length === 0) {
                cols = ['name'];
            }
        }

        let thead = cols.map(c => {
            let label = this.field_labels[c] || c;
            return `<th>${label}</th>`;
        }).join('');

        let tbody = rows.map(row =>
            `<tr>${cols.map(c =>
                `<td>${row[c] !== null && row[c] !== undefined ? row[c] : ''}</td>`
            ).join('')}</tr>`
        ).join('');

        $body.html(`
            <div class="table-responsive">
                <table class="table table-bordered" style="margin-bottom:0;">
                    <thead><tr>${thead}</tr></thead>
                    <tbody>${tbody}</tbody>
                </table>
            </div>
        `);
    }
};

frappe.ui.form.controltype_map = frappe.ui.form.controltype_map || {};
frappe.ui.form.controltype_map['Linked Table'] = frappe.ui.form.ControlLinkedTable;

// Add to all_fieldtypes for Form Builder
frappe.model.all_fieldtypes = frappe.model.all_fieldtypes || [];
if (!frappe.model.all_fieldtypes.includes('Linked Table')) {
    frappe.model.all_fieldtypes.push('Linked Table');
}
