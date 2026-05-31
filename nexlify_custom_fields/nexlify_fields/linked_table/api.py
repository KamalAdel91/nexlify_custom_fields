import frappe

@frappe.whitelist()
def get_linked_table_data(doctype, filters=None, fields=None):
    if isinstance(filters, str):
        filters = frappe.parse_json(filters)
    if isinstance(fields, str):
        fields = frappe.parse_json(fields)
    if not fields:
        fields = ["*"]
    return frappe.get_all(doctype, filters=filters, fields=fields, limit=100)

@frappe.whitelist()
def get_doctype_fields_label(doctype):
    meta = frappe.get_meta(doctype)
    return {field.fieldname: field.label for field in meta.fields}
