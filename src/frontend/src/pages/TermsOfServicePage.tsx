import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Ban,
  BookOpen,
  FileText,
  Gavel,
  Globe,
  Mail,
  Scale,
  Shield,
  UserCheck,
} from "lucide-react";
import { Clock } from "lucide-react";
import type React from "react";
import { useCountry } from "../contexts/CountryContext";

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

export default function TermsOfServicePage() {
  const { country } = useCountry();
  const isMalta = country === "mt";
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            Terms of Service
          </h1>
          <Badge variant="outline" className="text-xs shrink-0">
            {isMalta ? "Malta" : "England & Wales"}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Please read these terms carefully before using iamthe.law.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Last updated: {LAST_UPDATED}</span>
        </div>
      </div>

      {/* Legal disclaimer callout */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 px-4 py-3 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <strong>Important Notice:</strong> iamthe.law and all outputs it
          generates do <strong>not</strong> constitute legal advice. All content
          is provided for informational and insurance documentation purposes
          only. You should seek independent legal advice from a qualified
          {isMalta ? "avukat (advocate)" : "solicitor"} before taking any legal
          action.
        </p>
      </div>

      <Separator />

      {/* 1. Acceptance of Terms */}
      <Section id="acceptance" icon={UserCheck} title="Acceptance of Terms">
        <p>
          By accessing or using the iamthe.law web application (&ldquo;the
          Service&rdquo;), you agree to be bound by these Terms of Service
          (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you must
          not use the Service.
        </p>
        <p>
          These Terms apply to all visitors, users, and others who access or use
          the Service. By using the Service, you represent that you are at least
          18 years of age or have parental or guardian consent.
        </p>
        <p>
          We reserve the right to update these Terms at any time. Continued use
          of the Service after any changes constitutes your acceptance of the
          revised Terms.
        </p>
      </Section>

      {/* 2. Service Description */}
      <Section id="service" icon={FileText} title="Service Description">
        <p>
          iamthe.law is an AI-powered web application designed to assist users
          in documenting road traffic accidents, gathering evidence, and
          preparing insurer-ready reports for use in insurance claims and legal
          proceedings in {isMalta ? "Malta" : "the United Kingdom"}.
        </p>
        <p>The Service provides the following functionality:</p>
        <ul className="space-y-2 mt-2">
          <Bullet>
            Multi-party accident documentation with photo, video, and dash cam
            evidence upload.
          </Bullet>
          <Bullet>
            AI-assisted analysis including crash type correlation, fault
            likelihood assessment, and damage severity scoring.
          </Bullet>
          <Bullet>
            Generation of formal accident narratives, demand letters,
            negotiation letters, and legal reference documents.
          </Bullet>
          <Bullet>
            Fleet management tools for small business vehicle operators.
          </Bullet>
          <Bullet>
            Integration of{" "}
            {isMalta
              ? "Malta Road Code, TRO Cap. 65, Civil Code Cap. 16, and curated Maltese case law"
              : "UK legal references including Highway Code citations, Road Traffic Act 1988, and landmark case law"}
            .
          </Bullet>
        </ul>
        <p className="mt-2">
          All data entered into the Service is stored exclusively in your
          browser&apos;s local storage. We do not operate a central server
          database that permanently holds your personal information.
        </p>
      </Section>

      {/* 3. AI-Generated Content Disclaimer */}
      <Section
        id="ai-disclaimer"
        icon={Scale}
        title="AI-Generated Content Disclaimer"
      >
        <p>
          <strong>
            The AI analysis and outputs produced by iamthe.law do not constitute
            legal advice and must not be relied upon as such.
          </strong>
        </p>
        <ul className="space-y-2 mt-2">
          <Bullet>
            Fault assessments, damage severity scores, and accident narratives
            are indicative only and are generated by automated systems using
            rule-based logic and AI models.
          </Bullet>
          <Bullet>
            All AI-generated outputs are subject to error, misinterpretation, or
            inaccuracy. You are solely responsible for verifying the accuracy of
            any output before submitting it to insurers, solicitors, or courts.
          </Bullet>
          <Bullet>
            Demand letters, negotiation letters, and legal document templates
            are drafts only. You should have them reviewed by a qualified
            solicitor before use in legal proceedings.
          </Bullet>
          <Bullet>
            Legal references (Highway Code, statutes, case law) are provided for
            informational purposes and may not reflect the most current
            legislative position. Always verify against official sources.
          </Bullet>
          <Bullet>
            iamthe.law accepts no liability for decisions made in reliance on
            AI-generated content. Any claim arising from use of the Service is
            subject to the limitations set out in these Terms.
          </Bullet>
        </ul>
      </Section>

      {/* 4. Acceptable Use */}
      <Section id="acceptable-use" icon={Ban} title="Acceptable Use">
        <p>
          You agree to use the Service only for lawful purposes and in
          accordance with these Terms. You must not use the Service:
        </p>
        <ul className="space-y-2 mt-2">
          <Bullet>
            To create false, fraudulent, or misleading accident reports or
            insurance claims.
          </Bullet>
          <Bullet>
            To upload content that infringes any intellectual property rights or
            contains unlawful, defamatory, or harmful material.
          </Bullet>
          <Bullet>
            To attempt to reverse-engineer, decompile, or extract source code
            from the Service.
          </Bullet>
          <Bullet>
            In any way that violates applicable local, national, or
            international law or regulation, including the{" "}
            {isMalta
              ? "TRO Cap. 65 and the Maltese Criminal Code (Cap. 9)"
              : "Road Traffic Act 1988 and the Fraud Act 2006"}
            .
          </Bullet>
          <Bullet>
            To transmit any unsolicited advertising, spam, or commercial
            messages through the Service.
          </Bullet>
        </ul>
        <p className="mt-2">
          We reserve the right to suspend or terminate access to the Service
          immediately and without notice if we reasonably believe you are
          breaching these Terms.
        </p>
      </Section>

      {/* 5. Limitation of Liability */}
      <Section id="liability" icon={Shield} title="Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, iamthe.law and its
          operators shall not be liable for any indirect, incidental, special,
          consequential, or exemplary damages, including but not limited to:
        </p>
        <ul className="space-y-2 mt-2">
          <Bullet>
            Loss of profits, revenue, or data arising from use of the Service.
          </Bullet>
          <Bullet>
            Decisions made in reliance on AI-generated fault assessments, legal
            documents, or any other outputs of the Service.
          </Bullet>
          <Bullet>
            Failure of any insurance claim, legal action, or negotiation
            conducted using materials produced by the Service.
          </Bullet>
          <Bullet>
            Loss or corruption of data stored in browser local storage due to
            browser updates, clearing of storage, or device failure.
          </Bullet>
          <Bullet>
            Interruption or unavailability of the Service for any reason.
          </Bullet>
        </ul>
        <p className="mt-2">
          Our total liability to you in connection with the Service shall not
          exceed {isMalta ? "€100" : "£100"}. Nothing in these Terms excludes or
          limits our liability for fraud, death, or personal injury caused by
          our negligence, or any other liability that cannot be excluded under
          English law.
        </p>
      </Section>

      {/* 6. Data Protection & Privacy */}
      <Section
        id="data-protection"
        icon={BookOpen}
        title="Data Protection &amp; Privacy"
      >
        <p>
          Your use of the Service is also governed by our{" "}
          <a
            href="/privacy"
            className="underline text-primary hover:text-primary/80 transition-colors"
          >
            Privacy Policy
          </a>
          , which is incorporated into these Terms by reference.
        </p>
        <p>
          All personal data you enter into the Service — including vehicle
          details, contact information, injury photographs, and witness
          statements — is stored exclusively in your browser&apos;s local
          storage under your sole control.
        </p>
        <p>
          We process personal data in accordance with the{" "}
          {isMalta
            ? "EU General Data Protection Regulation (EU GDPR, Regulation 2016/679) as implemented by the Data Protection Act (Cap. 586, Laws of Malta)"
            : "UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018"}
          . You are responsible for ensuring that any third-party data you enter
          (such as details of other drivers or witnesses) is provided with the
          appropriate authority or consent.
        </p>
      </Section>

      {/* 7. Intellectual Property */}
      <Section
        id="intellectual-property"
        icon={Gavel}
        title="Intellectual Property"
      >
        <p>
          The Service, including its design, source code, AI models, legal
          templates, and all associated content, is the intellectual property of
          iamthe.law and its licensors.
        </p>
        <ul className="space-y-2 mt-2">
          <Bullet>
            You are granted a limited, non-exclusive, non-transferable licence
            to use the Service for personal, non-commercial accident
            documentation purposes.
          </Bullet>
          <Bullet>
            You retain ownership of the data you enter and the reports you
            generate. By using the Service, you grant us no rights in that data
            beyond what is necessary to operate the Service.
          </Bullet>
          <Bullet>
            You must not reproduce, distribute, modify, or create derivative
            works from any part of the Service without our prior written
            consent.
          </Bullet>
          <Bullet>
            &ldquo;iamthe.law&rdquo; and associated branding are trade marks of
            iamthe.law. Unauthorised use is prohibited.
          </Bullet>
        </ul>
      </Section>

      {/* 8. Termination */}
      <Section id="termination" icon={AlertTriangle} title="Termination">
        <p>
          We may terminate or suspend your access to the Service immediately,
          without prior notice or liability, for any reason, including if you
          breach these Terms.
        </p>
        <p>
          Upon termination, your right to use the Service will cease
          immediately. Because data is stored in your browser, you retain
          control of any locally stored reports and may continue to access them
          through your browser. We recommend exporting all reports before
          ceasing use.
        </p>
        <p>
          Provisions that by their nature should survive termination shall
          survive, including limitation of liability, intellectual property
          provisions, and governing law.
        </p>
      </Section>

      {/* 9. Governing Law & Jurisdiction */}
      <Section
        id="governing-law"
        icon={Globe}
        title={
          isMalta
            ? "Governing Law & Jurisdiction (Malta)"
            : "Governing Law & Jurisdiction (England & Wales)"
        }
      >
        {isMalta ? (
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of <strong>Malta</strong>. The courts of Malta shall have
            exclusive jurisdiction to settle any dispute or claim arising from
            or in connection with these Terms.
          </p>
        ) : (
          <>
            <p>
              These Terms and any dispute or claim arising out of or in
              connection with them shall be governed by and construed in
              accordance with the law of <strong>England and Wales</strong>.
            </p>
            <p>
              The courts of England and Wales shall have exclusive jurisdiction
              to settle any dispute or claim arising out of or in connection
              with these Terms or their subject matter or formation.
            </p>
          </>
        )}
        <p>
          If any provision of these Terms is held to be invalid or
          unenforceable, the remaining provisions shall continue in full force
          and effect.
        </p>
      </Section>

      {/* 10. Contact Us */}
      <Section id="contact" icon={Mail} title="Contact Us">
        <p>
          If you have any questions, concerns, or requests relating to these
          Terms of Service, please contact us:
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
              href="mailto:legal@iamthe.law"
              className="underline text-primary hover:text-primary/80 transition-colors"
            >
              legal@iamthe.law
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
          We aim to respond to all queries relating to these Terms within{" "}
          <strong>30 days</strong>.
        </p>
      </Section>

      {/* Footer spacer */}
      <div className="h-4" />
    </div>
  );
}
