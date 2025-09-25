<?php
/**
 * Plugin Name: Next.js WP Blocks
 * Plugin URI: https://github.com/your-org/next-wp
 * Description: Visual editing layer for Next.js templates with custom Gutenberg blocks
 * Version: 1.0.0
 * Author: Next-WP Team
 * License: MIT
 * Text Domain: next-wp-blocks
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('NEXT_WP_BLOCKS_VERSION', '1.0.0');
define('NEXT_WP_BLOCKS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('NEXT_WP_BLOCKS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('NEXT_WP_BLOCKS_PLUGIN_FILE', __FILE__);

// Autoloader
require_once NEXT_WP_BLOCKS_PLUGIN_DIR . 'includes/class-autoloader.php';

/**
 * Main plugin class
 */
class NextWPBlocks {
    
    /**
     * Plugin instance
     */
    private static $instance = null;
    
    /**
     * Get plugin instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        $this->init_hooks();
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action('init', array($this, 'init'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_editor_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        
        // Plugin activation/deactivation
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Load text domain
        load_plugin_textdomain('next-wp-blocks', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        // Initialize components
        $this->init_blocks();
        $this->init_post_types();
        $this->init_meta_fields();
    }
    
    /**
     * Initialize custom blocks
     */
    private function init_blocks() {
        $blocks = array(
            'NextWP\\Blocks\\HeroBlock',
            'NextWP\\Blocks\\FeatureScrollBlock',
            'NextWP\\Blocks\\FeatureGridBlock',
            'NextWP\\Blocks\\FeatureHighlightBlock',
            'NextWP\\Blocks\\BentoGridBlock',
            'NextWP\\Blocks\\BenefitsBlock',
            'NextWP\\Blocks\\TestimonialsBlock',
            'NextWP\\Blocks\\PricingBlock',
            'NextWP\\Blocks\\FAQBlock',
            'NextWP\\Blocks\\CTABlock',
            'NextWP\\Blocks\\FooterBlock'
        );
        
        foreach ($blocks as $block_class) {
            if (class_exists($block_class)) {
                new $block_class();
            }
        }
    }
    
    /**
     * Initialize custom post types
     */
    private function init_post_types() {
        new NextWP\PostTypes\PageBuilder();
    }
    
    /**
     * Initialize meta fields
     */
    private function init_meta_fields() {
        new NextWP\Meta\PageMeta();
        new NextWP\Meta\SiteConfig();
    }
    
    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        new NextWP\API\PagesController();
        new NextWP\API\SiteConfigController();
        new NextWP\API\MediaController();
        new NextWP\API\WebhookController();
    }
    
    /**
     * Enqueue block editor assets
     */
    public function enqueue_block_editor_assets() {
        wp_enqueue_script(
            'next-wp-blocks-editor',
            NEXT_WP_BLOCKS_PLUGIN_URL . 'assets/js/blocks.js',
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
            NEXT_WP_BLOCKS_VERSION,
            true
        );
        
        wp_enqueue_style(
            'next-wp-blocks-editor',
            NEXT_WP_BLOCKS_PLUGIN_URL . 'assets/css/blocks-editor.css',
            array('wp-edit-blocks'),
            NEXT_WP_BLOCKS_VERSION
        );
        
        // Localize script with plugin data
        wp_localize_script('next-wp-blocks-editor', 'nextWpBlocks', array(
            'apiUrl' => rest_url('next-wp/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'pluginUrl' => NEXT_WP_BLOCKS_PLUGIN_URL,
            'iconLibrary' => $this->get_icon_library(),
        ));
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueue_frontend_assets() {
        if (is_admin()) {
            return;
        }
        
        wp_enqueue_style(
            'next-wp-blocks-frontend',
            NEXT_WP_BLOCKS_PLUGIN_URL . 'assets/css/blocks-frontend.css',
            array(),
            NEXT_WP_BLOCKS_VERSION
        );
    }
    
    /**
     * Get icon library for blocks
     */
    private function get_icon_library() {
        return array(
            'brain', 'clock', 'calendar', 'cloud', 'users', 'bell',
            'shield', 'sparkles', 'rocket', 'zap', 'bookmark', 'target',
            'layers', 'tablet', 'component', 'star', 'message', 'globe',
            'settings', 'list', 'heart', 'check', 'arrow-right', 'chevron-right', 'none'
        );
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Create custom tables if needed
        $this->create_tables();
        
        // Set default options
        $this->set_default_options();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Create custom database tables
     */
    private function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Page compositions table
        $table_name = $wpdb->prefix . 'next_wp_page_compositions';
        
        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            page_id bigint(20) NOT NULL,
            blocks longtext NOT NULL,
            template varchar(50) DEFAULT 'mobile',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY page_id (page_id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    /**
     * Set default plugin options
     */
    private function set_default_options() {
        $default_site_config = array(
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url' => home_url(),
            'theme' => array(
                'primaryColor' => '#3b82f6',
                'secondaryColor' => '#64748b',
                'fontFamily' => 'Inter, sans-serif'
            )
        );
        
        add_option('next_wp_site_config', $default_site_config);
    }
}

// Initialize plugin
NextWPBlocks::get_instance();
