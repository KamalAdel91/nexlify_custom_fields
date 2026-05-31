import frappe.model as fm

FIELDTYPE_NAME = "Nexlify Link"

def register():
    # Add to display_fieldtypes (so it appears in form builder)
    current_display = list(fm.display_fieldtypes)
    if FIELDTYPE_NAME not in current_display:
        current_display.append(FIELDTYPE_NAME)
        fm.display_fieldtypes = tuple(current_display)
