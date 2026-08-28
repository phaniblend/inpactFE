import { useEffect } from "react";
import { Link } from "react-router-dom";
import InpactLogo from "./components/InpactLogo.jsx";
import AspirantJourneyFlow from "./AspirantJourneyFlow.jsx";
import "./JsExperienceHome.css";

/**
 * Advert / “try us” landing for aspirants.
 * Flow: #/join or #/try → this page → #/apply (interests) → matched product tasks.
 */
export default function JsExperienceHome() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("jxh-fonts")) return;
    const link = document.createElement("link");
    link.id = "jxh-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="jxh">
      <div className="jxh-atmosphere" aria-hidden />

      <header className="jxh-top">
        <InpactLogo height={56} />
        <Link className="jxh-top-link" to="/apply">
          Apply
        </Link>
      </header>

      <main>
        <section className="jxh-hero">
          <p className="jxh-kicker">For aspirants — students &amp; early-career builders</p>
          <h1 className="jxh-brand">INPACT</h1>
          <p className="jxh-headline">
            Not another coding tutorial.
            <br />
            Join the industry — and become hireable by shipping.
          </p>
          <p className="jxh-lede">
            Schools, colleges, and universities teach concepts. We induct you into a product team
            building enterprise applications that will go live soon for thousands of customers. You
            learn by doing the work — and leave with proof you can contribute.
          </p>
          <div className="jxh-cta-row">
            <Link className="jxh-cta-primary" to="/apply">
              Apply — tell us your interests
            </Link>
            <a className="jxh-cta-quiet" href="#how">
              How it works
            </a>
          </div>
        </section>

        <section className="jxh-section jxh-section-how" id="how">
          <h2 className="jxh-h2">How it works</h2>
          <p className="jxh-p">
            You apply once, telling us frontend or backend. From there, every step below is real
            work on a real product — not a simulation.
          </p>

          <AspirantJourneyFlow />

          <ol className="jxh-journey">
            <li>
              <strong>Apply</strong>
              <p>
                Tell us your trade preference — frontend or backend, the only two tracks for now —
                and a bit about where you are today.
              </p>
            </li>
            <li>
              <strong>Get matched to an open task</strong>
              <p>
                We place you on an unassigned task that fits the trade you opted into on your
                application — a real ticket on a real product, not a made-up exercise.
              </p>
            </li>
            <li>
              <strong>Open your task</strong>
              <p>
                Read the brief in the Workbench: what it asks for, why it matters to the product,
                and what "done" looks like.
              </p>
            </li>
            <li>
              <strong>Build it — Assist Me or solo</strong>
              <p>
                Work it yourself, or lean on Assist Me the moment a skill gap shows up mid-ticket.
                Either way, the code you ship is yours.
              </p>
            </li>
            <li>
              <strong>Commit your work</strong>
              <p>Push your changes and open a pull request against the team's repo.</p>
            </li>
            <li>
              <strong>Review — merged, or feedback and another pass</strong>
              <p>
                A reviewer merges it, or sends it back with concrete feedback. You fix it and
                recommit until it's merged.
              </p>
            </li>
          </ol>
          <p className="jxh-p">
            Meanwhile: the moment you're matched, you're on that product's team — daily huddles,
            status updates, reviewers and teammates who know your name. Sprint rituals included,
            not a solo grind.
          </p>
        </section>

        <section className="jxh-section">
          <h2 className="jxh-h2">The gap nobody names out loud</h2>
          <p className="jxh-p">
            You can pass exams and still freeze on a ticket with incomplete requirements, a messy
            codebase, and a reviewer who expects a clean pull request. That is not a character flaw —
            it is missing reps. Tutorials end when the green checkmark appears. Careers begin when a
            team trusts you with work customers will use.
          </p>
        </section>

        <section className="jxh-section">
          <h2 className="jxh-h2">What we are (and are not)</h2>
          <p className="jxh-p">
            We are <strong>experience builders</strong> — and we are the industry floor you stand on.
            You work with a team of developers on enterprise applications heading to launch, used by
            thousands of customers. Your tickets ship into that product. Full stop.
          </p>
          <p className="jxh-p">
            We are not a binge-watch course. There is no certificate that replaces a merge. Your
            portfolio grows from work scoped with a team, assisted when you need it, and reviewed by
            humans who own the product.
          </p>
        </section>

        <section className="jxh-section">
          <h2 className="jxh-h2">Your path in three moves</h2>
          <ol className="jxh-steps">
            <li>
              <span className="jxh-step-n">1</span>
              <div>
                <strong>Share your academic &amp; career interests</strong>
                <p>
                  Trade, frontend/backend focus, and where you are today. No fluff resume — just
                  enough to place you honestly.
                </p>
              </div>
            </li>
            <li>
              <span className="jxh-step-n">2</span>
              <div>
                <strong>Join a product team</strong>
                <p>
                  You are matched into open work on enterprise apps moving toward launch. Frontend,
                  backend, or both — requirements, review, and customers on the other side of the
                  merge.
                </p>
              </div>
            </li>
            <li>
              <span className="jxh-step-n">3</span>
              <div>
                <strong>Learn in the loop, not in a silo</strong>
                <p>
                  Stuck? Assist Me teaches the skill in context. Done? Open a PR. Humans review.
                  That loop is how you go from campus to desk.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className="jxh-section jxh-section-close">
          <h2 className="jxh-h2">A note from your future self</h2>
          <p className="jxh-p">
            Employers will not ask how many hours of video you watched. They will ask what you built,
            how you handled feedback, and whether you can own a slice without being babysat. Start
            collecting those answers here — on live product work, not another solo demo.
          </p>
          <p className="jxh-p jxh-p-em">It is free to apply. The only cost is showing up.</p>
          <Link className="jxh-cta-primary jxh-cta-bottom" to="/apply">
            Start with Apply
          </Link>
        </section>
      </main>

      <footer className="jxh-foot">
        <span>INPACT · for aspirants</span>
        <Link to="/">Back</Link>
      </footer>
    </div>
  );
}
