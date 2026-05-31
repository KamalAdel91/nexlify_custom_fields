import frappe

def execute():
    meta = frappe.get_meta("DocField")
    field = meta.get_field("fieldtype")
    if field:
        options = (field.options or "").split("\n")
        updated = False
        for ft in ("Linked Table", "Nexlify Link"):
            if ft not in options:
                options.append(ft)
                updated = True
        if updated:
            field.options = "\n".join(options)
            frappe.db.set_value(
                "DocField", 
                {"fieldname": "fieldtype", "parent": "DocField"}, 
                "options", 
                field.options
            )
            frappe.db.commit()
            frappe.clear_cache(doctype="DocField")
