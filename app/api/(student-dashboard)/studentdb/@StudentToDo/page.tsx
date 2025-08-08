import Card from "@/app/ui/dashboard/card";

export default function StudentToDo() {
  return (
    <Card>
      <h3 className="font-semibold mb-2">Upcoming Tasks</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="rounded" />
          <span className="text-sm">Complete Math Assignment 5</span>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="rounded" />
          <span className="text-sm">Physics Lab Report</span>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="rounded" />
          <span className="text-sm">Chemistry Quiz Preparation</span>
        </div>
      </div>
    </Card>
  );
}