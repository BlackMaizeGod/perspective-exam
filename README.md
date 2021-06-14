This functional done was done on Magento 2.4.2. Within this functional:

- removed excess blocks from the layout.
- added mixin for the swatch-render widget, in which was added new method, which gets selected color option, parsed option id for getting color attribute id, then rolling jsonConfig.index(this is a widget option, which consists info about options & products-to-attributes relations and others) for finding product SKU and then makes ajax request to REST API "products" point for getting "short_description" attribute. For simplifying the implementation of this feature, I disabled configuration:  Stores > Settings > Configuration > Services > Magento Web API > Web API Security > Allow Anonymous Guest Access, but i understand that better to enable this configuration and add auth header or create a custom controller for getting 'short_description' attribute.
- image slider had not any changes, because fotorama API correctly does its job.
- dynamically changing price on configurable/bundle products is available "from the box"

Dynamically rendering description implemented only for "color" attribute, if you use anything else attribute on a configurable product it will not work, description will be shown only by color attribute.

I spent around 3h on code research and execution of this functional.


For reproducing this functional you just need:
- 2.4.2 instance
- installed module
- disabled configuration Stores > Settings > Configuration > Services > Magento Web API > Web API Security > Allow Anonymous Guest Access
- Configurable product with attribute "color" and "short_description"(for each simple) 
