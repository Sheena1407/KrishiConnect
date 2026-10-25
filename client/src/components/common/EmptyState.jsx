import React from 'react';
import { Sprout } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Sprout,
  title = 'No Records Found',
  description = 'There is currently no data to display in this section.',
  actionText,
  onAction,
}) => {
  return (
    <div className="krishi-card p-5 text-center my-4 d-flex flex-column align-items-center justify-content-center">
      <div
        className="rounded-circle p-3 mb-3 d-inline-flex align-items-center justify-content-center"
        style={{ backgroundColor: '#E8F5E9', color: '#2D6A4F' }}
      >
        <Icon size={38} />
      </div>
      <h5 className="fw-bold text-dark mb-2">{title}</h5>
      <p className="text-muted small mb-3" style={{ maxWidth: '380px', lineHeight: 1.6 }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-krishi btn-sm px-4">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
