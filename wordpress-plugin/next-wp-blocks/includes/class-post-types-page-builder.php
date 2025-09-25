<?php
/**
 * Page Builder Post Type
 */

namespace NextWP\PostTypes;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Page Builder class
 */
class PageBuilder {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'register_post_type'));
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_post'));
        add_filter('manage_next_wp_page_posts_columns', array($this, 'add_custom_columns'));
        add_action('manage_next_wp_page_posts_custom_column', array($this, 'custom_column_content'), 10, 2);
    }
    
    /**
     * Register post type
     */
    public function register_post_type() {
        $labels = array(
            'name' => __('Next.js Pages', 'next-wp-blocks'),
            'singular_name' => __('Next.js Page', 'next-wp-blocks'),
            'menu_name' => __('Next.js Pages', 'next-wp-blocks'),
            'name_admin_bar' => __('Next.js Page', 'next-wp-blocks'),
            'add_new' => __('Add New', 'next-wp-blocks'),
            'add_new_item' => __('Add New Page', 'next-wp-blocks'),
            'new_item' => __('New Page', 'next-wp-blocks'),
            'edit_item' => __('Edit Page', 'next-wp-blocks'),
            'view_item' => __('View Page', 'next-wp-blocks'),
            'all_items' => __('All Pages', 'next-wp-blocks'),
            'search_items' => __('Search Pages', 'next-wp-blocks'),
            'parent_item_colon' => __('Parent Pages:', 'next-wp-blocks'),
            'not_found' => __('No pages found.', 'next-wp-blocks'),
            'not_found_in_trash' => __('No pages found in Trash.', 'next-wp-blocks'),
        );
        
        $args = array(
            'labels' => $labels,
            'description' => __('Next.js page compositions built with blocks', 'next-wp-blocks'),
            'public' => false,
            'publicly_queryable' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'menu_position' => 20,
            'menu_icon' => 'dashicons-layout',
            'query_var' => true,
            'rewrite' => array('slug' => 'next-wp-page'),
            'capability_type' => 'post',
            'has_archive' => false,
            'hierarchical' => false,
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'show_in_rest' => true,
            'rest_base' => 'next-wp-pages',
            'rest_controller_class' => 'WP_REST_Posts_Controller',
        );
        
        register_post_type('next_wp_page', $args);
    }
    
    /**
     * Add meta boxes
     */
    public function add_meta_boxes() {
        add_meta_box(
            'next-wp-page-settings',
            __('Page Settings', 'next-wp-blocks'),
            array($this, 'page_settings_meta_box'),
            'next_wp_page',
            'side',
            'high'
        );
        
        add_meta_box(
            'next-wp-page-preview',
            __('Preview', 'next-wp-blocks'),
            array($this, 'page_preview_meta_box'),
            'next_wp_page',
            'side',
            'low'
        );
        
        add_meta_box(
            'next-wp-page-seo',
            __('SEO Settings', 'next-wp-blocks'),
            array($this, 'page_seo_meta_box'),
            'next_wp_page',
            'normal',
            'low'
        );
    }
    
    /**
     * Page settings meta box
     */
    public function page_settings_meta_box($post) {
        wp_nonce_field('next_wp_page_meta_box', 'next_wp_page_meta_box_nonce');
        
        $template = get_post_meta($post->ID, '_next_wp_template', true) ?: 'mobile';
        $slug = get_post_meta($post->ID, '_next_wp_slug', true) ?: $post->post_name;
        $status = get_post_meta($post->ID, '_next_wp_status', true) ?: 'draft';
        
        ?>
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="next_wp_template"><?php _e('Template', 'next-wp-blocks'); ?></label>
                </th>
                <td>
                    <select name="next_wp_template" id="next_wp_template" class="widefat">
                        <option value="mobile" <?php selected($template, 'mobile'); ?>><?php _e('Mobile', 'next-wp-blocks'); ?></option>
                        <option value="saas" <?php selected($template, 'saas'); ?>><?php _e('SaaS', 'next-wp-blocks'); ?></option>
                        <option value="startup" <?php selected($template, 'startup'); ?>><?php _e('Startup', 'next-wp-blocks'); ?></option>
                    </select>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="next_wp_slug"><?php _e('Page Slug', 'next-wp-blocks'); ?></label>
                </th>
                <td>
                    <input type="text" name="next_wp_slug" id="next_wp_slug" value="<?php echo esc_attr($slug); ?>" class="widefat" />
                    <p class="description"><?php _e('URL slug for this page', 'next-wp-blocks'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="next_wp_status"><?php _e('Status', 'next-wp-blocks'); ?></label>
                </th>
                <td>
                    <select name="next_wp_status" id="next_wp_status" class="widefat">
                        <option value="draft" <?php selected($status, 'draft'); ?>><?php _e('Draft', 'next-wp-blocks'); ?></option>
                        <option value="published" <?php selected($status, 'published'); ?>><?php _e('Published', 'next-wp-blocks'); ?></option>
                        <option value="archived" <?php selected($status, 'archived'); ?>><?php _e('Archived', 'next-wp-blocks'); ?></option>
                    </select>
                </td>
            </tr>
        </table>
        <?php
    }
    
    /**
     * Page preview meta box
     */
    public function page_preview_meta_box($post) {
        $next_js_url = get_option('next_wp_site_config')['url'] ?? '';
        $slug = get_post_meta($post->ID, '_next_wp_slug', true) ?: $post->post_name;
        
        if ($next_js_url && $slug) {
            $preview_url = trailingslashit($next_js_url) . 'preview?slug=' . $slug . '&token=' . wp_create_nonce('next_wp_preview_' . $post->ID);
            ?>
            <p>
                <a href="<?php echo esc_url($preview_url); ?>" target="_blank" class="button button-secondary">
                    <?php _e('Preview in Next.js', 'next-wp-blocks'); ?>
                </a>
            </p>
            <p class="description">
                <?php _e('Preview this page in your Next.js application', 'next-wp-blocks'); ?>
            </p>
            <?php
        } else {
            ?>
            <p class="description">
                <?php _e('Configure your Next.js URL in site settings to enable preview', 'next-wp-blocks'); ?>
            </p>
            <?php
        }
    }
    
    /**
     * Page SEO meta box
     */
    public function page_seo_meta_box($post) {
        $meta = get_post_meta($post->ID, '_next_wp_meta', true) ?: array();
        
        $title = $meta['title'] ?? $post->post_title;
        $description = $meta['description'] ?? '';
        $keywords = $meta['keywords'] ?? array();
        $og_image = $meta['ogImage'] ?? null;
        $canonical_url = $meta['canonicalUrl'] ?? '';
        $no_index = $meta['noIndex'] ?? false;
        
        ?>
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="next_wp_meta_title"><?php _e('SEO Title', 'next-wp-blocks'); ?></label>
                </th>
                <td>
                    <input type="text" name="next_wp_meta[title]" id="next_wp_meta_title" value="<?php echo esc_attr($title); ?>" class="widefat" />
                    <p class="description"><?php _e('Title tag for search engines', 'next-wp-blocks'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="next_wp_meta_description"><?php _e('Meta Description', 'next-wp-blocks'); ?></label>
                </th>
                <td>
                    <textarea name="next_wp_meta[description]" id="next_wp_meta_description" rows="3" class="widefat"><?php echo esc_textarea($description); ?></textarea>
                    <p class="description"><?php _e('Description for search engines (150-160 characters)', 'next-wp-blocks'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="next_wp_meta_keywords"><?php _e('Keywords', 'next-wp-blocks'); ?></label>
                </th>
                <td>
                    <input type="text" name="next_wp_meta[keywords]" id="next_wp_meta_keywords" value="<?php echo esc_attr(implode(', ', $keywords)); ?>" class="widefat" />
                    <p class="description"><?php _e('Comma-separated keywords', 'next-wp-blocks'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="next_wp_meta_canonical"><?php _e('Canonical URL', 'next-wp-blocks'); ?></label>
                </th>
                <td>
                    <input type="url" name="next_wp_meta[canonicalUrl]" id="next_wp_meta_canonical" value="<?php echo esc_attr($canonical_url); ?>" class="widefat" />
                    <p class="description"><?php _e('Canonical URL for this page', 'next-wp-blocks'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="next_wp_meta_noindex"><?php _e('Search Engine Visibility', 'next-wp-blocks'); ?></label>
                </th>
                <td>
                    <label>
                        <input type="checkbox" name="next_wp_meta[noIndex]" id="next_wp_meta_noindex" value="1" <?php checked($no_index, true); ?> />
                        <?php _e('Discourage search engines from indexing this page', 'next-wp-blocks'); ?>
                    </label>
                </td>
            </tr>
        </table>
        <?php
    }
    
    /**
     * Save post meta
     */
    public function save_post($post_id) {
        // Check if our nonce is set
        if (!isset($_POST['next_wp_page_meta_box_nonce'])) {
            return;
        }
        
        // Verify that the nonce is valid
        if (!wp_verify_nonce($_POST['next_wp_page_meta_box_nonce'], 'next_wp_page_meta_box')) {
            return;
        }
        
        // If this is an autosave, our form has not been submitted, so we don't want to do anything
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        // Check the user's permissions
        if (isset($_POST['post_type']) && 'next_wp_page' == $_POST['post_type']) {
            if (!current_user_can('edit_page', $post_id)) {
                return;
            }
        } else {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }
        
        // Save template
        if (isset($_POST['next_wp_template'])) {
            update_post_meta($post_id, '_next_wp_template', sanitize_text_field($_POST['next_wp_template']));
        }
        
        // Save slug
        if (isset($_POST['next_wp_slug'])) {
            $slug = sanitize_title($_POST['next_wp_slug']);
            update_post_meta($post_id, '_next_wp_slug', $slug);
            
            // Update post slug
            wp_update_post(array(
                'ID' => $post_id,
                'post_name' => $slug,
            ));
        }
        
        // Save status
        if (isset($_POST['next_wp_status'])) {
            update_post_meta($post_id, '_next_wp_status', sanitize_text_field($_POST['next_wp_status']));
        }
        
        // Save meta data
        if (isset($_POST['next_wp_meta'])) {
            $meta = $_POST['next_wp_meta'];
            
            // Process keywords
            if (isset($meta['keywords'])) {
                $keywords = array_map('trim', explode(',', $meta['keywords']));
                $meta['keywords'] = array_filter($keywords);
            }
            
            // Process checkbox
            $meta['noIndex'] = isset($meta['noIndex']) && $meta['noIndex'] === '1';
            
            update_post_meta($post_id, '_next_wp_meta', $meta);
        }
        
        // Trigger webhook if page is published
        if (isset($_POST['next_wp_status']) && $_POST['next_wp_status'] === 'published') {
            $this->trigger_webhook($post_id, 'page_published');
        }
    }
    
    /**
     * Add custom columns
     */
    public function add_custom_columns($columns) {
        $new_columns = array();
        
        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;
            
            if ($key === 'title') {
                $new_columns['template'] = __('Template', 'next-wp-blocks');
                $new_columns['status'] = __('Status', 'next-wp-blocks');
                $new_columns['slug'] = __('Slug', 'next-wp-blocks');
            }
        }
        
        return $new_columns;
    }
    
    /**
     * Custom column content
     */
    public function custom_column_content($column, $post_id) {
        switch ($column) {
            case 'template':
                $template = get_post_meta($post_id, '_next_wp_template', true) ?: 'mobile';
                echo '<span class="template-badge template-' . esc_attr($template) . '">' . esc_html(ucfirst($template)) . '</span>';
                break;
                
            case 'status':
                $status = get_post_meta($post_id, '_next_wp_status', true) ?: 'draft';
                $status_class = $status === 'published' ? 'published' : ($status === 'archived' ? 'archived' : 'draft');
                echo '<span class="status-badge status-' . esc_attr($status_class) . '">' . esc_html(ucfirst($status)) . '</span>';
                break;
                
            case 'slug':
                $slug = get_post_meta($post_id, '_next_wp_slug', true) ?: get_post($post_id)->post_name;
                echo '<code>' . esc_html($slug) . '</code>';
                break;
        }
    }
    
    /**
     * Trigger webhook
     */
    private function trigger_webhook($post_id, $action) {
        $webhook_url = get_option('next_wp_webhook_url');
        $webhook_secret = get_option('next_wp_webhook_secret');
        
        if (!$webhook_url || !$webhook_secret) {
            return;
        }
        
        $post = get_post($post_id);
        $slug = get_post_meta($post_id, '_next_wp_slug', true) ?: $post->post_name;
        
        $payload = array(
            'action' => $action,
            'page' => array(
                'id' => $post_id,
                'slug' => $slug,
                'template' => get_post_meta($post_id, '_next_wp_template', true) ?: 'mobile',
            ),
            'timestamp' => current_time('timestamp'),
        );
        
        $signature = hash_hmac('sha256', wp_json_encode($payload), $webhook_secret);
        
        wp_remote_post($webhook_url, array(
            'body' => wp_json_encode($payload),
            'headers' => array(
                'Content-Type' => 'application/json',
                'X-Next-WP-Signature' => 'sha256=' . $signature,
            ),
            'timeout' => 10,
        ));
    }
}
