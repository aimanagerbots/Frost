import { HeroSection, ScrollReveal, ComplianceWarning } from "@/components";

export default function CompliancePage() {
  return (
    <main>
      <HeroSection
        height="half"
        title="Compliance & Regulatory Information"
      />

      <div className="section-pad max-w-3xl mx-auto px-6">
        <ComplianceWarning variant="product" />

        <div className="mt-12">
          <ScrollReveal>
            <section className="mb-12">
              <h2 className="font-display text-2xl text-text-default mb-4">
                Washington State Cannabis Regulations
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                Cannabis was legalized for adult recreational use in Washington
                State through the passage of Initiative 502 (I-502) in November
                2012. The Washington State Liquor and Cannabis Board (WSLCB)
                serves as the primary regulatory authority overseeing all aspects
                of the cannabis industry, including licensing, enforcement,
                testing requirements, and advertising standards.
              </p>
              <p className="text-text-muted leading-relaxed mb-4">
                Frost Cannabis operates in full compliance with all WSLCB
                regulations, Washington Administrative Code (WAC 314-55), and
                Revised Code of Washington (RCW 69.50). These regulations govern
                every aspect of our operations from cultivation and manufacturing
                through packaging, distribution, and retail sale.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="mb-12">
              <h2 className="font-display text-2xl text-text-default mb-4">
                Licensing
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                Frost Cannabis LLC holds valid licenses issued by the Washington
                State Liquor and Cannabis Board for all operations. All Frost
                products are cultivated, processed, and manufactured exclusively
                in WSLCB-licensed facilities within the State of Washington. Our
                licensing information is a matter of public record and can be
                verified through the WSLCB licensing database.
              </p>
              <p className="text-text-muted leading-relaxed mb-4">
                We maintain strict compliance with all licensing conditions,
                including mandatory seed-to-sale traceability through the state
                traceability system, facility security requirements, employee
                background check requirements, and all applicable operational
                standards.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="mb-12">
              <h2 className="font-display text-2xl text-text-default mb-4">
                Age Requirements
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                Washington State law requires that all consumers of cannabis
                products be at least twenty-one (21) years of age. A valid,
                unexpired government-issued photo identification is required for
                every purchase at a licensed retail location. Acceptable forms of
                identification include a valid state driver&apos;s license, state
                identification card, United States passport, or military
                identification card. No exceptions are made to this requirement.
              </p>
              <p className="text-text-muted leading-relaxed mb-4">
                This website implements age verification measures upon initial
                access. It is a violation of Washington State law (RCW 69.50.401)
                to furnish cannabis products to any person under 21 years of age.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="mb-12">
              <h2 className="font-display text-2xl text-text-default mb-4">
                Product Testing
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                All Frost Cannabis products undergo mandatory testing by
                independent, WSLCB-certified testing laboratories before being
                released for sale. Testing includes analysis for cannabinoid
                potency (THC, CBD, and other cannabinoids), residual pesticides,
                heavy metals, microbial contaminants, residual solvents (for
                extracted products), moisture content, and foreign matter.
              </p>
              <p className="text-text-muted leading-relaxed mb-4">
                Certificates of Analysis (COAs) documenting test results for each
                product batch are available upon request at our retail partner
                locations. We are committed to transparency and encourage
                consumers to review COA documentation before purchase.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="mb-12">
              <h2 className="font-display text-2xl text-text-default mb-4">
                No Medical Claims
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                Frost Cannabis products are produced and sold exclusively for
                adult recreational use. Our products are not intended to
                diagnose, treat, cure, or prevent any disease or medical
                condition. Statements on this website regarding strain
                characteristics, terpene profiles, and potential effects are
                informational only and have not been evaluated by the Food and
                Drug Administration (FDA).
              </p>
              <p className="text-text-muted leading-relaxed mb-4">
                If you are considering cannabis for medical purposes, please
                consult with a licensed healthcare provider. Washington State
                maintains a separate medical cannabis program administered
                through the Department of Health.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="mb-12">
              <h2 className="font-display text-2xl text-text-default mb-4">
                Advertising Compliance
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                Frost Cannabis adheres to all Washington State advertising
                regulations for cannabis products as outlined in WAC 314-55-155.
                Our advertising and marketing materials are not designed to appeal
                to minors, do not make unsubstantiated health or medical claims,
                include all required warnings and disclaimers, are not placed in
                media where more than 30% of the audience is reasonably expected
                to be under 21 years of age, and comply with all WSLCB content
                and placement restrictions.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="mb-12">
              <h2 className="font-display text-2xl text-text-default mb-4">
                Consumer Rights
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                If you have concerns about any Frost Cannabis product or believe
                that any aspect of our operations does not comply with Washington
                State regulations, we encourage you to contact us directly at{" "}
                <a
                  href="mailto:hello@frostcannabis.com"
                  className="text-accent-primary hover:underline"
                >
                  hello@frostcannabis.com
                </a>
                . You may also report concerns directly to the Washington State
                Liquor and Cannabis Board.
              </p>
              <p className="text-text-muted leading-relaxed mb-4">
                For more information about Washington State cannabis regulations,
                consumer rights, and licensing, visit the{" "}
                <a
                  href="https://lcb.wa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                >
                  Washington State Liquor and Cannabis Board
                </a>
                .
              </p>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
