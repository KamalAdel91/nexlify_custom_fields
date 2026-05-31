import frappe

@frappe.whitelist()
def get_nexlify_link_options(target_doctype, display_field, filter_field=None, filter_value=None):
    """Return list of {label, value} for the dropdown."""
    filters = {}
    if filter_field and filter_value:
        filters[filter_field] = filter_value
    fields = ["name", display_field]
    docs = frappe.get_all(target_doctype, filters=filters, fields=fields, limit=200)
    return [{"label": doc.get(display_field) or doc.name, "value": doc.name} for doc in docs]
