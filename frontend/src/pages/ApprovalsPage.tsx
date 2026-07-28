import React, { useEffect, useState } from 'react';
import { getApprovals } from '../services/api';
import { Approval } from '../types';
import { ApprovalQueueCard } from '../components/approvals/ApprovalQueueCard';

export const ApprovalsPage: React.FC = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);

  const loadApprovals = async () => {
    try {
      const data = await getApprovals();
      setApprovals(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <ApprovalQueueCard approvals={approvals} onActionComplete={loadApprovals} />
    </div>
  );
};
