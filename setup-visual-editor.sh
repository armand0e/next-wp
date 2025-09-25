#!/bin/bash

# WordPress Visual Editor Setup Script
# This script sets up the complete WordPress visual editing system for all templates

echo "🚀 Setting up WordPress Visual Editor System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "packages/content-schema" ]; then
    print_error "Please run this script from the root of the next-wp repository"
    exit 1
fi

print_status "Building content schema package..."
cd packages/content-schema
npm install
npm run build
if [ $? -eq 0 ]; then
    print_success "Content schema package built successfully"
else
    print_error "Failed to build content schema package"
    exit 1
fi

cd ../..

# Install dependencies for all templates
templates=("mobile" "saas" "startup")

for template in "${templates[@]}"; do
    print_status "Installing dependencies for $template template..."
    cd "templates/$template"
    
    if [ -f "package.json" ]; then
        npm install
        if [ $? -eq 0 ]; then
            print_success "$template template dependencies installed"
        else
            print_warning "Some dependencies may have failed to install for $template template"
        fi
    else
        print_warning "No package.json found for $template template"
    fi
    
    cd ../..
done

# Create environment files if they don't exist
print_status "Setting up environment files..."

for template in "${templates[@]}"; do
    env_file="templates/$template/.env.local"
    if [ ! -f "$env_file" ]; then
        print_status "Creating environment file for $template template..."
        cat > "$env_file" << EOF
# WordPress API Configuration
NEXT_PUBLIC_WORDPRESS_URL=http://wordpress.armand0e.com
NEXT_PUBLIC_APP_URL=https://$template.armand0e.com

# Webhook Security (generate a secure random string)
WORDPRESS_WEBHOOK_SECRET=your-secret-key-here-$(openssl rand -hex 16)
EOF
        print_success "Environment file created for $template template"
    else
        print_warning "Environment file already exists for $template template"
    fi
done

# WordPress plugin setup instructions
print_status "WordPress Plugin Setup Instructions:"
echo ""
echo "1. Copy the wordpress-plugin/next-wp-blocks directory to your WordPress plugins folder"
echo "2. Activate the 'Next.js WP Blocks' plugin in WordPress admin"
echo "3. Go to Settings > Next.js WP Blocks to configure:"
echo "   - Webhook URLs:"
echo "     • Mobile: https://mobile.armand0e.com/api/revalidate"
echo "     • SaaS: https://saas.armand0e.com/api/revalidate"
echo "     • Startup: https://startup.armand0e.com/api/revalidate"
echo "   - Use the webhook secrets from your .env.local files"
echo ""

# Development server instructions
print_status "Development Setup Complete!"
echo ""
echo "To start development servers:"
echo ""
for template in "${templates[@]}"; do
    echo "📱 $template template:"
    echo "   cd templates/$template && npm run dev"
    echo "   Open: http://localhost:3000"
    echo ""
done

print_status "WordPress Visual Editor Features:"
echo ""
echo "✅ 11 Custom Gutenberg Blocks:"
echo "   • Hero, Feature Grid, Feature Highlight"
echo "   • Bento Grid, Benefits, Testimonials"
echo "   • Pricing, FAQ, CTA, Footer"
echo "   • Feature Scroll"
echo ""
echo "✅ Real-time Content Updates:"
echo "   • Webhook-triggered revalidation"
echo "   • ISR caching for performance"
echo "   • Preview mode for draft content"
echo ""
echo "✅ Type-Safe Integration:"
echo "   • Shared TypeScript schema"
echo "   • Zod validation"
echo "   • Error boundaries"
echo ""

print_success "WordPress Visual Editor System is ready!"
echo ""
print_status "Next Steps:"
echo "1. Set up your WordPress instance with the plugin"
echo "2. Configure webhook URLs and secrets"
echo "3. Create your first page using Gutenberg blocks"
echo "4. Deploy your Next.js templates to production"
echo ""
print_status "For detailed documentation, see: VISUAL-EDITOR-README.md"
