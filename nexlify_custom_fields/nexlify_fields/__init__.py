from nexlify_custom_fields.nexlify_fields.linked_table import register as register_linked_table
from nexlify_custom_fields.nexlify_fields.nexlify_link import register as register_nexlify_link

def register_all(*args, **kwargs):
    register_linked_table()
    register_nexlify_link()
