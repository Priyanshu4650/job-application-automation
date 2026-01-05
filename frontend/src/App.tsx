import React, { useState, useEffect } from 'react';
import type { Company, CreateCompanyDto } from './types/company';
import { companiesApi } from './services/api';
import { CompanyForm } from './components/CompanyForm';
import { CompaniesTable } from './components/CompaniesTable';
import { Modal } from './components/Modal';
import './App.css';

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await companiesApi.getAll();
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreate = async (data: CreateCompanyDto) => {
    try {
      setLoading(true);
      await companiesApi.create(data);
      setShowAddForm(false);
      loadCompanies();
    } catch (err) {
      setError('Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: CreateCompanyDto) => {
    if (!editingCompany) return;
    try {
      setLoading(true);
      await companiesApi.update(editingCompany.id, data);
      setEditingCompany(null);
      loadCompanies();
    } catch (err) {
      setError('Failed to update company');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to disable this company?')) return;
    try {
      setLoading(true);
      await companiesApi.delete(id);
      loadCompanies();
    } catch (err) {
      setError('Failed to disable company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Company Management</h1>
        <button onClick={() => setShowAddForm(true)}>Add Company</button>
      </header>

      {error && <div className="error">{error}</div>}

      <main>
        {showAddForm && (
          <Modal
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            title="Add New Company"
          >
            <CompanyForm
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
              loading={loading}
            />
          </Modal>
        )}

        {editingCompany && (
          <Modal
            isOpen={!!editingCompany}
            onClose={() => setEditingCompany(null)}
            title="Edit Company"
          >
            <CompanyForm
              company={editingCompany}
              onSubmit={handleUpdate}
              onCancel={() => setEditingCompany(null)}
              loading={loading}
            />
          </Modal>
        )}

        <CompaniesTable
          companies={companies}
          onEdit={setEditingCompany}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;
