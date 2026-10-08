import './ManualPage.css';

import { useState } from 'react';

// Mock documentation data structure
const MANUAL_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: (
      <>
        <p>
          Welcome to the User Manual. This guide will walk you through the core
          features of our application and help you set up your profile quickly.
        </p>
        <div className="manual-alert info">
          <strong>💡 Pro Tip:</strong> You can access this manual at any time by
          pressing <code>Ctrl + /</code> on your keyboard.
        </div>
      </>
    ),
  },
  {
    id: 'account-setup',
    title: 'Account Setup',
    content: (
      <>
        <p>
          To configure your workspace, navigate to the settings gear icon in the
          top right corner. Complete the following three actions:
        </p>
        <ul>
          <li>
            <strong>Verify Email:</strong> Click the activation link sent to
            your registered inbox.
          </li>
          <li>
            <strong>Set Preferences:</strong> Choose between light and dark UI
            themes.
          </li>
          <li>
            <strong>Invite Peers:</strong> Add your team members via their
            corporate email addresses.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    content: (
      <>
        <p>
          Developers can fetch real-time application states using our modular
          wrapper tools. Initialize the client package in your local app entry
          point:
        </p>
        <pre className="manual-code">
          {`import { AppClient } from '@app/core';

const client = new AppClient({
  apiKey: process.env.APP_API_KEY,
  environment: 'production'
});`}
        </pre>
      </>
    ),
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    content: (
      <>
        <p>
          If you experience performance slowdowns or synchronization lag, try
          these quick corrective steps before contacting support:
        </p>
        <div className="manual-alert warning">
          <strong>⚠️ Warning:</strong> Clearing your application cache will log
          you out of all active background browser sessions.
        </div>
        <ul>
          <li>
            Perform a hard refresh (<code>Ctrl + F5</code> or{' '}
            <code>Cmd + Shift + R</code>).
          </li>
          <li>Verify your network outbound firewall permissions.</li>
        </ul>
      </>
    ),
  },
];

export default function ManualPage() {
  const [activeSection, setActiveSection] = useState(MANUAL_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // Simple filter for the sidebar navigation items
  const filteredSections = MANUAL_SECTIONS.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const currentSection =
    MANUAL_SECTIONS.find((s) => s.id === activeSection) || MANUAL_SECTIONS[0];

  return (
    <div className="manual-container">
      {/* Sidebar Navigation */}
      <aside className="manual-sidebar">
        <div className="sidebar-header">
          <h2>USER MANUAL</h2>
          <input
            type="text"
            placeholder="Search manual articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="manual-search-input"
          />
        </div>
        <nav className="sidebar-nav">
          {filteredSections.length > 0 ? (
            <ul>
              {filteredSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-results">No topics match your search.</p>
          )}
        </nav>
      </aside>

      {/* Main Document Content Area */}
      <main className="manual-content">
        <article>
          <header className="content-header">
            <h1>{currentSection.title}</h1>
          </header>
          <section className="content-body">{currentSection.content}</section>
        </article>
      </main>
    </div>
  );
}
