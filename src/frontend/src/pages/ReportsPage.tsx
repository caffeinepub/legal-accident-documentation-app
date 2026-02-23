import ReportList from '../components/ReportList';

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Accident Reports</h2>
        <p className="text-muted-foreground">View and manage all saved accident reports</p>
      </div>
      <ReportList />
    </div>
  );
}
