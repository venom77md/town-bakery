# SweetCrust Bakery - Next.js 14 RTL Website

A beautiful, fully RTL (Arabic-first) responsive bakery website for **Town Bakery** built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

- ✅ **Fully RTL Support** - Arabic-first with English fallback in data files
- ✅ **Responsive Design** - Mobile-first, works perfectly on all devices
- ✅ **Complete E-commerce Flow** - Products, cart, checkout, order confirmation
- ✅ **Product Management** - Product listing with categories and search
- ✅ **Shopping Cart** - localStorage-based cart with add/remove/update
- ✅ **Order System** - Complete order form with delivery options
- ✅ **Contact Form** - Contact form with WhatsApp integration
- ✅ **Admin Dashboard** - Protected admin page for viewing orders
- ✅ **SEO Optimized** - Meta tags, Open Graph, and Schema markup
- ✅ **Analytics Ready** - Google Analytics integration placeholder
- ✅ **Animations** - Smooth animations with Framer Motion
- ✅ **Accessibility** - Keyboard navigation and proper alt texts

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS with RTL support
- **Framer Motion** - Smooth animations
- **Cairo Font** - Arabic typography from Google Fonts
- **TypeScript/JavaScript** - Type-safe development

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or download the project:
```bash
cd town-bakery
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Copy the environment file and configure:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and set:
- `NEXT_PUBLIC_GA_ID` - Your Google Analytics ID (optional)
- `NEXT_PUBLIC_ADMIN_PASSWORD` - Password for admin page (default: admin123)
- `NEXT_PUBLIC_CONTACT_PHONE` - Phone number for WhatsApp link (format: +20XXXXXXXXXX)

5. Add your assets to `/public/assets/`:
   - `logo.png` - Main logo
   - `hero-1.jpg` - Hero section image
   - `product-1.jpg` through `product-6.jpg` - Product images
   - `chef.jpg` - Chef photo for about page

6. Run the development server:
```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (components)/
│   │   ├── Navbar.jsx          # Navigation bar with cart count
│   │   ├── Footer.jsx          # Footer with links and WhatsApp
│   │   ├── Hero.jsx            # Hero section component
│   │   ├── ProductCard.jsx     # Product card component
│   │   ├── ProductGrid.jsx     # Product grid
│   │   └── ContactForm.jsx    # Contact form component
│   ├── api/
│   │   ├── products/route.js   # GET products API
│   │   ├── orders/route.js     # GET/POST orders API
│   │   └── contact/route.js   # POST contact form API
│   ├── admin/
│   │   └── page.jsx            # Admin dashboard (protected)
│   ├── cart/
│   │   └── page.jsx            # Shopping cart page
│   ├── order/
│   │   └── page.jsx            # Order confirmation page
│   ├── home/
│   │   └── page.jsx            # Home page
│   ├── products/
│   │   ├── page.jsx            # Products listing
│   │   └── [slug]/page.jsx     # Product detail page
│   ├── about/
│   │   └── page.jsx            # About page
│   ├── contact/
│   │   └── page.jsx            # Contact page
│   ├── layout.tsx              # Root layout with Navbar/Footer
│   ├── globals.css             # Global styles with RTL
│   └── page.jsx                # Root redirect to /home
├── lib/
│   └── products.js             # Products data (Arabic/English)
├── data/
│   └── orders.json             # Orders storage (JSON file)
├── public/
│   └── assets/                 # Static assets (images)
└── middleware.js               # Pathname middleware
```

## Customization

### Changing Primary Color

1. Extract the dominant color from your logo (e.g., using an online tool)
2. Update `tailwind.config.js`:
```javascript
primary: '#YOUR_HEX_COLOR', // Replace #C48A47
```

### Adding Products

Edit `/lib/products.js` to add or modify products. Each product should have:
- `id` - Unique identifier
- `name_ar` - Arabic name
- `name_en` - English name (for fallback)
- `price` - Price in local currency
- `currency` - Currency code (e.g., 'EGP')
- `image` - Image path from `/public/assets/`
- `category` - Category in Arabic
- `description_ar` - Arabic description
- `description_en` - English description
- `ingredients` - Array of ingredients in Arabic

### Updating Contact Information

Edit the contact page (`app/contact/page.jsx`) and footer (`app/(components)/Footer.jsx`) to update:
- Address
- Phone number (also update in `.env.local`)
- Email
- Business hours

### WhatsApp Integration

The WhatsApp link is automatically generated from `NEXT_PUBLIC_CONTACT_PHONE` in your `.env.local` file. Make sure the format is correct:
```
NEXT_PUBLIC_CONTACT_PHONE=+201234567890
```

## Deployment to Vercel

1. Push your code to GitHub/GitLab/Bitbucket

2. Import your project to [Vercel](https://vercel.com)

3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_GA_ID` (optional)
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
   - `NEXT_PUBLIC_CONTACT_PHONE`

4. Deploy!

The project will automatically build and deploy. Make sure all assets are committed to your repository.

## Admin Access

- URL: `/admin`
- Default password: `admin123` (set in `.env.local` as `NEXT_PUBLIC_ADMIN_PASSWORD`)
- **Note**: This is for demo purposes only. Use proper authentication for production.

## API Endpoints

- `GET /api/products` - Returns all products
- `GET /api/orders` - Returns all orders (admin use)
- `POST /api/orders` - Create new order
- `POST /api/contact` - Submit contact form

## Order Storage

Orders are stored in `/data/orders.json`. In production, replace this with a proper database:
- MongoDB
- PostgreSQL
- Firebase
- Supabase

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Images optimized with Next.js Image component
- Lazy loading for product images
- Code splitting with Next.js App Router
- RTL-optimized CSS

## Security Notes

- Admin password is stored in environment variable (demo only)
- In production, implement proper authentication
- Validate all form inputs
- Use HTTPS for production
- Implement CSRF protection for API routes

## License

This project is created for SweetCrust Bakery.

## Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for SweetCrust Bakery**
