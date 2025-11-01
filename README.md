# Jabour Jewellery Website

E-commerce website for Jabour Jewellery built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- E-commerce functionality with shopping cart
- Product management via Supabase CMS
- Blog management via Supabase CMS
- User authentication and accounts
- Admin dashboard for sales tracking
- Image upload to Supabase Storage
- Responsive design
- SEO optimized

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database & CMS:** Supabase
- **Storage:** Supabase Storage
- **Icons:** React Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone git@github.com:Guidantas28/jabour-website.git
cd jabour-website
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up Supabase:

- Create a new Supabase project
- Run the SQL scripts in the `supabase-schema.sql` file in the Supabase SQL Editor
- Run the SQL script in `supabase-storage-setup.sql` to set up storage

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/              # Admin panel
│   ├── blog/              # Blog pages
│   ├── my-account/         # User account pages
│   └── ...
├── components/             # React components
├── lib/                    # Utilities (Supabase client, cart, auth)
├── public/                 # Static assets
└── supabase-schema.sql     # Database schema
```

## Admin Access

1. Create an admin user in Supabase Dashboard > Authentication > Users
2. Access `/admin/login` to login
3. After login, you'll have access to:
   - Dashboard (`/admin/dashboard`) - Sales and orders
   - Products (`/admin/products`) - Manage products
   - Blog (`/admin/blog`) - Manage blog posts

## Supabase Setup

### 1. Database Tables

Run `supabase-schema.sql` in the Supabase SQL Editor to create:

- `products` table
- `blog_posts` table
- `orders` table

### 2. Storage Bucket

Run `supabase-storage-setup.sql` to create the `images` bucket for file uploads.

### 3. RLS Policies

The schema includes Row Level Security policies that:

- Allow public read access to products and published blog posts
- Require authentication for admin operations (INSERT/UPDATE/DELETE)
- Allow users to view their own orders
- Allow admins to view all orders

## Build for Production

```bash
npm run build
npm start
```

## Deployment

This project can be deployed on:

- Vercel (recommended for Next.js)
- CloudPanel
- Any Node.js hosting platform

Make sure to set the environment variables in your hosting platform.

## License

Private - Jabour Jewellery
