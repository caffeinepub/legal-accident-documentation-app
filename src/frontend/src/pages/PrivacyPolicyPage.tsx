import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Clock,
  Cookie,
  Database,
  Mail,
  RefreshCw,
  Shield,
  UserCheck,
} from "lucide-react";
import type React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LAST_UPDATED = "16 March 2026";

function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card id={id} className="scroll-mt-20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-base">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-foreground leading-relaxed space-y-3">
        {children}
      </CardContent>
    </Card>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            {t("page.privacy.heading")}
          </h1>
          <Badge variant="outline" className="text-xs shrink-0">
            GDPR Compliant
          </Badge>
        </div>
        <p className="text-muted-foreground">{t("page.privacy.subheading")}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Last updated: {LAST_UPDATED}</span>
        </div>
      </div>

      {/* Legal disclaimer callout */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 px-4 py-3 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <Shield className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <strong>Important Notice:</strong> {t("disclaimer.text")}
        </p>
      </div>

      <Separator />

      {/* 1. Introduction */}
      <Section id="intro" icon={BookOpen} title={t("privacy.intro")}>
        <p>
          iamthe.law (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is
          committed to protecting your privacy and handling your personal data
          responsibly and transparently. This Privacy Policy explains how we
          collect, process, store, and protect information you provide when
          using our AI-powered legal accident documentation service.
        </p>
        <p>
          This policy applies to all users of the iamthe.law web application and
          complies with the UK General Data Protection Regulation (UK GDPR) and
          the Data Protection Act 2018.
        </p>
        <p>
          The data controller for this application is iamthe.law. If you have
          any questions about this policy, please contact us at the details
          provided in the &ldquo;Contact Us&rdquo; section below.
        </p>
      </Section>

      {/* 2. Data We Collect */}
      <Section
        id="data-collected"
        icon={Database}
        title={t("privacy.data_collected")}
      >
        <p>
          When you use iamthe.law, you may provide the following categories of
          personal and sensitive data:
        </p>
        <ul className="space-y-2 mt-2">
          <Bullet>
            <strong>Vehicle & Incident Details:</strong> Vehicle make, model,
            colour, licence plate, year, MOT status, registration number, speed,
            road conditions, and accident location.
          </Bullet>
          <Bullet>
            <strong>Personal Contact Information:</strong> Names, phone numbers,
            email addresses, and postal addresses of drivers, witnesses, and
            third parties involved in the incident.
          </Bullet>
          <Bullet>
            <strong>Insurance Information:</strong> Insurer names, policy
            numbers, and claim reference numbers for you and other parties.
          </Bullet>
          <Bullet>
            <strong>Photographic & Video Evidence:</strong> Images of vehicle
            damage, injury photographs, dash cam footage, and other visual
            evidence uploaded to document the incident.
          </Bullet>
          <Bullet>
            <strong>Witness Statements & Signatures:</strong> Written and
            voice-recorded statements from witnesses, including their contact
            details and handwritten digital signatures.
          </Bullet>
          <Bullet>
            <strong>Police Information:</strong> Police reference numbers and
            attending officer names where applicable.
          </Bullet>
          <Bullet>
            <strong>Injury Information:</strong> Descriptions of physical
            injuries and photographs of injuries, which may constitute special
            category health data under UK GDPR.
          </Bullet>
          <Bullet>
            <strong>AI-Generated Analysis:</strong> Machine-generated
            assessments of fault likelihood, damage severity, crash type
            correlations, and legal references derived from your submitted data.
          </Bullet>
        </ul>
      </Section>

      {/* 3. How Your Data Is Used */}
      <Section id="how-used" icon={UserCheck} title={t("privacy.how_used")}>
        <p>
          We process your personal data for the following purposes, relying on
          the stated lawful bases:
        </p>
        <ul className="space-y-2 mt-2">
          <Bullet>
            <strong>
              Generating Accident Reports (Legitimate Interest / Contract):
            </strong>{" "}
            To create structured, insurer-ready documentation of your incident
            including narrative descriptions, fault assessments, and damage
            evaluations.
          </Bullet>
          <Bullet>
            <strong>AI-Powered Analysis (Legitimate Interest):</strong> To apply
            rule-based and AI-assisted analysis to your uploaded evidence,
            providing crash type correlation, injury classification, and legal
            references under the UK Highway Code and applicable statutes.
          </Bullet>
          <Bullet>
            <strong>Local Storage Only:</strong> All data entered and generated
            within the application is stored exclusively in your browser&apos;s
            local storage. We do not operate a central database that holds your
            personal information.
          </Bullet>
          <Bullet>
            <strong>No Third-Party Sharing:</strong> We do not sell, rent, or
            share your personal data with third parties for marketing or
            commercial purposes. Data is not transmitted to any external server
            without your explicit action (e.g., exporting or copying a report
            summary).
          </Bullet>
          <Bullet>
            <strong>Legal Document Generation (Consent):</strong> When you use
            features such as demand letter generation or negotiation letter
            building, your data is used solely to populate those documents for
            your own use.
          </Bullet>
        </ul>
      </Section>

      {/* 4. Data Retention */}
      <Section id="retention" icon={Clock} title={t("privacy.retention")}>
        <p>
          Because all data is stored in your browser&apos;s local storage, you
          retain full control over how long your data persists:
        </p>
        <ul className="space-y-2 mt-2">
          <Bullet>
            <strong>Browser-Based Storage:</strong> Data remains in local
            storage until you actively delete it, clear your browser data, or
            use the in-app &ldquo;Delete Report&rdquo; or &ldquo;Delete Evidence
            Files&rdquo; functions.
          </Bullet>
          <Bullet>
            <strong>UK Limitation Act 1980:</strong> Personal injury claims in
            the UK have a three-year limitation period. We recommend retaining
            your accident reports for at least this period.
          </Bullet>
          <Bullet>
            <strong>Special Category Data (Injury Photos):</strong> Photographs
            constituting health data should be deleted once no longer required
            for your legal proceedings, using the in-app &ldquo;Delete Evidence
            Files&rdquo; function.
          </Bullet>
          <Bullet>
            <strong>Exported Documents:</strong> Once you export or copy a
            report, you are responsible for managing that data in accordance
            with applicable data protection law.
          </Bullet>
        </ul>
      </Section>

      {/* 5. Your Rights */}
      <Section id="your-rights" icon={Shield} title={t("privacy.your_rights")}>
        <p>
          Under the UK GDPR and Data Protection Act 2018, you have the following
          rights with respect to your personal data:
        </p>
        <ul className="space-y-2 mt-2">
          <Bullet>
            <strong>Right of Access:</strong> You can view all data held about
            you by reviewing your stored reports within the application.
          </Bullet>
          <Bullet>
            <strong>Right to Erasure (Right to be Forgotten):</strong> You can
            permanently delete any or all of your reports using the in-app
            delete functions or by clearing your browser&apos;s local storage.
          </Bullet>
          <Bullet>
            <strong>Right to Data Portability:</strong> You can export your
            complete report data as a formatted text or PDF file using the
            &ldquo;Export Claim Report&rdquo; function.
          </Bullet>
          <Bullet>
            <strong>Right to Rectification:</strong> You can edit any data
            within your reports at any time before submitting to your insurer.
          </Bullet>
          <Bullet>
            <strong>Right to Restrict Processing:</strong> As data is stored
            locally, you can restrict all processing by simply not using the
            application and deleting stored data.
          </Bullet>
          <Bullet>
            <strong>Right to Object:</strong> You may object to any processing
            by contacting us using the details below.
          </Bullet>
          <Bullet>
            <strong>Rights Related to Automated Decision-Making:</strong> AI
            analysis outputs (fault assessments, damage scores) are indicative
            only and do not constitute binding decisions. All outputs are
            editable and subject to your review.
          </Bullet>
        </ul>
        <p className="mt-3 text-muted-foreground">
          If you believe your rights have been infringed, you have the right to
          lodge a complaint with the{" "}
          <strong>Information Commissioner&apos;s Office (ICO)</strong> at{" "}
          <a
            href="https://ico.org.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary hover:text-primary/80 transition-colors"
          >
            ico.org.uk
          </a>{" "}
          or by calling 0303 123 1113.
        </p>
      </Section>

      {/* 6. Cookies */}
      <Section id="cookies" icon={Cookie} title={t("privacy.cookies")}>
        <p>
          <strong>iamthe.law does not use cookies.</strong> We do not place any
          tracking, analytics, advertising, or session cookies on your device.
        </p>
        <p>
          The application uses browser <strong>localStorage</strong> solely to
          persist your report data and user preferences (language and theme
          settings) between sessions. This is not a cookie and is not accessible
          by third parties.
        </p>
        <p>
          We do not use any third-party analytics platforms (e.g., Google
          Analytics), advertising networks, or social media tracking pixels.
        </p>
      </Section>

      {/* 7. Contact Us */}
      <Section id="contact" icon={Mail} title={t("privacy.contact")}>
        <p>
          If you have any questions, concerns, or requests relating to this
          Privacy Policy or our data processing practices, please contact us:
        </p>
        <div className="mt-3 rounded-lg border border-border bg-muted/30 px-4 py-3 space-y-1">
          <p
            className="font-semibold"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            iamthe.law
          </p>
          <p className="text-muted-foreground">
            Email:{" "}
            <a
              href="mailto:privacy@iamthe.law"
              className="underline text-primary hover:text-primary/80 transition-colors"
            >
              privacy@iamthe.law
            </a>
          </p>
          <p className="text-muted-foreground">
            Website:{" "}
            <a
              href="https://iamthe.law"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary hover:text-primary/80 transition-colors"
            >
              iamthe.law
            </a>
          </p>
        </div>
        <p className="mt-3 text-muted-foreground">
          We aim to respond to all privacy-related requests within{" "}
          <strong>30 days</strong> in accordance with UK GDPR requirements.
        </p>
      </Section>

      {/* 8. Policy Updates */}
      <Section id="updates" icon={RefreshCw} title={t("privacy.updates")}>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in the application, applicable law, or our data practices. Material
          changes will be indicated by an updated &ldquo;Last updated&rdquo;
          date at the top of this page.
        </p>
        <p>
          We encourage you to review this policy periodically. Continued use of
          the application after any changes constitutes acceptance of the
          updated policy.
        </p>
      </Section>

      {/* Footer spacer */}
      <div className="h-4" />
    </div>
  );
}
