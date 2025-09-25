<?php
/**
 * Autoloader for Next.js WP Blocks plugin
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Autoloader class
 */
class NextWP_Autoloader {
    
    /**
     * Initialize autoloader
     */
    public static function init() {
        spl_autoload_register(array(__CLASS__, 'autoload'));
    }
    
    /**
     * Autoload classes
     */
    public static function autoload($class) {
        // Check if class belongs to our namespace
        if (strpos($class, 'NextWP\\') !== 0) {
            return;
        }
        
        // Convert namespace to file path
        $class = str_replace('NextWP\\', '', $class);
        $class = str_replace('\\', DIRECTORY_SEPARATOR, $class);
        
        // Convert CamelCase to kebab-case for file names
        $file = strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $class));
        $file = str_replace('_', '-', $file);
        
        // Construct file path
        $file_path = NEXT_WP_BLOCKS_PLUGIN_DIR . 'includes' . DIRECTORY_SEPARATOR . 'class-' . $file . '.php';
        
        // Load file if it exists
        if (file_exists($file_path)) {
            require_once $file_path;
        }
    }
}

// Initialize autoloader
NextWP_Autoloader::init();
