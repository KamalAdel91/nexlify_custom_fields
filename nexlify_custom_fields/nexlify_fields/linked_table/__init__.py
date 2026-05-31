import frappe.model as fm

FIELDTYPE_NAME = "Linked Table"

def register():
    """Register the Linked Table field type."""
    # Add to no_value_fields
    current = list(fm.no_value_fields)
    if FIELDTYPE_NAME not in current:
        current.append(FIELDTYPE_NAME)
        fm.no_value_fields = tuple(current)
    fm.NO_VALUE_FIELDS = frozenset(fm.no_value_fields)

    # Add to display_fieldtypes
    current_display = list(fm.display_fieldtypes)
    if FIELDTYPE_NAME not in current_display:
        current_display.append(FIELDTYPE_NAME)
        fm.display_fieldtypes = tuple(current_display)
