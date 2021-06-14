define([
    'jquery',
    'mage/url'
], function (
    $,
    urlBuilder
) {
    'use strict';

    var mixin = {
        /**
         * Event for swatch options
         *
         * @param {Object} $this
         * @param {Object} $widget
         * @private
         */
        _OnClick: function ($this, $widget) {
            var $parent = $this.parents('.' + $widget.options.classes.attributeClass),
                $wrapper = $this.parents('.' + $widget.options.classes.attributeOptionsWrapper),
                $label = $parent.find('.' + $widget.options.classes.attributeSelectedOptionLabelClass),
                attributeId = $parent.data('attribute-id'),
                $input = $parent.find('.' + $widget.options.classes.attributeInput),
                checkAdditionalData = JSON.parse(this.options.jsonSwatchConfig[attributeId]['additional_data']),
                $priceBox = $widget.element.parents($widget.options.selectorProduct)
                    .find(this.options.selectorProductPrice);

            if ($widget.inProductList) {
                $input = $widget.productForm.find(
                    '.' + $widget.options.classes.attributeInput + '[name="super_attribute[' + attributeId + ']"]'
                );
            }

            if ($this.hasClass('disabled')) {
                return;
            }

            if ($this.hasClass('selected')) {
                $parent.removeAttr('data-option-selected').find('.selected').removeClass('selected');
                $input.val('');
                $label.text('');
                $this.attr('aria-checked', false);
            } else {
                $parent.attr('data-option-selected', $this.data('option-id')).find('.selected').removeClass('selected');
                $label.text($this.data('option-label'));
                $input.val($this.data('option-id'));
                $input.attr('data-attr-name', this._getAttributeCodeById(attributeId));
                $this.addClass('selected');
                $widget._toggleCheckedAttributes($this, $wrapper);
            }

            $widget._Rebuild();

            if ($priceBox.is(':data(mage-priceBox)')) {
                $widget._UpdatePrice();
            }

            // Start Changes
            $widget.updateDescription();
            // End Changes

            $(document).trigger('updateMsrpPriceBlock',
                [
                    this._getSelectedOptionPriceIndex(),
                    $widget.options.jsonConfig.optionPrices,
                    $priceBox
                ]);

            if (parseInt(checkAdditionalData['update_product_preview_image'], 10) === 1) {
                $widget._loadMedia();
            }

            $input.trigger('change');
        },

        /**
         * Event for select
         *
         * @param {Object} $this
         * @param {Object} $widget
         * @private
         */
        _OnChange: function ($this, $widget) {
            var $parent = $this.parents('.' + $widget.options.classes.attributeClass),
                attributeId = $parent.data('attribute-id'),
                $input = $parent.find('.' + $widget.options.classes.attributeInput);

            if ($widget.productForm.length > 0) {
                $input = $widget.productForm.find(
                    '.' + $widget.options.classes.attributeInput + '[name="super_attribute[' + attributeId + ']"]'
                );
            }

            if ($this.val() > 0) {
                $parent.attr('data-option-selected', $this.val());
                $input.val($this.val());
            } else {
                $parent.removeAttr('data-option-selected');
                $input.val('');
            }

            $widget._Rebuild();
            $widget._UpdatePrice();
            $widget._loadMedia();

            // Start Changes
            $widget.updateDescription();
            // End Changes

            $input.trigger('change');
        },

        /**
         * This method update product short_description attribute
         */
        updateDescription: function () {
            var $selectedSwatchOption = $('.swatch-option.color.selected');

            if (!$selectedSwatchOption.attr('id')) {
                this.processDescriptionAttribute($('[itemprop="sku"]').html());

                return;
            }

            var attributeId = $selectedSwatchOption
                    .attr('id')
                    .split('color-').pop().split('-item')[0],
                    sku = '';

            if (!attributeId && !this.options.jsonConfig.index) {
                return;
            }

            Object.entries(this.options.jsonConfig.index).forEach(function (element) {
                if (Number(element[1][Number(attributeId)]) === $selectedSwatchOption.data('optionId')) {
                    sku = element[0];
                }
            });

            this.processDescriptionAttribute(this.options.jsonConfig.sku[Number(sku)]);
        },

        /**
         * This method make ajax request and replace product short description
         * @param {String} sku
         */
        processDescriptionAttribute: function (sku) {
            $.ajax({
                url: urlBuilder.build('rest/V1/products/' + sku),
                data: {
                    'fields': 'custom_attributes'
                },
                context: this,
                success: function (response) {
                    if (!response['custom_attributes']) {
                        return;
                    }

                    Object.entries(response['custom_attributes']).forEach(function (element) {
                        if(element[1]['attribute_code'] === 'short_description') {
                            $('.product.attribute.overview > .value').html('<p>' + element[1]['value'] + '</p>')
                        }
                    });
                }
            });
        }
    };

    return function (targetWidget) {
        $.widget('mage.SwatchRenderer', targetWidget, mixin);

        return $.mage.SwatchRenderer;
    };
});
