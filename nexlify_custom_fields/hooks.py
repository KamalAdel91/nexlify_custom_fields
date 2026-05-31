from . import __version__ as app_version

app_name = "nexlify_custom_fields"
app_title = "Nexlify Custom Fields"
app_publisher = "Nexlify"
app_description = "Custom field types for Frappe"
app_email = "info@nexlify.com"
app_license = "MIT"

app_include_js = [
    "/assets/nexlify_custom_fields/js/linked_table/linked_table.js?v=11",
    "/assets/nexlify_custom_fields/js/nexlify_link/nexlify_link.js?v=8"
]

boot_session = "nexlify_custom_fields.nexlify_fields.register_all"

after_migrate = [
    "nexlify_custom_fields.nexlify_fields.register_all"
]

patches = [
    "nexlify_custom_fields.patches.add_custom_fieldtypes.execute"
]
