"use client";

import { useEffect, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const problemSources = [
  { label: "Permits", source: "County & municipal portals" },
  { label: "Bids", source: "Procurement & bid systems" },
  { label: "Projects", source: "Construction databases" },
  { label: "Company activity", source: "GC & subcontractor records" },
  { label: "Development", source: "Parcels, zoning & announcements" },
  { label: "Hiring", source: "LinkedIn, career pages & talent data" },
];

const pipeline = [
  "Signals",
  "Project / Company",
  "Context",
  "Staffing Opportunity",
  "Outreach",
];

const signals = [
  {
    title: "Permits",
    body: "Issued, pending, and related permit activity that can surface work before it is widely discussed.",
  },
  {
    title: "Bids",
    body: "Bid postings and related activity that help staffing teams see where work may be forming.",
  },
  {
    title: "Projects",
    body: "Active and upcoming projects, including the companies associated with the work.",
  },
  {
    title: "Project Announcements",
    body: "Project announcements and completions that help business development know who is working on what.",
  },
  {
    title: "GCs & Subs",
    body: "General contractors and subcontractors tied to projects, so outreach starts with the right company.",
  },
  {
    title: "Development",
    body: "Parcels, zoning, and development activity that can precede construction and hiring demand.",
  },
  {
    title: "Hiring",
    body: "Hiring and talent activity used alongside construction signals — not as a standalone list.",
  },
];

const exampleActivity = [
  "Permit issued",
  "Bid activity",
  "Project announced",
  "Hiring activity",
];

function WaitlistForm({ email, setEmail, handleSubmit, isSubmitting }) {
  return (
    <div className="waitlist-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Joining..." : "Join the Waitlist"}
      </button>
    </div>
  );
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeout = setTimeout(() => {
      setNotification(null);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [notification]);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setNotification({
        type: "error",
        message: "Please enter your email address.",
      });
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setNotification({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setNotification({
          type: "success",
          message: "You joined the waitlist.",
        });
        setEmail("");
      } else {
        setNotification({
          type: "error",
          message: result.message || "Could not join the waitlist.",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "Could not join the waitlist. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      {notification && (
        <div className={`notification ${notification.type}`} role="status">
          {notification.message}
        </div>
      )}

      <header className="site-header">
        <div className="site-mark">Fanthom</div>
        <div className="site-meta">Construction staffing intelligence</div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">For construction staffing teams</div>

          <h1>Find Construction Staffing Opportunities Earlier</h1>

          <p className="hero-description">
            Track permits, bids, projects, and hiring activity in one place —
            and see the construction activity behind potential staffing
            opportunities.
          </p>

          <WaitlistForm
            email={email}
            setEmail={setEmail}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <p className="hero-note">
            Built for teams already researching construction activity across
            public sources, project databases, and hiring data.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div className="eyebrow">The problem</div>
          <h2>Construction opportunity data is scattered.</h2>
          <p>
            Staffing teams already research permits, bids, new projects, GCs and
            subcontractors, parcels and zoning, and hiring activity. The work is
            not finding data — it is assembling it from county portals,
            construction databases, LinkedIn, company sites, and hiring sources.
          </p>
        </div>

        <div className="source-grid">
          {problemSources.map((item) => (
            <div className="source-card" key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.source}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section how-section">
        <div className="section-heading">
          <div className="eyebrow">How it works</div>
          <h2>Bring fragmented construction signals together.</h2>
          <p>
            The product connects related activity to a project or company, gives
            staffing teams the context to decide what is relevant, and supports
            outreach with a reason to reach out — not another generic lead list.
          </p>
        </div>

        <p className="pipeline-chain">
          Signals → Project/Company → Context → Staffing Opportunity → Outreach
        </p>

        <ol className="pipeline">
          {pipeline.map((step, index) => (
            <li className="pipeline-step" key={step}>
              <span className="pipeline-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="section-heading">
          <div className="eyebrow">Signals</div>
          <h2>The construction activity staffing teams already watch.</h2>
          <p>
            These are the sources teams combine today. The value is seeing them
            together, tied to the same project or company.
          </p>
        </div>

        <div className="signal-cards">
          {signals.map((signal) => (
            <article className="signal-card" key={signal.title}>
              <h3>{signal.title}</h3>
              <p>{signal.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section example-section">
        <div className="section-heading">
          <div className="eyebrow">Example</div>
          <h2>See the construction context behind the opportunity.</h2>
          <p>
            A mock view of how related signals can sit on one company. This is
            illustrative — not a live score, ranking, or predicted outcome.
          </p>
        </div>

        <article
          className="opportunity-card"
          aria-label="Mock opportunity card"
        >
          <div className="mock-label">Mock opportunity card</div>

          <div className="opportunity-top">
            <div>
              <div className="opportunity-company">ABC Construction</div>
              <div className="opportunity-location">Dallas, TX</div>
            </div>
          </div>

          <div className="opportunity-project">
            <span>Project</span>
            <strong>Commercial development</strong>
          </div>

          <div className="opportunity-divider" />

          <div className="activity-block">
            <span className="footer-label">Recent activity</span>
            <ul className="activity-list">
              {exampleActivity.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <p className="opportunity-caption">
            See the construction context behind the opportunity.
          </p>
        </article>
      </section>

      <section className="section workflow-section">
        <div className="section-heading">
          <div className="eyebrow">Current workflow</div>
          <h2>Less time connecting sources. More time acting on them.</h2>
        </div>

        <div className="workflow-compare">
          <div className="workflow-panel">
            <div className="workflow-kicker">Manual</div>
            <p className="workflow-path">
              Permit portals → project databases → bids → LinkedIn → company
              sites → hiring → connect the information
            </p>
            <p className="workflow-note">
              Useful signals already exist. The cost is the time spent
              assembling them across systems.
            </p>
          </div>

          <div className="workflow-panel workflow-panel-product">
            <div className="workflow-kicker">Product</div>
            <p className="workflow-path">
              Monitor → connect → understand → act
            </p>
            <p className="workflow-note">
              Watch the same kinds of activity, see them in context, and decide
              where a staffing conversation is relevant.
            </p>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="final-cta-content">
          <div className="eyebrow">Early access</div>
          <h2>Spend less time piecing together construction signals.</h2>
          <p>
            Join the waitlist if your team already researches construction
            activity and wants those signals in one place.
          </p>

          <WaitlistForm
            email={email}
            setEmail={setEmail}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </section>
    </main>
  );
}
