import React from 'react';
import type { Company } from '../types/company';

interface CompaniesTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  onEdit,
  onDelete,
  loading,
}) => {
  if (loading) {
    return <div className="loading">Loading companies...</div>;
  }

  return (
    <table className="companies-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Career Page URL</th>
          <th>ATS Type</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {companies.map((company) => (
          <tr key={company.id}>
            <td>{company.name}</td>
            <td>
              <a href={company.careerPageUrl} target="_blank" rel="noopener noreferrer">
                {company.careerPageUrl}
              </a>
            </td>
            <td>{company.atsType}</td>
            <td>{company.active ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(company)}>Edit</button>
              <button onClick={() => onDelete(company.id)}>Disable</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};