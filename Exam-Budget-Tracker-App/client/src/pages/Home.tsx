import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import './Home.scss';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <Header />
      <header className="home-hero">
        <div className="home-hero__content">
          <div className="home-hero__copy">
            <p className="home-eyebrow">Personal finance clarity</p>
            <h1 className="home-title">See every budget move at a glance.</h1>
            <p className="home-subtitle">
              Budget Tracker helps you plan budgets, log every income and expense,
              and understand your cash flow without spreadsheets.
            </p>
            <div className="home-hero__cta">
              {!isAuthenticated ? (
                <>
                  <Link className="home-cta home-cta--primary" to="/register">
                    Start free
                  </Link>
                  <Link className="home-cta home-cta--ghost" to="/login">
                    I already have an account
                  </Link>
                </>
              ) : (
                <Link className="home-cta home-cta--primary" to="/budgets">
                  Open my budgets
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="home-section">
          <h2 className="home-section__title">How budgets work</h2>
          <p className="home-section__subtitle">
            Create budgets for every goal, track spending as transactions, and
            keep a real-time balance for each budget.
          </p>
          <div className="home-grid">
            <article className="home-card">
              <h3>Budgets</h3>
              <p>
                Define a budget with a starting amount, timeframe, and a clear
                purpose. Each budget holds its own balance and transaction list.
              </p>
            </article>
            <article className="home-card">
              <h3>Transactions</h3>
              <p>
                Log income and expenses with categories and dates. Positive amounts
                increase balance, negative amounts reduce it.
              </p>
            </article>
            <article className="home-card">
              <h3>Insights</h3>
              <p>
                Review what is working, identify overspending, and adjust targets
                quickly with clear budget summaries.
              </p>
            </article>
          </div>
        </section>

        <section className="home-section home-section--accent">
          <h2 className="home-section__title">What you can do</h2>
          <div className="home-feature-list">
            <div className="home-feature">
              <span className="home-feature__title">Track every transaction</span>
              <span className="home-feature__text">
                Stay on top of expenses with detailed history and categories.
              </span>
            </div>
            <div className="home-feature">
              <span className="home-feature__title">Stay aligned with goals</span>
              <span className="home-feature__text">
                Keep your balance healthy by seeing the full budget picture.
              </span>
            </div>
            <div className="home-feature">
              <span className="home-feature__title">Move faster</span>
              <span className="home-feature__text">
                Add transactions in seconds and get instant balance updates.
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
