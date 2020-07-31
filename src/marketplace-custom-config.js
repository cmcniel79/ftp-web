/*
 * Marketplace specific configuration.
 *
 * Every filter needs to have following keys:
 * - id:     Unique id of the filter.
 * - label:  The default label of the filter.
 * - type:   String that represents one of the existing filter components:
 *           BookingDateRangeFilter, KeywordFilter, PriceFilter,
 *           SelectSingleFilter, SelectMultipleFilter.
 * - group:  Is this 'primary' or 'secondary' filter?
 *           Primary filters are visible on desktop layout by default.
 *           Secondary filters are behind "More filters" button.
 *           Read more from src/containers/SearchPage/README.md
 * - queryParamNames: Describes parameters to be used with queries
 *                    (e.g. 'price' or 'pub_amenities'). Most of these are
 *                    the same between webapp URLs and API query params.
 *                    You can't change 'dates', 'price', or 'keywords'
 *                    since those filters are fixed to a specific attribute.
 * - config: Extra configuration that the filter component needs.
 *
 * Note 1: Labels could be tied to translation file
 *         by importing FormattedMessage:
 *         <FormattedMessage id="some.translation.key.here" />
 *
 * Note 2: If you need to add new custom filter components,
 *         you need to take those into use in:
 *         src/containers/SearchPage/FilterComponent.js
 *
 * Note 3: If you just want to create more enum filters
 *         (i.e. SelectSingleFilter, SelectMultipleFilter),
 *         you can just add more configurations with those filter types
 *         and tie them with correct extended data key
 *         (i.e. pub_<key> or meta_<key>).
 */

export const filters = [
  {
    id: 'categories',
    label: 'Categories',
    type: 'SelectSingleFilter',
    group: 'primary',
    // Note: BookingDateRangeFilter is fixed filter,
    // you can't change "queryParamNames: ['dates'],"
    queryParamNames: ['pub_categories'],
    config: {
    options: [
      { key: 'jewelry', label: 'Jewelry',
        subCategories: [
          { key: 'necklaces', label: 'Necklaces'},
          { key: 'earrings', label: 'Earrings'},
          { key: 'rings', label: 'Rings'},
          { key: 'bracelets', label: 'Bracelets'},
          { key: 'anklets', label: 'Anklets'},
        ]
      },
      { key: 'accessories', label: 'Accessories',
        subCategories: [
          { key: 'bags', label: 'Bags'},
          { key: 'belts', label: 'Belts'},
          { key: 'hair', label: 'Hair Accessories'},
          { key: 'hats', label: 'Hats'},
          { key: 'scarves', label: 'Scarves'},
          { key: 'sunglasses', label: 'Sunglasses'},
          { key: 'ties', label: 'Ties'},
          { key: 'lanyards', label: 'Lanyards'},
        ] 
      },
      { key: 'apparel', label: 'Apparel',
        subCategories: [
          { key: 'tops', label: 'Tops'},
          { key: 'bottoms', label: 'Bottoms'},
          { key: 'dresses', label: 'Dresses'},
          { key: 'shoes', label: 'Shoes'},
        ] 
      },
      { key: 'traditional', label: 'Traditional Assortments',
        subCategories: [
          { key: 'botanicals', label: 'Botanicals'},
          { key: 'regalia', label: 'Regalia'},
        ] 
      },
      { key: 'art', label: 'Art',
        subCategories: [
          { key: 'paintings', label: 'Paintings'},
          { key: 'beadwork', label: 'Beadwork'},
          { key: 'photo', label: 'Photography'},
          { key: 'prints', label: 'Prints'},
          { key: 'stickers', label: 'Stickers & Patches'},
          { key: 'carvings', label: 'Carvings'},
          { key: 'baskets', label: 'Baskets & Pottery'},
          { key: 'rugs', label: 'Rugs & Weaving'},
        ] },
      { key: 'beauty', label: 'Beauty Products',
        subCategories: [
          { key: 'skincare', label: 'Skincare'},
          { key: 'makeup', label: 'Makeup'},
        ]
       },
      { key: 'crafting', label: 'Crafting Supplies',
        subCategories: [
          { key: 'beading', label: 'Beading Supplies'},
          { key: 'jewelry', label: 'Jewelry Making'},
        ]
       },
      { key: 'other', label: 'Other' },
    ],
  },
},
  {
    id: 'price',
    label: 'Price',
    type: 'PriceFilter',
    group: 'primary',
    // Note: PriceFilter is fixed filter,
    // you can't change "queryParamNames: ['price'],"
    queryParamNames: ['price'],
    // Price filter configuration
    // Note: unlike most prices this is not handled in subunits
    config: {
      min: 0,
      max: 1000,
      step: 5,
    },
  },
  {
    id: 'region',
    label: 'Region',
    type: 'SelectSingleFilter',
    group: 'primary',
    queryParamNames: ['pub_region'],
    // NOTE: If you are ordering search results by distance
    // the keyword search can't be used at the same time.
    // You can turn on/off ordering by distance from config.js file.
    config: {
    options: [
      { key: 'plains', label: 'Plains' },
      { key: 'southwest', label: 'Southwest' },
      { key: 'northwest', label: 'Pacific Northwest' },
      { key: 'west', label: 'West Coast' },
      { key: 'east', label: 'Eastern U.S.' },
      { key: 'pacific', label: 'Pacific Islands' },
      { key: 'alaska', label: 'Alaska and Arctic' },
      { key: 'central', label: 'Central and South America' },
      { key: 'africa', label: 'Africa' },
      { key: 'asia', label: 'Asia' },
    ],
  },
},
  {
    id: 'style',
    label: 'Style',
    type: 'SelectSingleFilter',
    group: 'primary',
    queryParamNames: ['pub_style'],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'contemporary', label: 'Contemporary' },
        { key: 'traditional', label: 'Traditional' },
      ],
    },
  },
  {
    id: 'material',
    label: 'Material',
    type: 'SelectMultipleFilter',
    group: 'primary',
    queryParamNames: ['pub_material'],
    config: {
      // Optional modes: 'has_all', 'has_any'
      // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
      searchMode: 'has_any',

      // "key" is the option you see in Flex Console.
      // "label" is set here for this web app's UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'turquoise', label: 'Turquoise', },

        { key: 'coral', label: 'Coral',},
        
        { key: 'silver', label: 'Silver',},
        
        { key: 'copper', label: 'Copper', },

        { key: 'beaded', label: 'Beaded', },

        { key: 'gold', label: 'Gold', },
      ],
    },
  },
];

export const sortConfig = {
  // Enable/disable the sorting control in the SearchPage
  active: true,

  // Note: queryParamName 'sort' is fixed,
  // you can't change it since Flex API expects it to be named as 'sort'
  queryParamName: 'sort',

  // Internal key for the relevance option, see notes below.
  relevanceKey: 'relevance',

  // Keyword filter is sorting the results already by relevance.
  // If keyword filter is active, we need to disable sorting.
  conflictingFilters: ['keyword'],

  options: [
    { key: 'createdAt', label: 'Newest' },
    { key: '-createdAt', label: 'Oldest' },
    { key: '-price', label: 'Lowest price' },
    { key: 'price', label: 'Highest price' },

    // The relevance is only used for keyword search, but the
    // parameter isn't sent to the Marketplace API. The key is purely
    // for handling the internal state of the sorting dropdown.
    { key: 'relevance', label: 'Relevance', longLabel: 'Relevance (Keyword search)' },
  ],
};
