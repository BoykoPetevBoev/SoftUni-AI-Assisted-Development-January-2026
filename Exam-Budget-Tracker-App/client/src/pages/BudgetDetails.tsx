import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { TransactionDetail } from '../components/TransactionDetail';
import { useBudgetDetails } from '../hooks/useBudgetDetails';
import './BudgetDetails.scss';

export const BudgetDetails: React.FC = () => {
  const { budgetId } = useParams();
  const parsedBudgetId = budgetId ? Number(budgetId) : undefined;

  const {
    budgetTitle,
    budgetDescription,
    formattedDate,
    formattedInitialAmount,
    formattedBalance,
    isBudgetLoading,
    budgetError,
    transactions,
    isTransactionsLoading,
    transactionsError,
    refetchTransactions,
    selectedTransaction,
    selectedTransactionId,
    isFormOpen,
    editingTransactionId,
    deleteConfirmId,
    isDeleting,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSelectTransaction,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useBudgetDetails(parsedBudgetId);

  if (!parsedBudgetId || Number.isNaN(parsedBudgetId)) {
    return (
      <div className="budget-details">
        <Header />
        <main className="budget-details__container">
          <div className="budget-details__empty">
            <h2>Budget not found</h2>
            <p>We could not find this budget.</p>
            <Link className="budget-details__back" to="/budgets">
              Back to budgets
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="budget-details">
      <Header />
      <main className="budget-details__container">
        <div className="budget-details__summary">
          <div className="budget-details__summary-header">
            <div>
              {isBudgetLoading ? (
                <p className="budget-details__loading">Loading budget...</p>
              ) : budgetError ? (
                <p className="budget-details__error">Failed to load budget.</p>
              ) : (
                <>
                  <h2 className="budget-details__title">{budgetTitle}</h2>
                  <p className="budget-details__meta">{formattedDate}</p>
                  {budgetDescription && (
                    <p className="budget-details__description">{budgetDescription}</p>
                  )}
                </>
              )}
            </div>
            <button
              className="budget-details__add-btn"
              onClick={openCreateForm}
              disabled={isBudgetLoading || !!budgetError}
            >
              + Add Transaction
            </button>
          </div>

          <div className="budget-details__stats">
            <div className="budget-details__stat">
              <span className="budget-details__stat-label">Initial Amount</span>
              <span className="budget-details__stat-value">{formattedInitialAmount}</span>
            </div>
            <div className="budget-details__stat budget-details__stat--balance">
              <span className="budget-details__stat-label">Current Balance</span>
              <span className="budget-details__stat-value">{formattedBalance}</span>
            </div>
          </div>
        </div>

        <div className="budget-details__content">
          <section className="budget-details__list">
            <TransactionList
              transactions={transactions}
              isLoading={isTransactionsLoading}
              error={transactionsError}
              onRetry={refetchTransactions}
              selectedTransactionId={selectedTransactionId}
              onSelect={handleSelectTransaction}
              onEditClick={openEditForm}
              deleteConfirmId={deleteConfirmId}
              isDeleting={isDeleting}
              onDeleteClick={handleDeleteClick}
              onConfirmDelete={handleConfirmDelete}
              onCancelDelete={handleCancelDelete}
            />
          </section>

          <aside className="budget-details__detail">
            <TransactionDetail transaction={selectedTransaction} />
          </aside>
        </div>
      </main>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={closeForm}
        budgetId={parsedBudgetId}
        transactionId={editingTransactionId ?? undefined}
      />
    </div>
  );
};
