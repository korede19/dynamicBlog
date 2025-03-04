# Dynamic Blog with Next.js and Firebase

A modern, dynamic blog application built with **Next.js** and **Firebase**. This project includes a user-friendly admin panel for managing blog posts, authentication for secure access, and a responsive design for seamless browsing.

---

## Features

- **User Authentication**:
  - Secure login for admin users using Firebase Authentication.
  - Protected admin routes to ensure only authenticated users can access them.

- **Admin Panel**:
  - Create, edit, and delete blog posts.
  - Upload featured images for blog posts using Cloudinary.

- **Dynamic Blog Pages**:
  - Blog posts are dynamically generated using Next.js dynamic routes.
  - Responsive design for optimal viewing on all devices.

- **Middleware Protection**:
  - Custom middleware to protect admin routes and redirect unauthorized users.

- **Firebase Integration**:
  - Firebase Authentication for user login.
  - Firebase Firestore for storing blog posts (optional).

- **Cloudinary Integration**:
  - Upload and manage images for blog posts.

---

## Technologies Used

- **Frontend**:
  - Next.js (App Router)
  - React
  - Tailwind CSS (or your preferred CSS framework)

- **Backend**:
  - Firebase Authentication
  - Firebase Firestore (optional)
  - Cloudinary (for image uploads)

- **Other Tools**:
  - TypeScript
  - ESLint and Prettier (for code formatting)

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- Firebase project with Authentication enabled
- Cloudinary account (for image uploads)
- Git (optional)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/dynamic-blog.git
   cd dynamic-blog

2. **Install Dependencies**:
npm install

3. **Set Up Environment Variables:**
- NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
- NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
- NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset


**Project Structure**
my-blog/
├── app/
│   ├── admin/                  # Admin section
│   │   ├── login/              # Admin login page
│   │   ├── post/               # Admin post management page
│   │   └── _middleware.ts      # Middleware to protect admin routes
│   ├── blog/                   # Blog posts
│   │   └── [slug]/             # Dynamic blog post pages
│   ├── api/                    # API routes (optional)
│   ├── layout.tsx              # Global layout
│   └── page.tsx                # Home page
├── components/                 # Reusable components
├── lib/                        # Utility functions and Firebase config
├── styles/                     # Global styles
└── public/                     # Static assets

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## Contact

For questions or feedback, feel free to reach out:

- **Email**: oyeyemikorede5@gmail.com
- **GitHub**: [Korede19](https://github.com/korede19)