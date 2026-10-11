const PROD_CLIENT_INDEX = [
    {
        "client_id": 1, //colpal
        "elastic_type": "aws",
        "ebux_platform": "colpal_platform_prod",
        "ebux_new_location": "colpal_new_location_prod",
        "ebux_brands": "colpal_brands_prod",
        "ebux_brand_category": "colpal_brand_category_prod",
        "ebux_products": "colpal_products_prod",
        "ebux_keyword": "colpal_keyword_prod",
        "ebux_kw": "colpal_kw_prod",
        "ebux_review": "colpal_review_prod",
        "pdp_index": "colpal_pdp_prod",
        "banners_crawl": "colpal_banners_crawl_prod",
        "ebux_pdp_compitition_brand": "colpal_pdp_comp_map",
        "ebux_kw_compitition_brand": "colpal_pdp_comp_map",
        "ebux_sentiments_analysis": "sentiment_analysis",

        // "elastic_type": "aws_open_searh",
        // "ebux_platform": "colpal_platform",
        // "ebux_new_location": "colpal_location",
        // "ebux_brands": "colpal_brands",
        // "ebux_brand_category": "colpal_brand_category",
        // "ebux_products": "colpal_products",
        // "ebux_keyword": "colpal_keyword",
        // "ebux_kw": "colpal_kw",
        // "ebux_review": "colpal_review",
        // "pdp_index": "colpal_pdp",
        // "banners_crawl":"colpal_banners_crawl",
        // "ebux_pdp_compitition_brand": "colpal_brands",
        // "ebux_kw_compitition_brand": "colpal_brands",
        // "ebux_sentiments_analysis": "colpal_sentiment_analysis",

    },
    {

        "client_id": 10, //ColPal MT
        "elastic_type": "aws",
        "ebux_platform": "colgate_mt_platform_prod",
        "ebux_new_location": "colgate_mt_location_prod",
        "ebux_brands": "colgate_mt_brands_prod",
        "ebux_brand_category": "colgate_mt_brand_category_prod",
        "ebux_products": "colgate_mt_products_prod",
        "pdp_index": "colgate_mt_pdp_prod",
        "ebux_keyword": "colgate_mt_keyword_prod",
        "ebux_kw": "colgate_mt_kw_prod",
        "ebux_review": "",
        "ebux_pdp_compitition_brand": "colgate_mt_brands_prod",
        "ebux_kw_compitition_brand": "colgate_mt_brands_prod"
    },
    {
        "client_id": 2, //nestle
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws_new_es",
        "ebux_platform": "platform_nestle",
        // "ebux_new_location": "location_nestle",
        "ebux_new_location": "nestle_location_master",
        "ebux_brands": "brands_nestle",
        "ebux_combined_filter_pdp": "nestle_combined_filter",
        "ebux_combined_filter_kw": "nestle_kw_filter",
        "ebux_combined_filter_som": "nestle_som_filter",
        "ebux_brands_dark_store": "nestle_brand_category_product",
        "ebux_kw_brands": "nestle_kw_brands",

        "ebux_brand_category": "brand_category_nestle",
        "ebux_products": "products_nestle",
        // "pdp_index": "pdp_nestle",
        "pdp_index": "nestle_pdp_combined",
        "pdp_index_dark_store": "nestle_pdp_combined",
        // "pdp_index_dark_store": "nestle_pdp_darkstore",
        // "ebux_new_location_dark_store":"nestle_location_master",
        "ebux_new_location_dark_store": "nestle_location_master",
        "ebux_keyword": "keyword_nestle",
        "ebux_kw": "kw_nestle",
        "ebux_review": "review_nestle",
        "ebux_pdp_compitition_brand": "pdp_competition_mapping_nestle",
        "ebux_kw_compitition_brand": "kw_competition_mapping_nestle",
        "ebux_sentiments_analysis": "nestle_sentiment_analysis",
        "ebux_som_nestle": "keyword_som_nestle",
        "ebux_som_kw": "som_nestle",
        //   "ebux_pdp_darkstore":"nestle_pdp_darkstore",
        "ebux_pdp_darkstore": "nestle_pdp_combined",
        "dark_store_location": "nestle_location_master",
    },
    {
        "client_id": 2,
        "client_project_es_id": "zepto", //nestle
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws_new_es",
        "ebux_new_location": "demo_nestle_location_filter",
        "ebux_combined_filter_pdp": "demo_nestle_brand_category_product",
        "ebux_brands_dark_store": "demo_nestle_brand_category_product",
        "pdp_index": "demo_nestle_pdp_zepto",
        "pdp_index_dark_store": "demo_nestle_pdp_zepto",
        "ebux_new_location_dark_store": "demo_nestle_location_filter",
        "ebux_review": "review_nestle",
        "ebux_pdp_compitition_brand": "pdp_competition_mapping_nestle",
        "ebux_pdp_darkstore": "demo_nestle_pdp_zepto",
        "dark_store_location": "demo_nestle_location_filter",
    },
    // { //// index deleted on 11-may-2026 1:07 PM in (AGL+HDL) 1Commerce group
    //     "client_id": 2,
    //     "client_project_es_id": "7dayoos", //nestle
    //     // "elastic_type": "aws_open_searh",
    //     "elastic_type": "aws_new_es",
    //     // "ebux_new_location": "nestle_location_master",//curently useing in production
    //     "ebux_new_location": "nestle_location_master_qa",//for qa and uat testing
    //     // "ebux_combined_filter_pdp": "nestle_combined_filter",//curently useing in production
    //     "ebux_combined_filter_pdp": "nestle_combined_filter_qa",//for qa and uat testing
    //     // "ebux_brands_dark_store": "nestle_brand_category_product",//curently useing in production
    //     "ebux_brands_dark_store": "nestle_brand_category_product_qa",//for qa and uat testing
    //     // "pdp_index": "nestle_pdp_combined_7_days_test",//curently useing in production
    //     "pdp_index": "nestle_pdp_combined_7_days",//for qa and uat testing
    //     // "pdp_index_dark_store": "nestle_pdp_combined_7_days_test",//curently useing in production
    //     "pdp_index_dark_store": "nestle_pdp_combined_7_days",//for qa and uat testing
    //     // "ebux_new_location_dark_store": "nestle_location_master",//curently useing in production
    //     "ebux_new_location_dark_store": "nestle_location_master_qa",//for qa and uat testing
    //     "ebux_review": "review_nestle",
    //     "ebux_pdp_compitition_brand": "pdp_competition_mapping_nestle",
    //     // "ebux_pdp_darkstore": "nestle_pdp_combined_7_days_test",//curently useing in production
    //     "ebux_pdp_darkstore": "nestle_pdp_combined_7_days",//for qa and uat testing
    //     // "dark_store_location": "nestle_location_master",//curently useing in production
    //     "dark_store_location": "nestle_location_master_qa",//for qa and uat testing
    //     "ebux_platform": "platform_nestle",
    //     "ebux_brands": "brands_nestle",
    //     "ebux_combined_filter_kw": "nestle_kw_filter",
    //     "ebux_combined_filter_som": "nestle_som_filter",
    //     "ebux_kw_brands": "nestle_kw_brands",

    //     "ebux_brand_category": "brand_category_nestle",
    //     "ebux_products": "products_nestle",
    //     "ebux_keyword": "keyword_nestle",
    //     "ebux_kw": "kw_nestle",
    //     "ebux_kw_compitition_brand": "kw_competition_mapping_nestle",
    //     "ebux_sentiments_analysis": "nestle_sentiment_analysis",
    //     "ebux_som_nestle": "keyword_som_nestle",
    //     "ebux_som_kw": "som_nestle"
    // },
    {
        "client_id": 2,
        "client_project_es_id": "7dayoos-Dark-Store-Status", //nestle
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws_new_es",
        // "ebux_new_location": "nestle_location_master",
        "ebux_new_location": "nestle_location_active_filter",
        "ebux_combined_filter_pdp": "nestle_combined_filter",
        "ebux_brands_dark_store": "nestle_brand_category_product",
        //"pdp_index": "nestle_pdp_combined_7_days_logic",
        //"pdp_index": "nestle_pdp_combined_7_days_test",        
        "pdp_index": "nestle_pdp_combined_7_active_status",
        //"pdp_index_dark_store": "nestle_pdp_combined_7_days_logic",
        //"pdp_index_dark_store": "nestle_pdp_combined_7_days_test",
        "pdp_index_dark_store": "nestle_pdp_combined_7_active_status",
        // "ebux_new_location_dark_store":"nestle_location_master",
        "ebux_new_location_dark_store": "nestle_location_active_filter",
        "ebux_review": "review_nestle",
        "ebux_pdp_compitition_brand": "pdp_competition_mapping_nestle",
        //"ebux_pdp_darkstore":"nestle_pdp_combined_7_days_logic",
        //"ebux_pdp_darkstore":"nestle_pdp_combined_7_days_test",
        "ebux_pdp_darkstore": "nestle_pdp_combined_7_active_status",
        // "dark_store_location":"nestle_location_master",
        "dark_store_location": "nestle_location_active_filter",
        "ebux_platform": "platform_nestle",
        "ebux_brands": "brands_nestle",
        "ebux_combined_filter_kw": "nestle_kw_filter",
        "ebux_combined_filter_som": "nestle_som_filter",
        "ebux_kw_brands": "nestle_kw_brands",

        "ebux_brand_category": "brand_category_nestle",
        "ebux_products": "products_nestle",
        "ebux_keyword": "keyword_nestle",
        "ebux_kw": "kw_nestle",
        "ebux_kw_compitition_brand": "kw_competition_mapping_nestle",
        "ebux_sentiments_analysis": "nestle_sentiment_analysis",
        "ebux_som_nestle": "keyword_som_nestle",
        "ebux_som_kw": "som_nestle"
    },
    {
        "client_id": 2,
        "client_project_es_id": "7dayoos_date_wise_filter", //nestle
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws_new_es",
        "ebux_new_location": "nestle_location_filter_data",//for qa and uat testing
        "ebux_new_location_dark_store": "nestle_location_filter_data",//for qa and uat testing
        "dark_store_location": "nestle_location_filter_data",//for qa and uat testing
        "ebux_combined_filter_pdp": "nestle_combined_filter_data",//for qa and uat testing
        "ebux_brands_dark_store": "nestle_darkstore_filter_data",//for qa and uat testing
        "pdp_index": "nestle_pdp_combined_7_days_historic",//for qa and uat testing
        "pdp_index_dark_store": "nestle_pdp_combined_7_days_historic",//for qa and uat testing
        "ebux_pdp_darkstore": "nestle_pdp_combined_7_days_historic",//for qa and uat testing
        "ebux_review": "review_nestle",
        "ebux_pdp_compitition_brand": "pdp_competition_mapping_nestle",
        "ebux_platform": "platform_nestle",
        "ebux_brands": "brands_nestle",
        // "ebux_combined_filter_kw": "nestle_kw_historic_filter",  //nestle_kw_filter
        "ebux_combined_filter_kw": "nestle_kw_historic_filter_new",
        "ebux_combined_filter_som": "nestle_som_historic_filter", //nestle_som_filter
        "ebux_kw_brands": "nestle_kw_brands",

        "ebux_brand_category": "brand_category_nestle",
        "ebux_products": "products_nestle",
        "ebux_keyword": "keyword_nestle",
        "ebux_kw": "kw_nestle",
        "ebux_kw_compitition_brand": "kw_competition_mapping_nestle",
        "ebux_sentiments_analysis": "nestle_sentiment_analysis",
        "ebux_som_nestle": "keyword_som_nestle",
        "ebux_som_kw": "som_nestle",
        "ebux_kw_location": "nestle_location_kw_historic", //nestle_location_master_kw
        "ebux_som_location": "nestle_location_som_historic", // new add on
        "ebux_pdp_compitition_combined_filter": "nestle_combined_filter_7days"
    },
    {
        "client_id": 3, //Coca Cola
        "elastic_type": "aws",
        "ebux_platform": "coke_platform",
        "ebux_new_location": "coke_location",
        "ebux_brands": "coke_brands",
        "ebux_brand_category": "coke_brand_category",
        "ebux_products": "coke_products",
        "pdp_index": "coke_pdp",
        "ebux_keyword": "coke_keyword",
        "ebux_kw": "coke_kw",
        "ebux_review": "coke_review"
    },
    {
        "client_id": 4, //perfetti
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws",
        "ebux_platform": "perfetti_platform",
        "ebux_new_location": "perfetti_location",
        "ebux_brands": "perfetti_brands",
        "ebux_brand_category": "perfetti_brand_category",
        "ebux_products": "perfetti_products",
        // "pdp_index": "perfetti_pdp",
        // "pdp_index": "perfetti_pdp_new",
        // "pdp_index": "perfetti_pdp_new_with_mrp",//with master MRP
        // "pdp_index": "perfetti_pdp_new_with_mrp_and_updated_query",//with master MRP
        "ebux_keyword": "perfetti_keyword",
        // "ebux_kw": "perfetti_kw_new",
        // "ebux_kw": "perfetti_kw_median_search_rank",
        "ebux_kw": "perfetti_kw_26jun",

        // "ebux_kw": "perfetti_kw",
        "ebux_review": "perfetti_review",
        // "ebux_pdp_compitition_brand": "perfetti_brands_comp",
        "ebux_pdp_compitition_brand": "perfetti_pdp_comp_map",
        "ebux_kw_compitition_brand": "perfetti_pdp_comp_map",
        "ebux_common_of_keyword_brand_category": "perfetti_brand_category_keyword",
        "ebux_sentiments_analysis": "perfetti_sentiment_analysis",

        "pdp_index": "perfetti_pdp_26jun",//with master MRP
        // "pdp_index": "perfetti_pdp_26jun_test",//with master MRP
        "ebux_common_of_sku_brand_category": "perfetti_brand_category_product",
        // "ebux_common_of_sku_brand_category":"perfetti_brand_category_product_test",

    },
    {
        "client_id": 5, //TCPL MT
        "elastic_type": "aws",
        "ebux_platform": "tata_mt_platform",
        "ebux_new_location": "tata_mt_location",
        "ebux_brands": "tata_mt_brands",
        "ebux_brand_category": "tata_mt_brand_category",
        "ebux_products": "tata_mt_products",
        "pdp_index": "tata_mt_pdp",
        "ebux_keyword": "tata_mt_keyword",
        "ebux_kw": "tata_mt_kw",
        "ebux_review": "tata_mt_review",
        "ebux_pdp_compitition_brand": "tata_mt_brands",
        "ebux_kw_compitition_brand": "tata_mt_brands",
    },
    {
        "client_id": 6, //mondelez
        "elastic_type": "aws",
        "ebux_platform": "mondelez_platform",
        "ebux_new_location": "mondelez_location",
        "ebux_brands": "mondelez_brands",
        "ebux_brand_category": "mondelez_brands_category",
        "ebux_products": "mondelez_products",
        "pdp_index": "mondelez_pdp",
        "ebux_keyword": "mondelez_keyword",
        "ebux_kw": "mondelez_kw",
        "ebux_review": "mondelez_review"
    },
    {
        "client_id": 7, //TCPL OSA
        "elastic_type": "aws",
        "ebux_platform": "tata_6p_osa_platform",
        "ebux_new_location": "tata_6p_osa_location",
        "ebux_brands": "tata_brands_osa_sku",
        "ebux_brand_category": "tata_brand_category_osa",
        "ebux_products": "tata_6p_osa_product",
        // "pdp_index": "tata_6p_osa_pdp_new",
        "pdp_index": "tata_6p_osa_pdp_latest",
        "ebux_keyword": "tata_6p_osa_keyword",
        "ebux_kw": "tata_6p_osa_kw",
        "ebux_review": "tata_6p_osa_review",

    },
    {
        "client_id": 8, //TCPL 6P
        "elastic_type": "aws",
        "ebux_platform": "tata_6p_osa_platform",
        "ebux_new_location": "tata_6p_osa_location",
        "ebux_brands": "tata_brands_6p_old",
        "ebux_brand_category": "tata_brand_category_6p",
        "ebux_products": "tata_6p_osa_product",
        // "pdp_index": "tata_6p_osa_pdp_new",
        "pdp_index": "tata_6p_osa_pdp_latest",
        "ebux_keyword": "tata_6p_osa_keyword",
        "ebux_kw": "tata_6p_osa_kw_new",
        "ebux_review": "tata_6p_osa_review",
        "ebux_sentiments_analysis": "tata_sentiment_analysis",
    },
    {
        "client_id": 15, //TCPL Pricing
        "elastic_type": "aws",
        "ebux_platform": "tata_6p_osa_platform",
        "ebux_new_location": "tata_6p_osa_location",
        "ebux_brands": "tata_brands_6p_old",
        "ebux_brand_category": "tata_brand_category_6p",
        "ebux_products": "tata_6p_osa_product",
        // "pdp_index": "tata_6p_osa_pdp_new",
        "pdp_index": "tata_6p_osa_pdp_latest",
        "ebux_keyword": "tata_6p_osa_keyword",
        "ebux_kw": "tata_6p_osa_kw_new",
        "ebux_review": "tata_6p_osa_review",
        "ebux_sentiments_analysis": "tata_sentiment_analysis",
    }
    ,
    {
        "client_id": 9, //TCPL Data Pipline
        "elastic_type": "aws",
        "ebux_platform": "tata_datapipeline_platform",
        "ebux_new_location": "tata_datapipeline_location",
        "ebux_brands": "tata_datapipeline_brands",
        // "ebux_brands": "tata_datapipeline_brands_temp",
        "ebux_brand_category": "tata_datapipeline_brands_category",

        "ebux_products": "tata_datapipeline_products",
        "pdp_index": "tata_datapipeline_pdp",
        "ebux_keyword": "tata_datapipeline_keyword",
        "ebux_kw": "tata_datapipeline_kw",
        "ebux_review": "tata_datapipeline_review",
        "ebux_pdp_compitition_brand": "tata_datapipeline_brands_comp_map",
        "ebux_kw_compitition_brand": "tata_datapipeline_brands_comp_map",

    },
    ,
    {
        "client_id": 11, //Hell Energy 
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws",
        "ebux_platform": "ebux_hell_platform",
        "ebux_new_location": "ebux_hell_location",
        "ebux_brands": "ebux_hell_brands",
        "ebux_brand_category": "ebux_hell_brands_category",
        "ebux_products": "ebux_hell_sku_platform",
        "pdp_index": "ebux_hell_pdp",
        "ebux_keyword": "ebux_hell_keyword",
        "ebux_kw": "ebux_hell_kw",
        "ebux_review": "ebux_hell_review",
        "ebux_pdp_compitition_brand": "ebux_hell_brands",
        "ebux_kw_compitition_brand": "ebux_hell_brands",
        "ebux_sentiments_analysis": "hell_energy_sentiment_analysis",

        "ebux_brands_dark_store": "hell_brand_category_product",
        "pdp_index_dark_store": "hell_pdp_darkstore",
        "ebux_new_location_dark_store": "hell_darkstore_location",
        "ebux_pdp_darkstore": "hell_pdp_darkstore", //
        "dark_store_location": "hell_darkstore_location",//

    },
    {
        "client_id": 11, //Hell Energy 
        "client_project_es_id": "HellDS2NewServer",
        "elastic_type": "aws_new_es",

        "ebux_platform": "ebux_hell_platform",
        "ebux_review": "ebux_hell_review",

        "ebux_new_location": "hell_location_master",
        "ebux_new_location_dark_store": "hell_location_master",
        "dark_store_location": "hell_location_master",//

        "ebux_kw_location": "ebux_hell_location_kw",

        "ebux_combined_filter_pdp": "hell_pdp_filters",
        "ebux_brands_dark_store": "hell_pdp_filters",

        "pdp_index": "hell_pdp_combined_index",
        "ebux_pdp_darkstore": "hell_pdp_combined_index",
        "pdp_index_dark_store": "hell_pdp_combined_index",


        "ebux_pdp_compitition_brand": "hell_pdp_comp_map",

        "ebux_combined_filter_kw": "hell_kw_filters",

        "ebux_kw": "ebux_hell_kw",

        "ebux_kw_compitition_brand": "hell_pdp_comp_map",
    },

    {
        "client_id": 12, //TCPL 6P darkstore
        "elastic_type": "aws",
        "ebux_platform": "tata_6p_osa_platform",
        "ebux_new_location": "tata_6p_osa_location",
        "ebux_brands": "tata_brands_6p_old",
        "ebux_brand_category": "tata_brand_category_6p",
        "ebux_products": "tata_6p_osa_product",
        // "pdp_index": "tata_6p_osa_pdp_new",
        "pdp_index": "tata_pdp_darkstore",
        "ebux_keyword": "tata_6p_osa_keyword",
        "ebux_kw": "tata_6p_osa_kw_new",
        "ebux_review": "tata_6p_osa_review",
        "dark_store_location": "tata_dark_store_location",

    },

    {
        "client_id": 13, //TCPL OSA darkstore
        "elastic_type": "aws",
        "ebux_platform": "tata_6p_osa_platform",
        "ebux_new_location": "tata_6p_osa_location",
        "ebux_brands": "tata_brands_osa_sku",
        "ebux_brand_category": "tata_brand_category_osa",
        "ebux_products": "tata_6p_osa_product",
        // "pdp_index": "tata_6p_osa_pdp_new",
        "pdp_index": "tata_pdp_darkstore",
        "ebux_keyword": "tata_6p_osa_keyword",
        "ebux_kw": "tata_6p_osa_kw",
        "ebux_review": "tata_6p_osa_review",
        "dark_store_location": "tata_dark_store_location",

    }
    ,
    {
        "client_id": 14, //perfetti Dark Store
        "elastic_type": "aws",
        "ebux_platform": "perfetti_platform",
        "ebux_new_location": "perfetti_location",
        "ebux_brands": "perfetti_brands",
        "ebux_brand_category": "perfetti_brand_category",
        "ebux_products": "perfetti_products",
        "pdp_index": "perfetti_pdp_darkstore",
        // "pdp_index": "perfetti_pdp_darkstore_temp",
        // "pdp_index": "perfetti_pdp_darkstore_new_temp",
        "ebux_keyword": "perfetti_keyword",
        "ebux_kw": "perfetti_kw",
        "ebux_review": "perfetti_review",
        "ebux_pdp_compitition_brand": "perfetti_brands_comp",
        "ebux_kw_compitition_brand": "perfetti_brands_comp",
        "dark_store_location": "perfetti_dark_store_location"
        // "dark_store_location":"perfetti_dark_store_location_temp"
        // "dark_store_location":"perfetti_dark_store_location_new_temp"
    }
    ,
    {
        "client_id": 101, //Latam Brazil
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws_new_es",
        "ebux_platform": "latam_platform_brazil",
        "ebux_new_location": "latam_location",
        "ebux_brands": "latam_brands",
        "ebux_kw_brands": "latam_brands",

        "ebux_combined_filter_pdp": "latam_brazil_filters",
        "ebux_combined_filter_kw": "latam_keyword",

        "ebux_brand_category": "latam_brand_category",
        "ebux_products": "latam_products",
        "pdp_index": "latam_pdp",
        "ebux_keyword": "latam_keyword",
        "ebux_kw": "latam_kw",
        "ebux_pdp_compitition_brand": "latam_pdp_comp_map",
        "ebux_kw_compitition_brand": "latam_pdp_comp_map",
        "ebux_review": "latam_review",

    },
    {
        "client_id": 102, //Latam Mexico
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws_new_es",
        "ebux_platform": "latam_platform_mexico",
        "ebux_new_location": "latam_mexico_location",
        "ebux_brands": "latam_mexico_brands",
        "ebux_kw_brands": "latam_mexico_brands",

        "ebux_combined_filter_pdp": "latam_mexico_filters",
        "ebux_combined_filter_kw": "latam_mexico_keyword",

        "ebux_brand_category": "latam_mexico_brand_category",
        "ebux_products": "latam_mexico_products",
        "pdp_index": "latam_mexico_pdp",
        "ebux_keyword": "latam_mexico_keyword",
        "ebux_kw": "latam_mexico_kw",
        "ebux_pdp_compitition_brand": "latam_mexico_pdp_comp_map",
        "ebux_kw_compitition_brand": "latam_mexico_pdp_comp_map",
        "ebux_review": "latam_mexico_review",

    },
    {
        "client_id": 103, //Reckitt Uk Platform
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws_new_es",
        "ebux_platform": "reckitt_uk_platform",
        "ebux_new_location": "reckitt_uk_location",
        "ebux_brands": "reckitt_uk_brands",
        "ebux_kw_brands": "reckitt_uk_brands",

        "ebux_combined_filter_pdp": "reckitt_uk_filters",
        "ebux_combined_filter_kw": "reckitt_uk_keyword",

        "ebux_brand_category": "reckitt_uk_brand_category",
        "ebux_products": "reckitt_uk_products",
        "pdp_index": "reckitt_uk_pdp",
        "ebux_keyword": "reckitt_uk_keyword",
        "ebux_kw": "reckitt_uk_kw",
        "ebux_review": "reckitt_uk_review",
        "ebux_pdp_compitition_brand": "reckitt_uk_pdp_comp_map",
        "ebux_kw_compitition_brand": "reckitt_uk_pdp_comp_map"

    },
    {
        "client_id": 104,//Livpure
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws_new_es",
        "ebux_new_location": "livpure_location",
        "ebux_new_location_dark_store": "livpure_location",
        "dark_store_location": "livpure_location",
        "ebux_combined_filter_pdp": "livpure_filters",
        "ebux_brands_dark_store": "livpure_filters",
        "pdp_index": "livpure_pdp",
        "pdp_index_dark_store": "livpure_pdp",
        "ebux_pdp_darkstore": "livpure_pdp",
        "ebux_review": "livpure_review",
        "ebux_pdp_compitition_brand": "livpure_pdp_comp_map",

        //  "ebux_platform": "platform_nestle",
        // "ebux_brands": "brands_nestle",
        "ebux_combined_filter_kw": "livpure_keyword",
        // "ebux_kw_brands": "nestle_kw_brands",

        // "ebux_brand_category": "brand_category_nestle",
        // "ebux_products": "products_nestle",
        // "ebux_keyword": "keyword_nestle",
        "ebux_kw": "livpure_kw",
        "ebux_kw_compitition_brand": "livpure_kw_comp_map",
        //  "ebux_sentiments_analysis":"nestle_sentiment_analysis",
    },
    {
        "client_id": 105, //Eveready
        "elastic_type": "aws_new_es",
        "ebux_platform": "ebux_eveready_platform",
        // "ebux_review": "ebux_eveready_review",

        "ebux_new_location": "eveready_location_master",
        "ebux_new_location_dark_store": "eveready_location_master",
        "dark_store_location": "eveready_location_master",//

        "ebux_kw_location": "eveready_location_master_kw",

        // "ebux_combined_filter_pdp": "eveready_pdp_filters",
        "ebux_combined_filter_pdp": "eveready_pdp_filters_new",
        // "ebux_brands_dark_store": "eveready_pdp_filters",
        "ebux_brands_dark_store": "eveready_pdp_filters_new",

        // "pdp_index": "eveready_pdp_combined_index",
        "pdp_index": "eveready_pdp_combined_index_new",
        // "ebux_pdp_darkstore": "eveready_pdp_combined_index",
        // "pdp_index_dark_store": "eveready_pdp_combined_index",
        "ebux_pdp_darkstore": "eveready_pdp_combined_index_new",
        "pdp_index_dark_store": "eveready_pdp_combined_index_new",


        "ebux_pdp_compitition_brand": "eveready_pdp_comp_mapping",

        "ebux_combined_filter_kw": "eveready_kw_filters",

        "ebux_kw": "eveready_kw",
        "ebux_pdp_compitition_combined_filter": "eveready_pdp_filters_comp"

        // "ebux_kw_compitition_brand": "eveready_pdp_comp_map",
    },
    {
        "client_id": 106,//Canon
        "elastic_type": "aws_new_es",
        "ebux_new_location": "canon_location_filter",
        // "ebux_new_location_dark_store":"livpure_location",
        // "dark_store_location":"livpure_location",

        "ebux_combined_filter_pdp": "canon_pdp_filters",
        // "ebux_brands_dark_store": "livpure_filters",
        "pdp_index": "ebux_canon_pdp",
        // "pdp_index_dark_store": "livpure_pdp",
        // "ebux_pdp_darkstore":"livpure_pdp",
        "ebux_review": "ebux_canon_review",
        "ebux_pdp_compitition_brand": "canon_pdp_comp_map",

        "ebux_platform": "ebux_canon_platform",
        "ebux_combined_filter_kw": "canon_kw_filters",

        "ebux_kw": "ebux_canon_kw",
        "ebux_kw_compitition_brand": "canon_kw_comp_map",
        //  "ebux_sentiments_analysis":"",
    },
    // { // index deleted on 11-may-2026 1:07 PM in (AGL+HDL) 1Commerce group
    //     "client_id": 2,
    //     "client_project_es_id": "nestle-daily-data-with-out-nd-osa", //nestle
    //     // "elastic_type": "aws_open_searh",
    //     "elastic_type": "aws_new_es",
    //     // "ebux_new_location": "nestle_location_master",//curently useing in production
    //     "ebux_new_location": "nestle_location_master_qa",//for qa and uat testing
    //     // "ebux_combined_filter_pdp": "nestle_combined_filter",//curently useing in production
    //     "ebux_combined_filter_pdp": "nestle_combined_filter_qa",//for qa and uat testing
    //     // "ebux_brands_dark_store": "nestle_brand_category_product",//curently useing in production
    //     "ebux_brands_dark_store": "nestle_brand_category_product_qa",//for qa and uat testing
    //     // "pdp_index": "nestle_pdp_combined_60_days",//curently useing in production
    //     "pdp_index": "nestle_pdp_combined_60_days_new",//for qa and uat testing
    //     // "pdp_index_dark_store": "nestle_pdp_combined_60_days",//curently useing in production
    //     "pdp_index_dark_store": "nestle_pdp_combined_60_days_new",//for qa and uat testing
    //     // "ebux_new_location_dark_store": "nestle_location_master",//curently useing in production
    //     "ebux_new_location_dark_store": "nestle_location_master_qa",//for qa and uat testing
    //     "ebux_review": "review_nestle",
    //     "ebux_pdp_compitition_brand": "pdp_competition_mapping_nestle",
    //     // "ebux_pdp_darkstore": "nestle_pdp_combined_60_days",//curently useing in production
    //     "ebux_pdp_darkstore": "nestle_pdp_combined_60_days_new",//for qa and uat testing
    //     // "dark_store_location": "nestle_location_master",//curently useing in production
    //     "dark_store_location": "nestle_location_master_qa",//for qa and uat testing
    //     "ebux_platform": "platform_nestle",
    //     "ebux_brands": "brands_nestle",
    //     "ebux_combined_filter_kw": "nestle_kw_filter",
    //     "ebux_combined_filter_som": "nestle_som_filter",
    //     "ebux_kw_brands": "nestle_kw_brands",

    //     "ebux_brand_category": "brand_category_nestle",
    //     "ebux_products": "products_nestle",
    //     "ebux_keyword": "keyword_nestle",
    //     "ebux_kw": "kw_nestle",
    //     "ebux_kw_compitition_brand": "kw_competition_mapping_nestle",
    //     "ebux_sentiments_analysis": "nestle_sentiment_analysis",
    //     "ebux_som_nestle": "keyword_som_nestle",
    //     "ebux_som_kw": "som_nestle"
    // },
    {
        "client_id": 2,
        "client_project_es_id": "nestle-daily_date_wise_filter", //nestle
        "elastic_type": "aws_new_es",
        "ebux_new_location": "nestle_location_filter_daily",//for qa and uat testing
        "ebux_new_location_dark_store": "nestle_location_filter_daily",//for qa and uat testing
        "dark_store_location": "nestle_location_filter_daily",//for qa and uat testing
        "ebux_combined_filter_pdp": "nestle_combined_filter_data_daily",//for qa and uat testing
        "ebux_brands_dark_store": "nestle_darkstore_filter_data_daily",//for qa and uat testing
        "pdp_index": "nestle_pdp_combined_60_days_historic",//for qa and uat testing
        "pdp_index_dark_store": "nestle_pdp_combined_60_days_historic",//for qa and uat testing
        "ebux_pdp_darkstore": "nestle_pdp_combined_60_days_historic",//for qa and uat testing
        "ebux_review": "review_nestle",
        "ebux_pdp_compitition_brand": "pdp_competition_mapping_nestle",
        "ebux_platform": "platform_nestle",
        "ebux_brands": "brands_nestle",
        // "ebux_combined_filter_kw": "nestle_kw_historic_filter", // nestle_kw_filter
        "ebux_combined_filter_kw": "nestle_kw_historic_filter_new",
        "ebux_combined_filter_som": "nestle_som_historic_filter", // nestle_som_filter
        "ebux_kw_brands": "nestle_kw_brands",

        "ebux_brand_category": "brand_category_nestle",
        "ebux_products": "products_nestle",
        "ebux_keyword": "keyword_nestle",
        "ebux_kw": "kw_nestle",
        "ebux_kw_compitition_brand": "kw_competition_mapping_nestle",
        "ebux_sentiments_analysis": "nestle_sentiment_analysis",
        "ebux_som_nestle": "keyword_som_nestle",
        "ebux_som_kw": "som_nestle",
        "ebux_kw_location": "nestle_location_kw_historic", // nestle_location_master_kw
        "ebux_som_location": "nestle_location_som_historic", // new add on
        "ebux_pdp_compitition_combined_filter": "nestle_combined_filter_comp_daily"
    },
    {
        "client_id": 1, //colpal
        "client_project_es_id": "colpal-data-with-new-es-server",
        "elastic_type": "aws_new_es",

        "ebux_platform": "colpal_platform_darkstore",

        "ebux_new_location": "colpal_location_master",
        "ebux_new_location_dark_store": "colpal_location_master",
        "dark_store_location": "colpal_location_master",

        // "ebux_kw_location": "",

        "ebux_combined_filter_pdp": "colpal_pdp_filter",
        "ebux_brands_dark_store": "colpal_pdp_filter_darkstore",

        "pdp_index": "colpal_pdp_combined_index",
        "ebux_pdp_darkstore": "colpal_pdp_combined_index",
        "pdp_index_dark_store": "colpal_pdp_combined_index",


        "ebux_pdp_compitition_brand": "colpal_pdp_comp_map",

        "ebux_combined_filter_kw": "colpal_kw_filters_prod",

        "ebux_kw": "colpal_kw_prod",

        "ebux_kw_compitition_brand": "colpal_pdp_comp_map",

        "ebux_review": "colpal_review_prod",

        // "banners_crawl":"colpal_banners_crawl_prod",
        // "ebux_sentiments_analysis": "sentiment_analysis",

    },
    {
        "client_id": 1, //colpal
        "client_project_es_id": "colpal-data-with-new-es-server-ds3",
        "elastic_type": "aws_new_es",

        "ebux_platform": "colpal_platform_darkstore",

        "ebux_new_location": "colpal_location_master",
        "ebux_new_location_dark_store": "colpal_location_master",
        "dark_store_location": "colpal_location_master",

        // "ebux_kw_location": "",

        "ebux_combined_filter_pdp": "colpal_pdp_filter",
        "ebux_brands_dark_store": "colpal_pdp_filter_darkstore",

        "pdp_index": "colpal_pdp_combined_sales",
        "ebux_pdp_darkstore": "colpal_pdp_combined_sales",
        "pdp_index_dark_store": "colpal_pdp_combined_sales",


        "ebux_pdp_compitition_brand": "colpal_pdp_comp_map",

        "ebux_combined_filter_kw": "colpal_kw_filters_prod",

        "ebux_kw": "colpal_kw_prod",

        "ebux_kw_compitition_brand": "colpal_pdp_comp_map",

        "ebux_review": "colpal_review_prod",

        // "banners_crawl":"colpal_banners_crawl_prod",
        // "ebux_sentiments_analysis": "sentiment_analysis",

    },
    {
        "client_id": 107, //SleepyCat
        "elastic_type": "aws_new_es",

        "ebux_platform": "sleepycat_platform_prod",

        "ebux_new_location": "sleepycat_location_filter",
        // "ebux_new_location_dark_store":"",
        // "dark_store_location":"",

        // "ebux_kw_location": "",

        "ebux_combined_filter_pdp": "sleepycat_pdp_filters",
        // "ebux_brands_dark_store": "",

        "pdp_index": "ebux_sleepycat_pdp",
        // "ebux_pdp_darkstore":"",
        // "pdp_index_dark_store": "",


        "ebux_pdp_compitition_brand": "sleepycat_pdp_comp_map",

        "ebux_combined_filter_kw": "sleepycat_kw_filters",

        "ebux_kw": "ebux_sleepycat_kw",

        "ebux_kw_compitition_brand": "sleepycat_pdp_comp_map",

        "ebux_review": "ebux_sleepycat_review",

        // "banners_crawl":"",
        // "ebux_sentiments_analysis": "",

    },
    {
        "client_id": 108, //Abbott
        "elastic_type": "aws_new_es",

        "ebux_platform": "abbott_platform",

        "ebux_new_location": "abbott_location_master",
        "ebux_new_location_dark_store": "abbott_location_master",
        "dark_store_location": "abbott_location_master",

        // "ebux_kw_location": "",

        "ebux_combined_filter_pdp": "abbott_pdp_filter",
        "ebux_brands_dark_store": "abbott_darkstore_filter",

        "pdp_index": "abbott_pdp_combined_index",
        "ebux_pdp_darkstore": "abbott_pdp_combined_index",
        "pdp_index_dark_store": "abbott_pdp_combined_index",


        // "ebux_pdp_compitition_brand": "",

        "ebux_combined_filter_kw": "abbott_kw_filter",

        "ebux_kw": "abbott_kw",

        // "ebux_kw_compitition_brand": "",

        // "ebux_review": "",

        // "banners_crawl":"",
        // "ebux_sentiments_analysis": "",

    },
    {
        "client_id": 109, //Perfetti DS2.0
        "elastic_type": "aws",

        "ebux_platform": "perfetti_platform_new",

        "ebux_new_location": "perfetti_location_ds2",
        "ebux_new_location_dark_store": "perfetti_location_ds2",
        "dark_store_location": "perfetti_location_ds2",

        // "ebux_kw_location": "",

        "ebux_combined_filter_pdp": "perfetti_brand_category_product_ds2",
        // "ebux_brands_dark_store": "",

        "pdp_index": "perfetti_pdp_ds2",
        // "ebux_pdp_darkstore": "",
        // "pdp_index_dark_store": "",


        "ebux_pdp_compitition_brand": "perfetti_pdp_comp_map",

        "ebux_combined_filter_kw": "perfetti_kw_filter",

        "ebux_kw": "perfetti_kw",

        "ebux_kw_compitition_brand": "perfetti_pdp_comp_map",

        "ebux_review": "review_perfetti",

        // "banners_crawl":"",
        // "ebux_sentiments_analysis": "",

    },
    {
        "client_id": 109, //Perfetti DS2.0 Historical
        "client_project_es_id": "perfetti_date_wise_filter",
        "elastic_type": "aws",

        "ebux_platform": "perfetti_platform_new",

        "ebux_new_location": "perfetti_location_historic",
        "ebux_new_location_dark_store": "perfetti_location_historic",
        "dark_store_location": "perfetti_location_historic",

        // "ebux_kw_location": "",

        "ebux_combined_filter_pdp": "perfetti_brand_category_product_historic",
        // "ebux_brands_dark_store": "",

        "pdp_index": "perfetti_pdp_historic",
        // "ebux_pdp_darkstore": "",
        // "pdp_index_dark_store": "",


        "ebux_pdp_compitition_brand": "perfetti_pdp_comp_map",

        "ebux_combined_filter_kw": "perfetti_kw_filter_historic",

        "ebux_kw": "perfetti_kw_historic",

        "ebux_kw_compitition_brand": "perfetti_pdp_comp_map",

        "ebux_review": "review_perfetti",

        // "banners_crawl":"",
        // "ebux_sentiments_analysis": "",

    },
    {
        "client_id": 109, //Perfetti DS2.0 Historical With Darkstore
        "client_project_es_id": "perfetti_date_wise_filter_with_darkstore",
        "elastic_type": "aws",

        "ebux_platform": "perfetti_platform_new",

        "ebux_new_location": "perfetti_location_historic_combined",
        "ebux_new_location_dark_store": "perfetti_location_historic_combined",
        "dark_store_location": "perfetti_location_historic_combined",

        // "ebux_kw_location": "",

        "ebux_combined_filter_pdp": "perfetti_pdp_filter_historic",
        "ebux_brands_dark_store": "perfetti_darkstore_filter_historic",

        "pdp_index": "perfetti_pdp_combined_historic",
        "ebux_pdp_darkstore": "perfetti_pdp_combined_historic",
        "pdp_index_dark_store": "perfetti_pdp_combined_historic",


        "ebux_pdp_compitition_brand": "perfetti_pdp_comp_map",

        "ebux_combined_filter_kw": "perfetti_kw_filter_historic",

        "ebux_kw": "perfetti_kw_historic",

        "ebux_kw_compitition_brand": "perfetti_pdp_comp_map",

        "ebux_review": "review_perfetti",

        // "banners_crawl":"",
        // "ebux_sentiments_analysis": "",

    },
    {
        "client_id": 110, //Kao
        "elastic_type": "aws_new_es",

        "ebux_platform": "platform_kao",

        "ebux_new_location": "kao_location_filter_historic",//"kao_location_master",
        "ebux_new_location_dark_store": "kao_location_filter_historic",//"kao_location_master",
        "dark_store_location": "kao_location_filter_historic",//"kao_location_master",

        "ebux_kw_location": "kao_location_historic_kw",//"kao_location_master_kw",

        "ebux_combined_filter_pdp": "kao_pdp_filters_historic",//"kao_pdp_filters",
        "ebux_brands_dark_store": "kao_darkstore_filters_historic",//"kao_darkstore_filters",

        "pdp_index": "kao_pdp_combined_index",//"kao_pdp_combined_index",
        "ebux_pdp_darkstore": "kao_pdp_combined_index",//"kao_pdp_combined_index",
        "pdp_index_dark_store": "kao_pdp_combined_index",//"kao_pdp_combined_index",


        "ebux_pdp_compitition_brand": "kao_pdp_comp_map_historic",//"kao_pdp_comp_map",

        "ebux_combined_filter_kw": "kao_kw_filters_historic",//"kao_kw_filters",

        "ebux_kw": "kao_kw_historic",//"kao_kw",

        "ebux_kw_compitition_brand": "kao_pdp_comp_map_historic",//"kao_pdp_comp_map",

        "ebux_review": "kao_review_historic",//"kao_review",

        "ebux_pdp_compitition_combined_filter": "kao_pdp_comp_filters_historic",
        "ebux_kw_compitition_combined_filter": "kao_kw_comp_filters_historic"


        // "banners_crawl":"colpal_banners_crawl_prod",
        // "ebux_sentiments_analysis": "sentiment_analysis",

    },
    {
        "client_id": 114, //Kao philippines
        "elastic_type": "aws_new_es",
        "ebux_platform": "platform_kao_philippines",
        "ebux_review": "kao_philippines_review",

        "ebux_new_location": "kao_philippines_location_historic",
        "ebux_new_location_dark_store": "kao_philippines_location_historic",
        "dark_store_location": "kao_philippines_location_historic",//

        "ebux_kw_location": "kao_philippines_location_kw",

        "ebux_combined_filter_pdp": "kao_philippines_pdp_filters",
        // "ebux_brands_dark_store": "vip_darkstore_filter",

        "pdp_index": "kao_philippines_pdp_prod",
        "ebux_pdp_darkstore": "kao_philippines_pdp_prod",
        "pdp_index_dark_store": "kao_philippines_pdp_prod",


        "ebux_pdp_compitition_brand": "kao_philippines_pdp_comp_mapping",

        "ebux_combined_filter_kw": "kao_philippines_kw_filters",

        "ebux_kw": "kao_philippines_kw",

        "ebux_kw_compitition_brand": "kao_philippines_pdp_comp_mapping",
        "ebux_pdp_compitition_combined_filter": "kao_philippines_pdp_filters_comp",
        "ebux_kw_compitition_combined_filter": "kao_philippines_kw_comp_filters"

    },
    {
        "client_id": 2,
        "client_project_es_id": "7dayoos_date_wise_filter_with_weighted_sos", //nestle
        // "elastic_type": "aws_open_searh",
        "elastic_type": "aws_new_es",
        "ebux_new_location": "nestle_location_filter_data",//for qa and uat testing
        "ebux_new_location_dark_store": "nestle_location_filter_data",//for qa and uat testing
        "dark_store_location": "nestle_location_filter_data",//for qa and uat testing
        "ebux_combined_filter_pdp": "nestle_combined_filter_data",//for qa and uat testing
        "ebux_brands_dark_store": "nestle_darkstore_filter_data",//for qa and uat testing
        "pdp_index": "nestle_pdp_combined_7_days_historic",//for qa and uat testing
        "pdp_index_dark_store": "nestle_pdp_combined_7_days_historic",//for qa and uat testing
        "ebux_pdp_darkstore": "nestle_pdp_combined_7_days_historic",//for qa and uat testing
        "ebux_review": "review_nestle",
        "ebux_pdp_compitition_brand": "pdp_competition_mapping_nestle",
        "ebux_platform": "platform_nestle",
        "ebux_brands": "brands_nestle",
        "ebux_combined_filter_kw": "nestle_kw_historic_filter", //nestle_kw_filter
        "ebux_combined_filter_kw": "nestle_kw_historic_filter_new",
        "ebux_combined_filter_som": "nestle_som_historic_filter", //nestle_som_filter
        "ebux_kw_brands": "nestle_kw_brands",

        "ebux_brand_category": "brand_category_nestle",
        "ebux_products": "products_nestle",
        "ebux_keyword": "keyword_nestle",
        "ebux_kw": "kw_nestle",
        "ebux_kw_compitition_brand": "kw_competition_mapping_nestle",
        "ebux_sentiments_analysis": "nestle_sentiment_analysis",
        "ebux_som_nestle": "keyword_som_nestle",
        "ebux_som_kw": "som_nestle",
        "ebux_kw_location": "nestle_location_kw_historic", // nestle_location_master_kw
        "ebux_som_location": "nestle_location_som_historic", // new add on
        "ebux_pdp_compitition_combined_filter": "nestle_combined_filter_7days"
    },
    {
        "client_id": 2,
        "client_project_es_id": "nestle-daily_date_wise_filter_with_weighted_sos", //nestle
        "elastic_type": "aws_new_es",
        "ebux_new_location": "nestle_location_filter_daily",//for qa and uat testing
        "ebux_new_location_dark_store": "nestle_location_filter_daily",//for qa and uat testing
        "dark_store_location": "nestle_location_filter_daily",//for qa and uat testing
        "ebux_combined_filter_pdp": "nestle_combined_filter_data_daily",//for qa and uat testing
        "ebux_brands_dark_store": "nestle_darkstore_filter_data_daily",//for qa and uat testing
        "pdp_index": "nestle_pdp_combined_60_days_historic",//for qa and uat testing
        "pdp_index_dark_store": "nestle_pdp_combined_60_days_historic",//for qa and uat testing
        "ebux_pdp_darkstore": "nestle_pdp_combined_60_days_historic",//for qa and uat testing
        "ebux_review": "review_nestle",
        "ebux_pdp_compitition_brand": "pdp_competition_mapping_nestle",
        "ebux_platform": "platform_nestle",
        "ebux_brands": "brands_nestle",
        // "ebux_combined_filter_kw": "nestle_kw_historic_filter", // elastic change filter
        "ebux_combined_filter_kw": "nestle_kw_historic_filter_new",
        "ebux_combined_filter_som": "nestle_som_historic_filter",  // elastic change filter
        "ebux_kw_brands": "nestle_kw_brands",

        "ebux_brand_category": "brand_category_nestle",
        "ebux_products": "products_nestle",
        "ebux_keyword": "keyword_nestle",
        "ebux_kw": "kw_nestle",  // elastic change. (no-change)
        "ebux_kw_compitition_brand": "kw_competition_mapping_nestle",
        "ebux_sentiments_analysis": "nestle_sentiment_analysis",
        "ebux_som_nestle": "keyword_som_nestle",
        "ebux_som_kw": "som_nestle", // elastic change. (no-change)
        "ebux_kw_location": "nestle_location_kw_historic", // elastic change
        "ebux_som_location": "nestle_location_som_historic", // new add on
        "ebux_pdp_compitition_combined_filter": "nestle_combined_filter_comp_daily"
    },
    {
        "client_id": 111, //VIP Bags
        "elastic_type": "aws_new_es",
        "ebux_platform": "platform_vip",
        "ebux_review": "vip_review",

        "ebux_new_location": "vip_location_historic",
        "ebux_new_location_dark_store": "vip_location_historic",
        "dark_store_location": "vip_location_historic",//

        "ebux_kw_location": "vip_location_historic_kw",

        "ebux_combined_filter_pdp": "vip_pdp_filters",
        "ebux_brands_dark_store": "vip_darkstore_filter",

        "pdp_index": "vip_pdp_combined_index_new",
        "ebux_pdp_darkstore": "vip_pdp_combined_index_new",
        "pdp_index_dark_store": "vip_pdp_combined_index_new",


        "ebux_pdp_compitition_brand": "vip_pdp_comp_mapping",

        "ebux_combined_filter_kw": "vip_kw_filters",

        "ebux_kw": "vip_kw",

        "ebux_kw_compitition_brand": "vip_pdp_comp_mapping",
        "ebux_pdp_compitition_combined_filter": "vip_pdp_filters_comp",
        "ebux_kw_compitition_combined_filter": "vip_kw_filters_comp"
    },
    {
        "client_id": 111, //VIP Bags

        "elastic_type": "aws_new_es",
        "client_project_es_id": "vip_bags_with_wt_sos",

        "ebux_platform": "platform_vip",
        "ebux_review": "vip_review",

        "ebux_new_location": "vip_location_historic",
        "ebux_new_location_dark_store": "vip_location_historic",
        "dark_store_location": "vip_location_historic",//

        "ebux_kw_location": "vip_location_historic_kw",

        "ebux_combined_filter_pdp": "vip_pdp_filters",
        "ebux_brands_dark_store": "vip_darkstore_filter",

        // "pdp_index": "vip_pdp_combined_index_new",
        "pdp_index": "vip_pdp_combined_index_seller",//update seller wise
        // "ebux_pdp_darkstore": "vip_pdp_combined_index_new",
        "ebux_pdp_darkstore": "vip_pdp_combined_index_seller",//update seller wise
        // "pdp_index_dark_store": "vip_pdp_combined_index_new",
        "pdp_index_dark_store": "vip_pdp_combined_index_seller",//update seller wise


        "ebux_pdp_compitition_brand": "vip_pdp_comp_mapping",

        "ebux_combined_filter_kw": "vip_kw_filters",

        "ebux_kw": "vip_kw",

        "ebux_kw_compitition_brand": "vip_pdp_comp_mapping",
        "ebux_pdp_compitition_combined_filter": "vip_pdp_filters_comp"
    },
    {
        "client_id": 105, //Eveready DS2.0 Historical
        "client_project_es_id": "eveready_date_wise_filter",
        "elastic_type": "aws_new_es",

        "ebux_platform": "ebux_eveready_platform",
        // "ebux_review": "ebux_eveready_review",

        "ebux_new_location": "eveready_location_master_historic", // eveready_location_master
        "ebux_new_location_dark_store": "eveready_location_master_historic", // eveready_location_master
        "dark_store_location": "eveready_location_master_historic",  // eveready_location_master

        "ebux_kw_location": "eveready_location_master_kw_historic",  // eveready_location_master_kw

        // "ebux_combined_filter_pdp": "eveready_pdp_filters",
        "ebux_combined_filter_pdp": "eveready_pdp_filter_historic", // eveready_pdp_filters_new
        // "ebux_brands_dark_store": "eveready_pdp_filters",
        "ebux_brands_dark_store": "eveready_darkstore_filter_historic",  // eveready_pdp_filters_new

        // "pdp_index": "eveready_pdp_combined_index",
        "pdp_index": "eveready_pdp_combined_index_historic", // eveready_pdp_combined_index_new
        // "ebux_pdp_darkstore": "eveready_pdp_combined_index",
        // "pdp_index_dark_store": "eveready_pdp_combined_index",
        "ebux_pdp_darkstore": "eveready_pdp_combined_index_historic", // eveready_pdp_combined_index_new
        "pdp_index_dark_store": "eveready_pdp_combined_index_historic", // eveready_pdp_combined_index_new


        "ebux_pdp_compitition_brand": "eveready_pdp_comp_mapping",  // 

        "ebux_combined_filter_kw": "eveready_kw_filters_historic_new",  // eveready_kw_filters

        "ebux_kw": "eveready_kw_historic_new_logic",  // eveready_kw

        "ebux_kw_compitition_brand": "eveready_pdp_comp_mapping",  // 
        "ebux_pdp_compitition_combined_filter": "eveready_pdp_comp_filter_historic", // eveready_combined_filter_7days
        "ebux_kw_compitition_combined_filter": "eveready_pdp_comp_filter_historic"
    },
    {
        "client_id": 112, //Kao Corporation - Brazil
        "elastic_type": "aws_new_es",
        "ebux_platform": "platform_kao_brazil",
        "ebux_review": "kao_brazil_review",

        "ebux_new_location": "kao_brazil_location_historic",
        "ebux_new_location_dark_store": "kao_brazil_location_historic",
        "dark_store_location": "kao_brazil_location_historic",

        "ebux_kw_location": "kao_brazil_location_kw",

        "ebux_combined_filter_pdp": "kao_brazil_pdp_filters",
        // "ebux_brands_dark_store": "",

        "pdp_index": "kao_brazil_pdp",
        // "ebux_pdp_darkstore": "",
        // "pdp_index_dark_store": "",


        "ebux_pdp_compitition_brand": "kao_brazil_pdp_comp_mapping",

        "ebux_combined_filter_kw": "kao_brazil_kw_filters",

        "ebux_kw": "kao_brazil_kw",

        "ebux_kw_compitition_brand": "kao_brazil_pdp_comp_mapping",
        "ebux_pdp_compitition_combined_filter": "kao_brazil_pdp_filters_comp",
        "ebux_kw_compitition_combined_filter": "kao_brazil_kw_comp_filters_prod"
    },
    {
        "client_id": 112, //Kao Corporation - Brazil
        "client_project_es_id": "kao_brazil_pdp_filters_msl", //nestle
        "elastic_type": "aws_new_es",
        "ebux_platform": "platform_kao_brazil",
        "ebux_review": "kao_brazil_review",

        "ebux_new_location": "kao_brazil_location_historic",
        "ebux_new_location_dark_store": "kao_brazil_location_historic",
        "dark_store_location": "kao_brazil_location_historic",

        "ebux_kw_location": "kao_brazil_location_kw",

        "ebux_combined_filter_pdp": "kao_brazil_pdp_filters_msl",
        // "ebux_brands_dark_store": "",

        "pdp_index": "kao_brazil_pdp_msl",
        // "ebux_pdp_darkstore": "",
        // "pdp_index_dark_store": "",


        "ebux_pdp_compitition_brand": "kao_brazil_pdp_comp_mapping",

        "ebux_combined_filter_kw": "kao_brazil_kw_filters",

        "ebux_kw": "kao_brazil_kw",

        "ebux_kw_compitition_brand": "kao_brazil_pdp_comp_mapping",
        "ebux_pdp_compitition_combined_filter": "kao_brazil_pdp_filters_comp",
        "ebux_kw_compitition_combined_filter": "kao_brazil_kw_comp_filters_prod"
    },
    {
        "client_id": 113, //Kao Corporation - USA
        "elastic_type": "aws_new_es",
        "ebux_platform": "platform_kao_usa",
        "ebux_review": "kao_usa_review",

        "ebux_new_location": "kao_usa_location_historic",
        "ebux_new_location_dark_store": "kao_usa_location_historic",
        "dark_store_location": "kao_usa_location_historic",

        "ebux_kw_location": "kao_usa_location_kw",

        "ebux_combined_filter_pdp": "kao_usa_pdp_filters",
        // "ebux_brands_dark_store": "",

        "pdp_index": "kao_usa_pdp",
        // "ebux_pdp_darkstore": "",
        // "pdp_index_dark_store": "",


        "ebux_pdp_compitition_brand": "kao_usa_pdp_comp_mapping",

        "ebux_combined_filter_kw": "kao_usa_kw_filters",

        "ebux_kw": "kao_usa_kw",

        "ebux_kw_compitition_brand": "kao_usa_pdp_comp_mapping",
        "ebux_pdp_compitition_combined_filter": "kao_usa_pdp_filters_comp"
    },
    {
        "client_id": 112, //Kao Corp - Brazil new
        "client_project_es_id": "kao_brazil_new",
        "elastic_type": "aws_new_es",
        "ebux_platform": "platform_kao_brazil_prod",
        "ebux_review": "kao_brazil_review_prod",

        "ebux_new_location": "kao_brazil_location_historic_prod",
        "ebux_new_location_dark_store": "kao_brazil_location_historic_prod",
        "dark_store_location": "kao_brazil_location_historic_prod",

        "ebux_kw_location": "kao_brazil_location_kw_prod",

        "ebux_combined_filter_pdp": "kao_brazil_pdp_filters_prod",
        // "ebux_brands_dark_store": "",

        "pdp_index": "kao_brazil_pdp_prod",
        // "ebux_pdp_darkstore": "",
        // "pdp_index_dark_store": "",


        "ebux_pdp_compitition_brand": "kao_brazil_pdp_comp_mapping_prod",

        "ebux_combined_filter_kw": "kao_brazil_kw_filters_prod",

        "ebux_kw": "kao_brazil_kw_prod",

        "ebux_kw_compitition_brand": "kao_brazil_pdp_comp_mapping_prod",
        "ebux_pdp_compitition_combined_filter": "kao_brazil_pdp_filters_comp_prod",
        "ebux_kw_compitition_combined_filter": "kao_brazil_kw_comp_filters_prod"
    }


]

const DEV_CLIENT_INDEX = [
    {
        "client_id": 1,
        "elastic_type": "aws",
        "ebux_platform": "colpal_platform_dev",
        "ebux_new_location": "colpal_new_location_dev",
        "ebux_brands": "colpal_brands_dev",
        "ebux_brand_category": "colpal_brand_category_dev",
        "ebux_products": "colpal_products_dev",
        "ebux_keyword": "colpal_keyword_dev",
        "ebux_kw": "colpal_kw_dev",
        "ebux_review": "colpal_review_dev",
        "pdp_index": "pdp_index"
    },
    {
        "client_id": 2,
        "elastic_type": "aws",
        "ebux_platform": "platform_nestle",
        "ebux_new_location": "new_location_nestle",
        "ebux_brands": "brands_nestle",
        "ebux_brand_category": "brand_category_nestle",
        "ebux_products": "sku_platform_nestle",
        "pdp_index": "pdp_nestle_new",
        "ebux_keyword": "keyword_nestle",
        "ebux_kw": "kw_nestle",
        "ebux_review": "review_nestle"
    }
]

module.exports = {
    DEV_CLIENT_INDEX,
    PROD_CLIENT_INDEX
};