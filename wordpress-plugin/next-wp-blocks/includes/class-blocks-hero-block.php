<?php
/**
 * Hero Block
 */

namespace NextWP\Blocks;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Hero Block class
 */
class HeroBlock {
    
    /**
     * Block name
     */
    private $block_name = 'next-wp/hero';
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'register_block'));
    }
    
    /**
     * Register block
     */
    public function register_block() {
        register_block_type($this->block_name, array(
            'attributes' => $this->get_attributes(),
            'render_callback' => array($this, 'render_block'),
            'editor_script' => 'next-wp-blocks-editor',
            'editor_style' => 'next-wp-blocks-editor',
            'style' => 'next-wp-blocks-frontend',
        ));
    }
    
    /**
     * Get block attributes
     */
    private function get_attributes() {
        return array(
            'eyebrow' => array(
                'type' => 'string',
                'default' => '',
            ),
            'title' => array(
                'type' => 'string',
                'default' => 'Welcome to Our App',
            ),
            'description' => array(
                'type' => 'string',
                'default' => 'Experience the future of productivity with our AI-powered application.',
            ),
            'primaryCta' => array(
                'type' => 'object',
                'default' => array(
                    'label' => 'Get Started',
                    'href' => '#',
                    'target' => '_self',
                ),
            ),
            'secondaryCta' => array(
                'type' => 'object',
                'default' => null,
            ),
            'backgroundImage' => array(
                'type' => 'object',
                'default' => null,
            ),
            'showcaseImages' => array(
                'type' => 'array',
                'default' => array(),
                'items' => array(
                    'type' => 'object',
                ),
            ),
            'downloadBadges' => array(
                'type' => 'object',
                'default' => array(
                    'appStore' => null,
                    'googlePlay' => null,
                ),
            ),
            'enableParallax' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'textAlignment' => array(
                'type' => 'string',
                'default' => 'center',
                'enum' => array('left', 'center', 'right'),
            ),
        );
    }
    
    /**
     * Render block
     */
    public function render_block($attributes, $content) {
        $wrapper_attributes = get_block_wrapper_attributes(array(
            'class' => 'next-wp-hero-block',
            'data-alignment' => $attributes['textAlignment'],
            'data-parallax' => $attributes['enableParallax'] ? 'true' : 'false',
        ));
        
        ob_start();
        ?>
        <div <?php echo $wrapper_attributes; ?>>
            <div class="next-wp-hero-content">
                <?php if (!empty($attributes['eyebrow'])): ?>
                    <div class="next-wp-hero-eyebrow">
                        <?php echo esc_html($attributes['eyebrow']); ?>
                    </div>
                <?php endif; ?>
                
                <h1 class="next-wp-hero-title">
                    <?php echo esc_html($attributes['title']); ?>
                </h1>
                
                <p class="next-wp-hero-description">
                    <?php echo esc_html($attributes['description']); ?>
                </p>
                
                <div class="next-wp-hero-actions">
                    <?php if (!empty($attributes['primaryCta']['label'])): ?>
                        <a href="<?php echo esc_url($attributes['primaryCta']['href']); ?>" 
                           target="<?php echo esc_attr($attributes['primaryCta']['target'] ?? '_self'); ?>"
                           class="next-wp-hero-cta primary">
                            <?php echo esc_html($attributes['primaryCta']['label']); ?>
                        </a>
                    <?php endif; ?>
                    
                    <?php if (!empty($attributes['secondaryCta']['label'])): ?>
                        <a href="<?php echo esc_url($attributes['secondaryCta']['href']); ?>" 
                           target="<?php echo esc_attr($attributes['secondaryCta']['target'] ?? '_self'); ?>"
                           class="next-wp-hero-cta secondary">
                            <?php echo esc_html($attributes['secondaryCta']['label']); ?>
                        </a>
                    <?php endif; ?>
                </div>
                
                <?php if (!empty($attributes['downloadBadges']['appStore']) || !empty($attributes['downloadBadges']['googlePlay'])): ?>
                    <div class="next-wp-hero-badges">
                        <?php if (!empty($attributes['downloadBadges']['appStore'])): ?>
                            <img src="<?php echo esc_url($attributes['downloadBadges']['appStore']['url']); ?>" 
                                 alt="<?php echo esc_attr($attributes['downloadBadges']['appStore']['alt']); ?>"
                                 class="download-badge app-store" />
                        <?php endif; ?>
                        
                        <?php if (!empty($attributes['downloadBadges']['googlePlay'])): ?>
                            <img src="<?php echo esc_url($attributes['downloadBadges']['googlePlay']['url']); ?>" 
                                 alt="<?php echo esc_attr($attributes['downloadBadges']['googlePlay']['alt']); ?>"
                                 class="download-badge google-play" />
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
            
            <?php if (!empty($attributes['showcaseImages'])): ?>
                <div class="next-wp-hero-showcase">
                    <?php foreach ($attributes['showcaseImages'] as $index => $image): ?>
                        <div class="showcase-image" data-index="<?php echo esc_attr($index); ?>">
                            <img src="<?php echo esc_url($image['url']); ?>" 
                                 alt="<?php echo esc_attr($image['alt']); ?>"
                                 width="<?php echo esc_attr($image['width'] ?? ''); ?>"
                                 height="<?php echo esc_attr($image['height'] ?? ''); ?>" />
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            
            <?php if (!empty($attributes['backgroundImage'])): ?>
                <div class="next-wp-hero-background">
                    <img src="<?php echo esc_url($attributes['backgroundImage']['url']); ?>" 
                         alt="<?php echo esc_attr($attributes['backgroundImage']['alt']); ?>" />
                </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
