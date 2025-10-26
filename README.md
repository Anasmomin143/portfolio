# Portfolio Website

A modern, dynamic Next.js portfolio website with full-featured admin panel for content management.

## ✨ Features

- 🌍 **Internationalization**: Support for multiple languages (English/French)
- 📱 **Responsive Design**: Fully responsive with Tailwind CSS
- 🚀 **Modern Stack**: Built with Next.js 15, TypeScript, and App Router
- 🎨 **UI Components**: Beautiful UI with Shadcn components and custom design
- 📊 **Full Admin Panel**: Complete CRUD for Projects, Experience, Skills, and Certifications
- 🔒 **Secure Authentication**: Protected admin routes with NextAuth.js
- 📝 **Dynamic Content**: Real-time data from Supabase database
- 🔍 **SEO Optimized**: Server-side rendering and meta tags
- 📤 **JSON Import**: Bulk import projects from JSON files
- 📈 **Activity Tracking**: Audit log for all admin actions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Custom components
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Calendar**: React Big Calendar

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── [lang]/              # i18n routes (en, fr)
│   │   ├── (main)/          # Public pages
│   │   └── projects/        # Project pages
│   ├── admin/               # Admin panel
│   │   ├── projects/        # Projects CRUD
│   │   ├── experience/      # Experience CRUD
│   │   ├── skills/          # Skills CRUD
│   │   ├── certifications/  # Certifications CRUD
│   │   └── login/           # Admin login
│   └── api/                 # API routes
│       └── admin/           # Admin APIs
├── components/
│   ├── ui/                  # Shadcn components
│   ├── admin/               # Admin components
│   └── icons/               # SVG icons
├── lib/
│   ├── auth/                # NextAuth config
│   ├── supabase/            # Supabase client
│   └── constants/           # Constants & styles
├── hooks/                   # Custom React hooks
├── i18n/                    # Translation files
└── supabase/                # Database schema
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account ([sign up](https://supabase.com))

### 1. Clone & Install

```bash
git clone <repository-url>
cd portfolio
npm install
```

### 2. Supabase Setup

#### Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in details and wait ~2 minutes for creation

#### Get API Keys

1. In your project, go to **Settings** → **API**
2. Copy these keys:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Finding service_role key**:
- Settings → API → Project API keys
- Scroll down to see both `anon` and `service_role` keys
- Click "Reveal" on service_role, then copy

#### Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Copy contents of `supabase/schema.sql` from this project
3. Paste and click **Run**

This creates all tables: projects, experience, skills, certifications, admin_users, audit_log

### 3. Environment Setup

Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Create Admin User

```bash
npm run seed:admin
```

This creates an admin user with your credentials.

### 5. Start Development

```bash
npm run dev
```

Visit:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Login**: http://localhost:3000/admin/login

---

## 🎯 Admin Panel Features

### Dashboard
- Overview statistics (projects, experience, skills, certifications count)
- Recent activity log with action tracking
- Quick navigation cards

### Projects Management
- Create, read, update, delete projects
- Bulk import from JSON
- Fields: name, company, description, dates, technologies, highlights, URLs
- Display order management

### Experience Management
- Manage work experience entries
- Fields: company, position, location, dates, description, responsibilities, technologies, achievements
- Current position toggle

### Skills Management
- Organize by categories
- Proficiency levels (1-5)
- Years of experience
- Display order

### Certifications Management
- Add certifications with issuer details
- Expiry date tracking
- Credential ID and URL
- Active/expired status

---

## 📤 Importing Data

### JSON Import (Projects)

1. Go to `/admin/projects/import`
2. Upload JSON file or paste JSON

**Supported formats**:
```json
{
  "projects": [
    {
      "id": "unique-id",
      "name": "Project Name",
      "company": "Company Name",
      "description": "Description",
      "start_date": "2024-01-01",
      "end_date": null,
      "current": true,
      "technologies": ["React", "Node.js"],
      "highlights": ["Achievement 1", "Achievement 2"],
      "demo_url": "https://demo.com",
      "github_url": "https://github.com/user/repo",
      "display_order": 0
    }
  ]
}
```

Both `camelCase` and `snake_case` field names are supported.

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run dev:clean        # Clean .next and start
npm run dev:turbo        # Turbo mode (faster rebuilds)

# Build & Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run seed:admin       # Create admin user

# Utilities
npm run clean            # Clean build artifacts
```

### Common Issues & Solutions

#### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

#### Changes Not Reflecting
```bash
npm run dev:clean
```

#### Full Clean
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

#### Database Connection Errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check Supabase project is active (not paused)
- Ensure database migration was run

#### Authentication Issues
- Run `npm run seed:admin` again
- Verify credentials in `.env.local`
- Check `NEXTAUTH_SECRET` is set
- Ensure `NEXTAUTH_URL` matches your domain

---

## 🌐 API Routes

### Public APIs
- `GET /api/projects` - Get all projects

### Admin APIs (Protected)

**Projects**
- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects` - Create project
- `GET /api/admin/projects/[id]` - Get single project
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project
- `POST /api/admin/projects/import` - Import from JSON

**Experience**
- `GET /api/admin/experience` - List all experience
- `POST /api/admin/experience` - Create experience
- `GET /api/admin/experience/[id]` - Get single experience
- `PUT /api/admin/experience/[id]` - Update experience
- `DELETE /api/admin/experience/[id]` - Delete experience

**Skills**
- `GET /api/admin/skills` - List all skills
- `POST /api/admin/skills` - Create skill
- `GET /api/admin/skills/[id]` - Get single skill
- `PUT /api/admin/skills/[id]` - Update skill
- `DELETE /api/admin/skills/[id]` - Delete skill

**Certifications**
- `GET /api/admin/certifications` - List all certifications
- `POST /api/admin/certifications` - Create certification
- `GET /api/admin/certifications/[id]` - Get single certification
- `PUT /api/admin/certifications/[id]` - Update certification
- `DELETE /api/admin/certifications/[id]` - Delete certification

**Dashboard**
- `GET /api/admin/dashboard-stats` - Get statistics and recent activity

---

## 🔒 Security

### Best Practices

✅ **Environment Variables**
- Never commit `.env.local` to git
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret

✅ **Database Security**
- Row Level Security (RLS) enabled via migration
- Admin-only access to CRUD operations
- Audit logging for all changes

✅ **Authentication**
- Protected admin routes with middleware
- Session-based authentication
- Secure password hashing

### Production Checklist

Before deploying:
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Use HTTPS in production
- [ ] Remove or change default admin credentials
- [ ] Enable Supabase connection pooling if needed
- [ ] Set up database backups in Supabase
- [ ] Review and restrict Supabase API access
- [ ] Enable TypeScript strict mode (remove `ignoreBuildErrors`)

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

Works with:
- Netlify
- Railway
- Self-hosted

**Important**: Add all environment variables from `.env.local` to your hosting platform.

---

## 🎨 Customization

### Adding New Languages

1. Add locale to `lib/i18n.ts`
2. Create translation file in `i18n/`
3. Update middleware configuration

### Customizing Theme

Edit theme variables in `lib/constants/styles.ts`:
- Colors
- Gradients
- Common styles

### Adding New Admin Sections

1. Create API routes in `app/api/admin/[section]/`
2. Create pages in `app/admin/[section]/`
3. Add to sidebar in `components/admin/admin-sidebar.tsx`
4. Update page header config in `components/admin/page-header-config.ts`

---

## 📊 Database Schema

Tables created by migration:
- `admin_users` - Admin authentication
- `projects` - Portfolio projects
- `experience` - Work experience
- `skills` - Technical skills
- `certifications` - Professional certifications
- `audit_log` - Activity tracking

See `supabase/schema.sql` for complete schema.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🆘 Support

Having issues? Check these resources:

1. **Database Issues**: Verify Supabase credentials and migration
2. **Auth Issues**: Run `npm run seed:admin` and check `.env.local`
3. **Build Errors**: Try `npm run dev:clean`
4. **Port Issues**: Kill port 3000 and restart

For more help, create an issue in the repository.

---

## 🎉 Ready to Go!

You should now have:
- ✅ Running development server
- ✅ Admin panel access
- ✅ Database connected
- ✅ Authentication working

Start building your portfolio! 🚀
