import React, { useState } from 'react';
import type { Company, CreateCompanyDto } from '../types/company';
import { AtsType } from '../types/company';

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: CreateCompanyDto) => void;
  onCancel: () => void;
  loading: boolean;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState<CreateCompanyDto>({
    name: company?.name || '',
    careerPageUrl: company?.careerPageUrl || '',
    atsType: company?.atsType || AtsType.UNKNOWN,
    active: company?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="company-form">
      <div className="form-group">
        <label>Company Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Career Page URL:</label>
        <input
          type="url"
          value={formData.careerPageUrl}
          onChange={(e) => setFormData({ ...formData, careerPageUrl: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>ATS Type:</label>
        <select
          value={formData.atsType}
          onChange={(e) => setFormData({ ...formData, atsType: e.target.value as AtsType })}
        >
          {Object.values(AtsType).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          />
          Active
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : company ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};