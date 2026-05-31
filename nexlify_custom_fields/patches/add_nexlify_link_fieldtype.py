import frappe

def execute():
    """Add 'Nexlify Link' to DocField fieldtype options."""
    meta = frappe.get_meta("DocField")
    field = meta.get_field("fieldtype")
    if field and "Nexlify Link" not in field.options:
        options = field.options.split("\n") if field.options else []
        options.append("Nexlify Link")
        field.options = "\n".join(options)
        frappe.db.set_value(
            "DocField",
            {"fieldname": "fieldtype", "parent": "DocField"},
            "options",
            field.options,
        )
        frappe.clear_cache(doctype="DocField")
