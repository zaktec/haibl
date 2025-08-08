export default function StudentProgress() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Progress Overview</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm">
            <span>Mathematics</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span>Physics</span>
            <span>60%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}