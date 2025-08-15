export default function Footermth() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center text-center md:text-left">
          <div>
            <a href="https://mathstutorhelp.com" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold mb-4 hover:text-blue-200 transition-colors inline-block">MathsTutorHelp</a>
            <p className="text-gray-300 text-sm">MTH provides affordable, easy-to-access, and effective maths support for students, with personalised courses designed to match each learner’s needs.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <a href="https://mathstutorhelp.com/contact/" className="text-gray-300 text-sm hover:text-blue-200 transition-colors block mb-2" target="_blank" rel="noopener noreferrer">Contact Us</a>
            <p className="text-gray-300 text-sm">Phone: 07860248525</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Classes</h3>
            <div className="space-y-2">
              <a href="https://mathstutorhelp.com/gcse-revision-class-foundation-manchester/" className="text-gray-300 text-sm hover:text-blue-200 transition-colors block" target="_blank" rel="noopener noreferrer">GCSE Foundation</a>
              <a href="https://mathstutorhelp.com/gcse-revision-class-higher-manchester/" className="text-gray-300 text-sm hover:text-blue-200 transition-colors block" target="_blank" rel="noopener noreferrer">GCSE Higher</a>
              <a href="https://mathstutorhelp.com/mathstutoringclub-manchester/" className="text-gray-300 text-sm hover:text-blue-200 transition-colors block" target="_blank" rel="noopener noreferrer">KS3 Support</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MathsTutorHelp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}