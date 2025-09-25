<?php
/**
 * Webhook API Controller
 */

namespace NextWP\API;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Webhook Controller class
 */
class WebhookController extends \WP_REST_Controller {
    
    /**
     * Namespace
     */
    protected $namespace = 'next-wp/v1';
    
    /**
     * Rest base
     */
    protected $rest_base = 'webhook';
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->register_routes();
        $this->init_hooks();
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action('save_post_next_wp_page', array($this, 'trigger_page_webhook'), 10, 3);
        add_action('delete_post', array($this, 'trigger_delete_webhook'), 10, 1);
        add_action('updated_option', array($this, 'trigger_config_webhook'), 10, 3);
    }
    
    /**
     * Register REST routes
     */
    public function register_routes() {
        // Test webhook endpoint
        register_rest_route($this->namespace, '/' . $this->rest_base . '/test', array(
            array(
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => array($this, 'test_webhook'),
                'permission_callback' => array($this, 'webhook_permissions_check'),
            ),
        ));
        
        // Configure webhook endpoint
        register_rest_route($this->namespace, '/' . $this->rest_base . '/configure', array(
            array(
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => array($this, 'configure_webhook'),
                'permission_callback' => array($this, 'webhook_permissions_check'),
                'args' => array(
                    'url' => array(
                        'required' => true,
                        'type' => 'string',
                        'format' => 'uri',
                        'description' => 'Webhook URL',
                    ),
                    'secret' => array(
                        'required' => true,
                        'type' => 'string',
                        'description' => 'Webhook secret for signature verification',
                    ),
                ),
            ),
        ));
        
        // Get webhook status
        register_rest_route($this->namespace, '/' . $this->rest_base . '/status', array(
            array(
                'methods' => \WP_REST_Server::READABLE,
                'callback' => array($this, 'get_webhook_status'),
                'permission_callback' => array($this, 'webhook_permissions_check'),
            ),
        ));
    }
    
    /**
     * Test webhook
     */
    public function test_webhook($request) {
        $webhook_url = get_option('next_wp_webhook_url');
        $webhook_secret = get_option('next_wp_webhook_secret');
        
        if (!$webhook_url || !$webhook_secret) {
            return $this->error_response('webhook_not_configured', 'Webhook URL and secret must be configured first', 400);
        }
        
        $payload = array(
            'action' => 'test',
            'message' => 'This is a test webhook from Next.js WP Blocks',
            'timestamp' => current_time('timestamp'),
            'site_url' => home_url(),
        );
        
        $result = $this->send_webhook($payload);
        
        if (is_wp_error($result)) {
            return $this->error_response('webhook_failed', $result->get_error_message(), 500);
        }
        
        $response_code = wp_remote_retrieve_response_code($result);
        $response_body = wp_remote_retrieve_body($result);
        
        return $this->success_response(array(
            'sent' => true,
            'response_code' => $response_code,
            'response_body' => $response_body,
            'webhook_url' => $webhook_url,
        ));
    }
    
    /**
     * Configure webhook
     */
    public function configure_webhook($request) {
        $url = $request->get_param('url');
        $secret = $request->get_param('secret');
        
        // Validate URL
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return $this->error_response('invalid_url', 'Invalid webhook URL', 400);
        }
        
        // Save configuration
        update_option('next_wp_webhook_url', esc_url_raw($url));
        update_option('next_wp_webhook_secret', sanitize_text_field($secret));
        
        // Test the webhook
        $test_payload = array(
            'action' => 'webhook_configured',
            'message' => 'Webhook configuration successful',
            'timestamp' => current_time('timestamp'),
        );
        
        $result = $this->send_webhook($test_payload);
        
        if (is_wp_error($result)) {
            return $this->error_response('webhook_test_failed', 'Webhook configured but test failed: ' . $result->get_error_message(), 500);
        }
        
        return $this->success_response(array(
            'configured' => true,
            'url' => $url,
            'test_sent' => true,
        ));
    }
    
    /**
     * Get webhook status
     */
    public function get_webhook_status($request) {
        $webhook_url = get_option('next_wp_webhook_url');
        $webhook_secret = get_option('next_wp_webhook_secret');
        
        return $this->success_response(array(
            'configured' => !empty($webhook_url) && !empty($webhook_secret),
            'url' => $webhook_url ?: null,
            'has_secret' => !empty($webhook_secret),
        ));
    }
    
    /**
     * Trigger page webhook
     */
    public function trigger_page_webhook($post_id, $post, $update) {
        // Only trigger for published posts
        if ($post->post_status !== 'publish') {
            return;
        }
        
        $action = $update ? 'page_updated' : 'page_created';
        $slug = get_post_meta($post_id, '_next_wp_slug', true) ?: $post->post_name;
        $template = get_post_meta($post_id, '_next_wp_template', true) ?: 'mobile';
        
        $payload = array(
            'action' => $action,
            'page' => array(
                'id' => (string) $post_id,
                'slug' => $slug,
                'title' => $post->post_title,
                'template' => $template,
                'status' => 'published',
                'updated_at' => $post->post_modified_gmt . 'Z',
            ),
            'timestamp' => current_time('timestamp'),
        );
        
        $this->send_webhook($payload);
    }
    
    /**
     * Trigger delete webhook
     */
    public function trigger_delete_webhook($post_id) {
        $post = get_post($post_id);
        
        if (!$post || $post->post_type !== 'next_wp_page') {
            return;
        }
        
        $slug = get_post_meta($post_id, '_next_wp_slug', true) ?: $post->post_name;
        $template = get_post_meta($post_id, '_next_wp_template', true) ?: 'mobile';
        
        $payload = array(
            'action' => 'page_deleted',
            'page' => array(
                'id' => (string) $post_id,
                'slug' => $slug,
                'template' => $template,
            ),
            'timestamp' => current_time('timestamp'),
        );
        
        $this->send_webhook($payload);
    }
    
    /**
     * Trigger config webhook
     */
    public function trigger_config_webhook($option, $old_value, $value) {
        if ($option !== 'next_wp_site_config') {
            return;
        }
        
        $payload = array(
            'action' => 'site_config_updated',
            'config' => $value,
            'timestamp' => current_time('timestamp'),
        );
        
        $this->send_webhook($payload);
    }
    
    /**
     * Send webhook
     */
    private function send_webhook($payload) {
        $webhook_url = get_option('next_wp_webhook_url');
        $webhook_secret = get_option('next_wp_webhook_secret');
        
        if (!$webhook_url || !$webhook_secret) {
            return new \WP_Error('webhook_not_configured', 'Webhook URL and secret not configured');
        }
        
        $json_payload = wp_json_encode($payload);
        $signature = hash_hmac('sha256', $json_payload, $webhook_secret);
        
        $args = array(
            'body' => $json_payload,
            'headers' => array(
                'Content-Type' => 'application/json',
                'X-Next-WP-Signature' => 'sha256=' . $signature,
                'X-Next-WP-Event' => $payload['action'],
                'User-Agent' => 'NextWP-Webhook/1.0',
            ),
            'timeout' => 15,
            'redirection' => 0,
            'blocking' => false, // Non-blocking for performance
        );
        
        return wp_remote_post($webhook_url, $args);
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
     * Permission check
     */
    public function webhook_permissions_check($request) {
        return current_user_can('manage_options');
    }
}
