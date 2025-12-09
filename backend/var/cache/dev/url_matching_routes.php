<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/api/customers' => [
            [['_route' => 'api_customers_index', '_controller' => 'App\\Controller\\Api\\CustomerController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_customers_create', '_controller' => 'App\\Controller\\Api\\CustomerController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/invoices' => [
            [['_route' => 'api_invoices_index', '_controller' => 'App\\Controller\\Api\\InvoiceController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_invoices_create', '_controller' => 'App\\Controller\\Api\\InvoiceController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/lookups' => [[['_route' => 'api_lookups', '_controller' => 'App\\Controller\\Api\\LookupController'], null, ['GET' => 0], null, false, false, null]],
        '/api/products' => [
            [['_route' => 'api_products_index', '_controller' => 'App\\Controller\\Api\\ProductController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_products_create', '_controller' => 'App\\Controller\\Api\\ProductController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/quotations' => [
            [['_route' => 'api_quotations_index', '_controller' => 'App\\Controller\\Api\\QuotationController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_quotations_create', '_controller' => 'App\\Controller\\Api\\QuotationController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/services' => [
            [['_route' => 'api_services_index', '_controller' => 'App\\Controller\\Api\\ServiceController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_services_create', '_controller' => 'App\\Controller\\Api\\ServiceController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/login' => [[['_route' => 'api_login'], null, ['POST' => 0], null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/_error/(\\d+)(?:\\.([^/]++))?(*:35)'
                .'|/api/(?'
                    .'|customers/([^/]++)(?'
                        .'|(*:71)'
                        .'|/vehicles(?'
                            .'|(*:90)'
                            .'|/([^/]++)(?'
                                .'|(*:109)'
                            .')'
                        .')'
                    .')'
                    .'|invoices/([^/]++)(?'
                        .'|(*:140)'
                    .')'
                    .'|products/([^/]++)(?'
                        .'|(*:169)'
                    .')'
                    .'|quotations/([^/]++)(?'
                        .'|(*:200)'
                    .')'
                    .'|services/([^/]++)(?'
                        .'|(*:229)'
                    .')'
                .')'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        35 => [[['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null]],
        71 => [
            [['_route' => 'api_customers_show', '_controller' => 'App\\Controller\\Api\\CustomerController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_customers_update', '_controller' => 'App\\Controller\\Api\\CustomerController::update'], ['id'], ['PATCH' => 0], null, false, true, null],
            [['_route' => 'api_customers_delete', '_controller' => 'App\\Controller\\Api\\CustomerController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        90 => [[['_route' => 'api_customers_add_vehicle', '_controller' => 'App\\Controller\\Api\\CustomerController::addVehicle'], ['id'], ['POST' => 0], null, false, false, null]],
        109 => [
            [['_route' => 'api_customers_update_vehicle', '_controller' => 'App\\Controller\\Api\\CustomerController::updateVehicle'], ['customerId', 'vehicleId'], ['PATCH' => 0], null, false, true, null],
            [['_route' => 'api_customers_delete_vehicle', '_controller' => 'App\\Controller\\Api\\CustomerController::deleteVehicle'], ['customerId', 'vehicleId'], ['DELETE' => 0], null, false, true, null],
        ],
        140 => [
            [['_route' => 'api_invoices_show', '_controller' => 'App\\Controller\\Api\\InvoiceController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_invoices_update', '_controller' => 'App\\Controller\\Api\\InvoiceController::update'], ['id'], ['PUT' => 0], null, false, true, null],
        ],
        169 => [
            [['_route' => 'api_products_update', '_controller' => 'App\\Controller\\Api\\ProductController::update'], ['id'], ['PATCH' => 0], null, false, true, null],
            [['_route' => 'api_products_delete', '_controller' => 'App\\Controller\\Api\\ProductController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        200 => [
            [['_route' => 'api_quotations_show', '_controller' => 'App\\Controller\\Api\\QuotationController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_quotations_update', '_controller' => 'App\\Controller\\Api\\QuotationController::update'], ['id'], ['PUT' => 0], null, false, true, null],
        ],
        229 => [
            [['_route' => 'api_services_update', '_controller' => 'App\\Controller\\Api\\ServiceController::update'], ['id'], ['PATCH' => 0], null, false, true, null],
            [['_route' => 'api_services_delete', '_controller' => 'App\\Controller\\Api\\ServiceController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
