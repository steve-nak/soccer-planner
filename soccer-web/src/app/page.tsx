import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Welcome to <span className="text-blue-600">Soccer Planner</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600">
              Organize your soccer matches and manage your teams effortlessly
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create Groups
              </h3>
              <p className="text-gray-600">
                Form soccer groups and invite your friends to join
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Schedule Matches
              </h3>
              <p className="text-gray-600">
                Create and manage matches within your groups with ease
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Join & Track
              </h3>
              <p className="text-gray-600">
                Join matches you&apos;re interested in and track your participation
              </p>
            </div>
          </div>

          {!user && (
            <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-center text-lg"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-8 rounded-lg border-2 border-blue-600 transition-colors text-center text-lg"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-16 space-y-4 text-gray-600">
            <p className="text-sm md:text-base">
              Join thousands of soccer enthusiasts already using Soccer Planner
            </p>
            <p className="text-xs md:text-sm">
              Free to use • No credit card required • Start organizing today
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Soccer Planner?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ✓ Easy to Use
              </h3>
              <p className="text-gray-600">
                Intuitive interface that makes organizing soccer matches simple and straightforward
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ✓ Flexible Management
              </h3>
              <p className="text-gray-600">
                Create multiple groups, set match details, and manage participants effortlessly
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ✓ Real-time Updates
              </h3>
              <p className="text-gray-600">
                Stay informed with instant notifications about matches and group activities
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ✓ Community Focused
              </h3>
              <p className="text-gray-600">
                Connect with other soccer enthusiasts and build your local soccer community
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
