import { BookOpen, Info, Scale } from "lucide-react";
import React, { useState } from "react";
import FaultReferenceDisplay from "../components/FaultReferenceDisplay";
import ScenarioSelector from "../components/ScenarioSelector";
import { useCountry } from "../contexts/CountryContext";
import type { ScenarioKey } from "../data/scenarioReferences";

export default function FaultReferencePage() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey | null>(
    null,
  );
  const { country } = useCountry();
  const isMalta = country === "mt";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-fault-header text-fault-header-fg rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-white/10">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Fault Reference Tool
            </h1>
            <p className="mt-1 text-fault-header-fg text-sm leading-relaxed max-w-2xl">
              {isMalta
                ? "Select an accident scenario to view the applicable Malta Road Code rules, Traffic Regulation Ordinance (Cap. 65) provisions, Civil Code Cap. 16, Maltese case law, and fault percentage breakdown for each party."
                : "Select an accident scenario to view the applicable Highway Code rules, Road Traffic Act 1988 sections, landmark case law, and insurer-style fault percentage breakdown for each party."}
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/60 border border-border text-sm text-muted-foreground">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        <p>
          {isMalta
            ? "This tool provides general legal reference information based on Maltese law (Civil Code Cap. 16, TRO Cap. 65, Malta Road Code) and is intended for educational purposes only. It does not constitute legal advice. Fault percentages are indicative assessments and may vary based on specific circumstances. Always consult a qualified Maltese advocate (avukat) for advice on your specific situation."
            : "This tool provides general legal reference information based on UK law and is intended for educational purposes only. It does not constitute legal advice. Fault percentages are indicative insurer assessments and may vary based on specific circumstances. Always consult a qualified solicitor for advice on your specific situation."}
        </p>
      </div>

      {/* Scenario Selector */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Select Accident Scenario</h2>
        </div>
        <ScenarioSelector
          selected={selectedScenario}
          onChange={setSelectedScenario}
        />
      </section>

      {/* Reference Display */}
      {selectedScenario ? (
        <section>
          <FaultReferenceDisplay scenarioKey={selectedScenario} />
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
          <Scale className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">No scenario selected</p>
          <p className="text-sm mt-1 max-w-sm">
            Choose one of the accident scenarios above to view the relevant
            legal references and fault breakdown.
          </p>
        </div>
      )}
    </div>
  );
}
