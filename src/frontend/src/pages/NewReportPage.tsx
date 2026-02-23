import AccidentReportForm from '../components/AccidentReportForm';

export default function NewReportPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Create Accident Report</h2>
        <p className="text-muted-foreground">
          Document accident details with velocity calculations and AI-powered fault analysis
        </p>
      </div>
      <AccidentReportForm />
    </div>
  );
}
