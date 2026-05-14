import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const user = await getCurrentUser();

  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Soccer Planner</h3>
            <p className="text-gray-400 text-sm">
              Organize your soccer matches and manage your teams efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="hover:text-white transition-colors"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <p className="text-gray-400 text-sm">
              Have questions? Reach out to us at{' '}
              <a
                href="mailto:info@soccerplanner.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                info@soccerplanner.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Soccer Planner. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400 mt-4 md:mt-0">
              <a
                href="#"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
