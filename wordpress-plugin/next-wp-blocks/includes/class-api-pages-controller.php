<?php
/**
 * Pages API Controller
 */

namespace NextWP\API;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Pages Controller class
 */
class PagesController extends \WP_REST_Controller {
    
    /**
     * Namespace
     */
    protected $namespace = 'next-wp/v1';
    
    /**
     * Rest base
     */
    protected $rest_base = 'pages';
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->register_routes();
    }
    
    /**
     * Register REST routes
     */
    public function register_routes() {
        // Get all pages
        register_rest_route($this->namespace, '/' . $this->rest_base, array(
            array(
                'methods' => \WP_REST_Server::READABLE,
                'callback' => array($this, 'get_pages'),
                'permission_callback' => array($this, 'get_pages_permissions_check'),
                'args' => $this->get_collection_params(),
            ),
            array(
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_page'),
                'permission_callback' => array($this, 'create_page_permissions_check'),
                'args' => $this->get_endpoint_args_for_item_schema(\WP_REST_Server::CREATABLE),
            ),
        ));
        
        // Get single page
        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<slug>[a-zA-Z0-9-]+)', array(
            array(
                'methods' => \WP_REST_Server::READABLE,
                'callback' => array($this, 'get_page'),
                'permission_callback' => array($this, 'get_page_permissions_check'),
                'args' => array(
                    'slug' => array(
                        'description' => 'Page slug',
                        'type' => 'string',
                        'required' => true,
                    ),
                ),
            ),
            array(
                'methods' => \WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_page'),
                'permission_callback' => array($this, 'update_page_permissions_check'),
                'args' => $this->get_endpoint_args_for_item_schema(\WP_REST_Server::EDITABLE),
            ),
            array(
                'methods' => \WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_page'),
                'permission_callback' => array($this, 'delete_page_permissions_check'),
            ),
        ));
        
        // Get page by ID
        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', array(
            array(
                'methods' => \WP_REST_Server::READABLE,
                'callback' => array($this, 'get_page_by_id'),
                'permission_callback' => array($this, 'get_page_permissions_check'),
                'args' => array(
                    'id' => array(
                        'description' => 'Page ID',
                        'type' => 'integer',
                        'required' => true,
                    ),
                ),
            ),
        ));
    }
    
    /**
     * Get pages
     */
    public function get_pages($request) {
        $args = array(
            'post_type' => 'next_wp_page',
            'post_status' => array('publish', 'draft'),
            'posts_per_page' => $request->get_param('per_page') ?: 10,
            'paged' => $request->get_param('page') ?: 1,
            'orderby' => $request->get_param('orderby') ?: 'date',
            'order' => $request->get_param('order') ?: 'DESC',
        );
        
        if ($request->get_param('search')) {
            $args['s'] = sanitize_text_field($request->get_param('search'));
        }
        
        if ($request->get_param('template')) {
            $args['meta_query'] = array(
                array(
                    'key' => '_next_wp_template',
                    'value' => sanitize_text_field($request->get_param('template')),
                    'compare' => '='
                )
            );
        }
        
        $query = new \WP_Query($args);
        $pages = array();
        
        foreach ($query->posts as $post) {
            $pages[] = $this->prepare_page_for_response($post);
        }
        
        $response = rest_ensure_response($pages);
        
        // Add pagination headers
        $total = $query->found_posts;
        $max_pages = ceil($total / $args['posts_per_page']);
        
        $response->header('X-WP-Total', $total);
        $response->header('X-WP-TotalPages', $max_pages);
        
        return $this->success_response($response->data, array(
            'total' => $total,
            'page' => $args['paged'],
            'perPage' => $args['posts_per_page'],
            'totalPages' => $max_pages,
        ));
    }
    
    /**
     * Get single page by slug
     */
    public function get_page($request) {
        $slug = $request->get_param('slug');
        
        $post = get_page_by_path($slug, OBJECT, 'next_wp_page');
        
        if (!$post) {
            return $this->error_response('page_not_found', 'Page not found', 404);
        }
        
        $page_data = $this->prepare_page_for_response($post);
        
        return $this->success_response($page_data);
    }
    
    /**
     * Get single page by ID
     */
    public function get_page_by_id($request) {
        $id = $request->get_param('id');
        
        $post = get_post($id);
        
        if (!$post || $post->post_type !== 'next_wp_page') {
            return $this->error_response('page_not_found', 'Page not found', 404);
        }
        
        $page_data = $this->prepare_page_for_response($post);
        
        return $this->success_response($page_data);
    }
    
    /**
     * Create new page
     */
    public function create_page($request) {
        $data = $request->get_json_params();
        
        if (!$data) {
            return $this->error_response('invalid_data', 'Invalid JSON data', 400);
        }
        
        // Validate required fields
        if (empty($data['slug']) || empty($data['meta']['title'])) {
            return $this->error_response('missing_fields', 'Slug and title are required', 400);
        }
        
        // Check if slug already exists
        if (get_page_by_path($data['slug'], OBJECT, 'next_wp_page')) {
            return $this->error_response('slug_exists', 'Page with this slug already exists', 409);
        }
        
        $post_data = array(
            'post_title' => sanitize_text_field($data['meta']['title']),
            'post_name' => sanitize_title($data['slug']),
            'post_type' => 'next_wp_page',
            'post_status' => isset($data['status']) ? $data['status'] : 'draft',
            'post_content' => '', // We store blocks in meta
        );
        
        $post_id = wp_insert_post($post_data);
        
        if (is_wp_error($post_id)) {
            return $this->error_response('creation_failed', $post_id->get_error_message(), 500);
        }
        
        // Save meta data
        $this->save_page_meta($post_id, $data);
        
        // Get the created page
        $post = get_post($post_id);
        $page_data = $this->prepare_page_for_response($post);
        
        return $this->success_response($page_data, null, 201);
    }
    
    /**
     * Update page
     */
    public function update_page($request) {
        $slug = $request->get_param('slug');
        $data = $request->get_json_params();
        
        if (!$data) {
            return $this->error_response('invalid_data', 'Invalid JSON data', 400);
        }
        
        $post = get_page_by_path($slug, OBJECT, 'next_wp_page');
        
        if (!$post) {
            return $this->error_response('page_not_found', 'Page not found', 404);
        }
        
        $post_data = array(
            'ID' => $post->ID,
        );
        
        if (isset($data['meta']['title'])) {
            $post_data['post_title'] = sanitize_text_field($data['meta']['title']);
        }
        
        if (isset($data['slug']) && $data['slug'] !== $slug) {
            $post_data['post_name'] = sanitize_title($data['slug']);
        }
        
        if (isset($data['status'])) {
            $post_data['post_status'] = $data['status'];
        }
        
        $result = wp_update_post($post_data);
        
        if (is_wp_error($result)) {
            return $this->error_response('update_failed', $result->get_error_message(), 500);
        }
        
        // Save meta data
        $this->save_page_meta($post->ID, $data);
        
        // Get the updated page
        $post = get_post($post->ID);
        $page_data = $this->prepare_page_for_response($post);
        
        return $this->success_response($page_data);
    }
    
    /**
     * Delete page
     */
    public function delete_page($request) {
        $slug = $request->get_param('slug');
        
        $post = get_page_by_path($slug, OBJECT, 'next_wp_page');
        
        if (!$post) {
            return $this->error_response('page_not_found', 'Page not found', 404);
        }
        
        $result = wp_delete_post($post->ID, true);
        
        if (!$result) {
            return $this->error_response('deletion_failed', 'Failed to delete page', 500);
        }
        
        return $this->success_response(array('deleted' => true));
    }
    
    /**
     * Prepare page for response
     */
    private function prepare_page_for_response($post) {
        $blocks = get_post_meta($post->ID, '_next_wp_blocks', true);
        $meta = get_post_meta($post->ID, '_next_wp_meta', true);
        $template = get_post_meta($post->ID, '_next_wp_template', true);
        
        return array(
            'id' => (string) $post->ID,
            'slug' => $post->post_name,
            'meta' => $meta ?: array(
                'title' => $post->post_title,
                'description' => '',
                'keywords' => array(),
            ),
            'blocks' => $blocks ?: array(),
            'template' => $template ?: 'mobile',
            'status' => $post->post_status,
            'createdAt' => $post->post_date_gmt . 'Z',
            'updatedAt' => $post->post_modified_gmt . 'Z',
            'publishedAt' => $post->post_status === 'publish' ? $post->post_date_gmt . 'Z' : null,
        );
    }
    
    /**
     * Save page meta data
     */
    private function save_page_meta($post_id, $data) {
        if (isset($data['meta'])) {
            update_post_meta($post_id, '_next_wp_meta', $data['meta']);
        }
        
        if (isset($data['blocks'])) {
            update_post_meta($post_id, '_next_wp_blocks', $data['blocks']);
        }
        
        if (isset($data['template'])) {
            update_post_meta($post_id, '_next_wp_template', $data['template']);
        }
    }
    
    /**
     * Success response
     */
    private function success_response($data, $meta = null, $status = 200) {
        $response = array(
            'success' => true,
            'data' => $data,
        );
        
        if ($meta) {
            $response['meta'] = $meta;
        }
        
        return new \WP_REST_Response($response, $status);
    }
    
    /**
     * Error response
     */
    private function error_response($code, $message, $status = 400) {
        return new \WP_REST_Response(array(
            'success' => false,
            'error' => array(
                'code' => $code,
                'message' => $message,
            ),
        ), $status);
    }
    
    /**
     * Permission checks
     */
    public function get_pages_permissions_check($request) {
        return true; // Public endpoint for Next.js
    }
    
    public function get_page_permissions_check($request) {
        return true; // Public endpoint for Next.js
    }
    
    public function create_page_permissions_check($request) {
        return current_user_can('edit_posts');
    }
    
    public function update_page_permissions_check($request) {
        return current_user_can('edit_posts');
    }
    
    public function delete_page_permissions_check($request) {
        return current_user_can('delete_posts');
    }
    
    /**
     * Get collection parameters
     */
    public function get_collection_params() {
        return array(
            'page' => array(
                'description' => 'Current page of the collection',
                'type' => 'integer',
                'default' => 1,
                'minimum' => 1,
            ),
            'per_page' => array(
                'description' => 'Maximum number of items to be returned',
                'type' => 'integer',
                'default' => 10,
                'minimum' => 1,
                'maximum' => 100,
            ),
            'search' => array(
                'description' => 'Limit results to those matching a string',
                'type' => 'string',
            ),
            'orderby' => array(
                'description' => 'Sort collection by attribute',
                'type' => 'string',
                'default' => 'date',
                'enum' => array('date', 'title', 'slug'),
            ),
            'order' => array(
                'description' => 'Order sort attribute ascending or descending',
                'type' => 'string',
                'default' => 'DESC',
                'enum' => array('ASC', 'DESC'),
            ),
            'template' => array(
                'description' => 'Filter by template type',
                'type' => 'string',
                'enum' => array('mobile', 'saas', 'startup'),
            ),
        );
    }
}
