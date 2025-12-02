import './ToolsLanding.css'

const downloads = [
  {
    id: 'honey',
    title: 'Honey Multi-FX Synth Patcher Preset',
    body: 'FL Studio Patcher preset stacked with modulation, transient shaping, and spectral tricks. Drop it on keys, pads, or vocals when you need instant movement.',
    href: '/tools/honey.zip',
    label: 'Download Honey Multi-FX',
    meta: 'ZIP ~24 MB',
  },
  {
    id: 'starter',
    title: "Beginner's Starter Pack -- From Zero to Hero",
    body: 'Mini-guides, workflow checklists, and templates covering vocals, mixing, and promotion so first releases get over the finish line.',
    href: '/tools/beginners_starter_pack_from_zero_to_hero.zip',
    label: 'Download Starter Pack',
    meta: 'ZIP ~12 MB',
  },
]

export default function ToolsLanding() {
  return (
    <div className="tools-page">
      <main className="tools-shell">
        <header className="tools-header">
          <p className="tools-kicker">Direct Drop</p>
          <h1>Honeycomb Lab Tools</h1>
          <p className="lead">
            Hidden stash for artists who know. Grab the latest freebies directly -- no forms, no
            friction. These files live at <code>/public/tools</code>; refresh anytime to pull the
            newest build.
          </p>
        </header>

        <section className="downloads" aria-label="Download links">
          {downloads.map((dl) => (
            <article key={dl.id}>
              <h2>{dl.title}</h2>
              <p>{dl.body}</p>
              <a className="download" href={dl.href} download>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M12 3a1 1 0 011 1v8.59l2.3-2.3a1 1 0 011.4 1.42l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.42L11 12.59V4a1 1 0 011-1zm-7 14a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-1 1H6a1 1 0 01-1-1v-3z"
                  />
                </svg>
                {dl.label}
              </a>
              <small className="meta">{dl.meta}</small>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
