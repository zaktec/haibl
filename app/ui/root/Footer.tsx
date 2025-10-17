export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Haibl. All rights reserved.
        </div>
      </div>
    </footer>
  );
}