import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import React, { useEffect, useMemo, useState } from 'react';

export interface LeadItem {
  id: string;
  leadName: string;
  leadNumber: string;
  leadEmail?: string | null;
  leadSource: 'Website' | 'WhatsApp' | 'Phone' | 'Walk-in' | 'Other';
  isQualifiedLead: boolean;
  status: 'New' | 'Qualified' | 'Contacted' | 'Cold';
  nextFollowupDate?: string | null;
  assignedSalesUser: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  initials: string;
  avatarTone: 'violet' | 'teal' | 'amber' | 'slate' | 'brand';
  source: 'Website' | 'WhatsApp' | 'Phone' | 'Walk-in' | 'Other';
  requirement: string;
  estValue: string;
  score: 'A' | 'B';
  stage: 'New' | 'Qualified' | 'Contacted' | 'Cold';
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadKpis {
  totalOpenLeads: number;
  openLeadsGrowth: string;
  websitePercentage: number;
  whatsappPercentage: number;
  phonePercentage: number;
}

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'LD-3311',
    leadName: 'Kavitha M.',
    leadNumber: '+91 98451 22310',
    leadEmail: 'kavitha.m@gmail.com',
    leadSource: 'Website',
    isQualifiedLead: false,
    status: 'New',
    nextFollowupDate: '2026-09-12',
    assignedSalesUser: 'Priya Sharma',
    initials: 'KM',
    avatarTone: 'violet',
    source: 'Website',
    stage: 'New',
    phone: '+91 98451 22310',
    email: 'kavitha.m@gmail.com',
    requirement: 'Sofa set · 3+1+1',
    estValue: '₹68K',
    score: 'B',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'LD-3308',
    leadName: 'Sundar Interiors',
    leadNumber: '+91 98840 91823',
    leadEmail: 'contact@sundarinteriors.in',
    leadSource: 'WhatsApp',
    isQualifiedLead: true,
    status: 'Qualified',
    nextFollowupDate: '2026-09-14',
    assignedSalesUser: 'Vikram Malhotra',
    companyName: 'Sundar Interior Solutions',
    initials: 'SI',
    avatarTone: 'teal',
    source: 'WhatsApp',
    stage: 'Qualified',
    phone: '+91 98840 91823',
    email: 'contact@sundarinteriors.in',
    requirement: 'Office furniture · 40 seats',
    estValue: '₹4.8L',
    score: 'A',
    createdAt: '2026-09-02T11:30:00.000Z',
    updatedAt: '2026-09-02T11:30:00.000Z',
  },
  {
    id: 'LD-3302',
    leadName: 'Ravi S.',
    leadNumber: '+91 97112 34567',
    leadEmail: 'ravi.sharma@yahoo.com',
    leadSource: 'Phone',
    isQualifiedLead: false,
    status: 'Contacted',
    nextFollowupDate: '2026-09-11',
    assignedSalesUser: 'Amit Patel',
    initials: 'RS',
    avatarTone: 'amber',
    source: 'Phone',
    stage: 'Contacted',
    phone: '+91 97112 34567',
    email: 'ravi.sharma@yahoo.com',
    requirement: 'Beds ×2 · engineered wood',
    estValue: '₹1.1L',
    score: 'A',
    createdAt: '2026-09-03T09:15:00.000Z',
    updatedAt: '2026-09-03T09:15:00.000Z',
  },
  {
    id: 'LD-3299',
    leadName: 'GreenNest Villas',
    leadNumber: '+91 80234 56789',
    leadEmail: 'procurement@greennest.com',
    leadSource: 'Website',
    isQualifiedLead: true,
    status: 'Qualified',
    nextFollowupDate: '2026-09-16',
    assignedSalesUser: 'Sneha Rao',
    companyName: 'GreenNest Realty Ltd',
    initials: 'GV',
    avatarTone: 'teal',
    source: 'Website',
    stage: 'Qualified',
    phone: '+91 80234 56789',
    email: 'procurement@greennest.com',
    requirement: 'Full-home furniture · 12 villas',
    estValue: '₹18.5L',
    score: 'A',
    createdAt: '2026-09-04T14:20:00.000Z',
    updatedAt: '2026-09-04T14:20:00.000Z',
  },
  {
    id: 'LD-3291',
    leadName: 'Faisal A.',
    leadNumber: '+91 99001 12233',
    leadEmail: 'faisal.ahmed@outlook.com',
    leadSource: 'Walk-in',
    isQualifiedLead: false,
    status: 'Cold',
    nextFollowupDate: '2026-09-20',
    assignedSalesUser: 'Arun Joshi',
    initials: 'FA',
    avatarTone: 'slate',
    source: 'Walk-in',
    stage: 'Cold',
    phone: '+91 99001 12233',
    email: 'faisal.ahmed@outlook.com',
    requirement: 'Dining set · 6 seater',
    estValue: '₹54K',
    score: 'B',
    createdAt: '2026-09-05T16:45:00.000Z',
    updatedAt: '2026-09-05T16:45:00.000Z',
  },
  {
    id: 'LD-3287',
    leadName: 'Lakshmi Builders',
    leadNumber: '+91 94440 88776',
    leadEmail: 'info@lakshmibuilders.org',
    leadSource: 'Phone',
    isQualifiedLead: true,
    status: 'Contacted',
    nextFollowupDate: '2026-09-13',
    assignedSalesUser: 'Vikram Malhotra',
    companyName: 'Lakshmi Construction Corp',
    initials: 'LB',
    avatarTone: 'amber',
    source: 'Phone',
    stage: 'Contacted',
    phone: '+91 94440 88776',
    email: 'info@lakshmibuilders.org',
    requirement: 'Site office furniture',
    estValue: '₹5.6L',
    score: 'A',
    createdAt: '2026-09-06T12:00:00.000Z',
    updatedAt: '2026-09-06T12:00:00.000Z',
  },
];

// Styling following Century Ply CX / Lovable Design
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 24px 32px 32px;
  background-color: #f7ecec;
  overflow-y: auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a1a;
  box-sizing: border-box;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #1a1a1a;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: #6b7280;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SecondaryButton = styled.button`
  background-color: #ffffff;
  color: #1a1a1a;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 9px 18px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const PrimaryButton = styled.button`
  background-color: #e23e2e;
  color: #ffffff;
  border: none;
  padding: 9px 18px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 16px -6px rgba(226, 62, 46, 0.5);
  transition: all 0.15s ease;

  &:hover {
    background-color: #c93425;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

// Toast Notification Banner
const ToastBanner = styled.div<{ isError?: boolean }>`
  position: fixed;
  top: 24px;
  right: 32px;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 12px;
  background-color: ${props => props.isError ? '#fef2f2' : '#ecfdf5'};
  border: 1px solid ${props => props.isError ? '#f87171' : '#10b981'};
  color: ${props => props.isError ? '#991b1b' : '#065f46'};
  font-size: 13.5px;
  font-weight: 700;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// 4 Metric Cards Grid
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px -12px rgba(16, 24, 40, 0.08);
`;

const MetricIconContainer = styled.div<{ bg: string; color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: ${props => props.bg};
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const MetricValue = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1;
  letter-spacing: -0.02em;
`;

const MetricLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  margin-top: 6px;
`;

const MetricFoot = styled.div<{ color?: string }>`
  font-size: 12px;
  font-weight: 800;
  color: ${props => props.color || '#12a594'};
  margin-top: 4px;
`;

// Table Card Container
const TableCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px -12px rgba(16, 24, 40, 0.08);
  display: flex;
  flex-direction: column;
`;

const TableTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

const TableTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TableTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1a1a1a;
`;

const TableSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
`;

const TableControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  outline: none;
  min-width: 220px;
  transition: all 0.15s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    background: #ffffff;
    border-color: #e23e2e;
    box-shadow: 0 0 0 2px rgba(226, 62, 46, 0.15);
  }
`;

const FilterSelect = styled.select`
  background-color: #ffffff;
  color: #1a1a1a;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #f9fafb;
  }
`;

// Table and Elements
const TableResponsive = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
`;

const Th = styled.th<{ alignRight?: boolean }>`
  padding: 12px 16px 8px;
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6b7280;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  text-align: ${props => props.alignRight ? 'right' : 'left'};
`;

const Tr = styled.tr`
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.015);
  }
`;

const Td = styled.td<{ alignRight?: boolean }>`
  padding: 14px 16px;
  font-weight: 600;
  color: #1a1a1a;
  vertical-align: middle;
  text-align: ${props => props.alignRight ? 'right' : 'left'};
`;

const LeadId = styled.span`
  font-weight: 800;
  color: #6b7280;
  font-size: 13px;
`;

const LeadCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LeadAvatar = styled.span<{ tone: 'violet' | 'teal' | 'amber' | 'slate' | 'brand' }>`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 800;
  color: #ffffff;
  background-color: ${props => {
    switch (props.tone) {
      case 'violet': return '#8b5cf6';
      case 'teal': return '#12a594';
      case 'amber': return '#e9a13b';
      case 'slate': return '#64748b';
      case 'brand': return '#e23e2e';
      default: return '#64748b';
    }
  }};
`;

const LeadInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const LeadName = styled.span`
  font-weight: 700;
  color: #1a1a1a;
  font-size: 13.5px;
`;

const LeadCompany = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
`;

const SourceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 11.5px;
  font-weight: 800;
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(26, 26, 26, 0.65);
`;

const RequirementText = styled.span`
  font-weight: 600;
  color: rgba(26, 26, 26, 0.85);
`;

const ValueText = styled.span`
  font-weight: 800;
  color: #e23e2e;
  font-size: 13.5px;
`;

const ScoreBadge = styled.span<{ score: 'A' | 'B'; source: string }>`
  display: inline-grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 800;
  background-color: ${props => {
    if (props.score === 'B') return 'rgba(139, 92, 246, 0.1)';
    if (props.source === 'WhatsApp') return 'rgba(18, 165, 148, 0.1)';
    if (props.source === 'Phone') return 'rgba(233, 161, 59, 0.15)';
    return 'rgba(226, 62, 46, 0.1)';
  }};
  color: ${props => {
    if (props.score === 'B') return '#8b5cf6';
    if (props.source === 'WhatsApp') return '#12a594';
    if (props.source === 'Phone') return '#e9a13b';
    return '#e23e2e';
  }};
`;

const StageBadge = styled.span<{ stage: 'New' | 'Qualified' | 'Contacted' | 'Cold' }>`
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 11.5px;
  font-weight: 800;
  background-color: ${props => {
    switch (props.stage) {
      case 'New': return '#f0ebfe';
      case 'Qualified': return '#e2f5f2';
      case 'Contacted': return '#fdf3e3';
      case 'Cold': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.stage) {
      case 'New': return '#7c4deb';
      case 'Qualified': return '#0d8577';
      case 'Contacted': return '#b97a16';
      case 'Cold': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

const QualificationBadge = styled.span<{ isQualified: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  background-color: ${props => props.isQualified ? 'rgba(18, 165, 148, 0.12)' : 'rgba(100, 116, 139, 0.12)'};
  color: ${props => props.isQualified ? '#12a594' : '#64748b'};
`;

const ContactLink = styled.a`
  color: #1a1a1a;
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: #e23e2e;
    text-decoration: underline;
  }
`;

const SalesUserCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
`;

const SalesUserAvatar = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(226, 62, 46, 0.12);
  color: #e23e2e;
  font-size: 9.5px;
  font-weight: 800;
  display: grid;
  place-items: center;
`;

const SalesUserName = styled.span`
  font-size: 12.5px;
  font-weight: 600;
  color: #1a1a1a;
`;

const DateCell = styled.span`
  font-size: 12px;
  color: #4b5563;
  font-weight: 600;
  white-space: nowrap;
`;

const FollowupBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  background-color: rgba(0, 0, 0, 0.04);
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const TextActionButton = styled.button<{ danger?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.danger ? '#e23e2e' : '#3b82f6'};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s ease;

  &:hover {
    background-color: ${props => props.danger ? '#fdeceb' : '#eff6ff'};
  }
`;

// Century Ply CX Enhanced Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  width: 580px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ModalHeaderBanner = styled.div`
  background: linear-gradient(135deg, #e23e2e 0%, #ba2819 100%);
  padding: 22px 28px;
  border-radius: 24px 24px 0 0;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalHeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ModalHeaderTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.01em;
`;

const ModalHeaderSubtitle = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
`;

const ModalCloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

const ModalBody = styled.div`
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  grid-column: ${props => props.fullWidth ? 'span 2' : 'auto'};

  @media (max-width: 500px) {
    grid-column: span 1;
  }
`;

const FormLabel = styled.label`
  font-size: 12.5px;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RequiredStar = styled.span`
  color: #e23e2e;
  font-weight: 800;
`;

const FormInput = styled.input<{ hasError?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#e23e2e' : '#d1d5db'};
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  transition: all 0.15s ease;
  background-color: ${props => props.hasError ? '#fef2f2' : '#ffffff'};

  &:focus {
    border-color: ${props => props.hasError ? '#e23e2e' : '#e23e2e'};
    box-shadow: 0 0 0 2px rgba(226, 62, 46, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const FormTextarea = styled.textarea<{ hasError?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#e23e2e' : '#d1d5db'};
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  min-height: 70px;
  resize: vertical;
  transition: all 0.15s ease;
  font-family: inherit;
  background-color: ${props => props.hasError ? '#fef2f2' : '#ffffff'};

  &:focus {
    border-color: #e23e2e;
    box-shadow: 0 0 0 2px rgba(226, 62, 46, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const FormSelect = styled.select<{ hasError?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#e23e2e' : '#d1d5db'};
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;

  &:focus {
    border-color: #e23e2e;
    box-shadow: 0 0 0 2px rgba(226, 62, 46, 0.15);
  }
`;

const FieldError = styled.span`
  color: #e23e2e;
  font-size: 11.5px;
  font-weight: 700;
  margin-top: 2px;
`;

const ErrorBanner = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

// SVGs for Century Ply CX
const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const MessageCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
  </svg>
);

const PhoneCallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2a9 9 0 0 1 9 9" />
    <path d="M13 6a5 5 0 0 1 5 5" />
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  </svg>
);

const SALES_USERS = [
  'Vikram Malhotra',
  'Priya Sharma',
  'Amit Patel',
  'Sneha Rao',
  'Arun Joshi',
  'Kavita Nair',
];

const formatDateDisplay = (dateStr?: string | null) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

interface FormDataState {
  leadName: string;
  leadNumber: string;
  leadEmail: string;
  leadSource: LeadItem['leadSource'];
  isQualifiedLead: boolean;
  status: LeadItem['status'];
  nextFollowupDate: string;
  assignedSalesUser: string;
  companyName: string;
  requirement: string;
  estValue: string;
  score: 'Auto' | 'A' | 'B';
  notes: string;
}

export const LeadsPage = () => {
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [kpis, setKpis] = useState<LeadKpis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<'All stages' | 'New' | 'Qualified' | 'Contacted' | 'Cold'>('All stages');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const [formData, setFormData] = useState<FormDataState>({
    leadName: '',
    leadNumber: '',
    leadEmail: '',
    leadSource: 'Website',
    isQualifiedLead: false,
    status: 'New',
    nextFollowupDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    assignedSalesUser: '',
    companyName: '',
    requirement: '',
    estValue: '₹2.5L',
    score: 'Auto',
    notes: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch leads and KPIs from backend API
  const loadLeadsFromApi = async () => {
    try {
      const [leadsRes, kpiRes] = await Promise.all([
        fetch('/rest/leads'),
        fetch('/rest/leads/kpis'),
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        if (Array.isArray(data) && data.length > 0) {
          const normalized: LeadItem[] = data.map((l: any) => ({
            ...l,
            leadNumber: l.leadNumber || l.phone || '+91 98000 00000',
            leadEmail: l.leadEmail || l.email || null,
            leadSource: l.leadSource || l.source || 'Website',
            isQualifiedLead: l.isQualifiedLead !== undefined ? l.isQualifiedLead : (l.stage === 'Qualified' || l.score === 'A'),
            status: l.status || l.stage || 'New',
            nextFollowupDate: l.nextFollowupDate || '2026-09-15',
            assignedSalesUser: l.assignedSalesUser || '',
            createdAt: l.createdAt || new Date().toISOString(),
            updatedAt: l.updatedAt || new Date().toISOString(),
          }));
          setLeads(normalized);
        }
      }

      if (kpiRes.ok) {
        const kpiData = await kpiRes.json();
        setKpis(kpiData);
      }
    } catch (err) {
      console.warn('Backend leads API unavailable, using cached state', err);
    }
  };

  useEffect(() => {
    loadLeadsFromApi();
  }, []);

  // Client-side form validation
  const validationErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (!formData.leadName.trim()) {
      errs.leadName = 'Lead or contact name is required';
    } else if (formData.leadName.trim().length < 2) {
      errs.leadName = 'Name must be at least 2 characters long';
    }

    if (!formData.leadNumber.trim()) {
      errs.leadNumber = 'Lead phone number is required';
    } else if (!/^[0-9+\s\-()]{7,20}$/.test(formData.leadNumber.trim())) {
      errs.leadNumber = 'Please enter a valid phone number (at least 7 digits)';
    }

    if (formData.leadEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.leadEmail.trim())) {
      errs.leadEmail = 'Please provide a valid email address';
    }

    return errs;
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setApiError(null);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const openCreateModal = () => {
    setEditingLeadId(null);
    setApiError(null);
    setTouched({});
    setFormData({
      leadName: '',
      leadNumber: '',
      leadEmail: '',
      leadSource: 'Website',
      isQualifiedLead: false,
      status: 'New',
      nextFollowupDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      assignedSalesUser: '',
      companyName: '',
      requirement: 'Full-home modular setup',
      estValue: '₹2.5L',
      score: 'Auto',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (lead: LeadItem) => {
    setEditingLeadId(lead.id);
    setApiError(null);
    setTouched({});
    setFormData({
      leadName: lead.leadName,
      leadNumber: lead.leadNumber || lead.phone || '',
      leadEmail: lead.leadEmail || lead.email || '',
      leadSource: lead.leadSource || lead.source || 'Website',
      isQualifiedLead: !!lead.isQualifiedLead,
      status: lead.status || lead.stage || 'New',
      nextFollowupDate: lead.nextFollowupDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      assignedSalesUser: lead.assignedSalesUser || '',
      companyName: lead.companyName || '',
      requirement: lead.requirement || '',
      estValue: lead.estValue || '₹2.5L',
      score: lead.score || 'Auto',
      notes: lead.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete lead ${id}?`)) {
      return;
    }

    try {
      const res = await fetch(`/rest/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(prev => prev.filter(item => item.id !== id));
        showToast(`Lead ${id} successfully deleted!`);
      } else {
        setLeads(prev => prev.filter(item => item.id !== id));
        showToast(`Lead ${id} removed.`);
      }
    } catch {
      setLeads(prev => prev.filter(item => item.id !== id));
      showToast(`Lead ${id} removed.`);
    }
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark required fields as touched
    setTouched({
      leadName: true,
      leadNumber: true,
      leadEmail: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      setApiError('Please fix the validation errors before saving.');
      return;
    }

    setIsSaving(true);
    setApiError(null);

    const payload = {
      leadName: formData.leadName.trim(),
      leadNumber: formData.leadNumber.trim(),
      phone: formData.leadNumber.trim(),
      leadEmail: formData.leadEmail.trim() || undefined,
      email: formData.leadEmail.trim() || undefined,
      leadSource: formData.leadSource,
      source: formData.leadSource,
      isQualifiedLead: formData.isQualifiedLead,
      status: formData.status,
      stage: formData.status,
      nextFollowupDate: formData.nextFollowupDate,
      assignedSalesUser: formData.assignedSalesUser,
      companyName: formData.companyName.trim() || undefined,
      requirement: formData.requirement.trim() || 'Custom furniture requirement',
      estValue: formData.estValue.trim() || '₹1.0L',
      score: formData.score === 'Auto' ? undefined : formData.score,
      notes: formData.notes.trim() || undefined,
    };

    try {
      if (editingLeadId) {
        // Update existing lead
        const res = await fetch(`/rest/leads/${editingLeadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = Array.isArray(errData.message)
            ? errData.message.join(', ')
            : errData.message || 'Failed to update lead on server.';
          throw new Error(errMsg);
        }

        const updatedLead: LeadItem = await res.json();
        setLeads(prev => prev.map(item => (item.id === editingLeadId ? { ...item, ...updatedLead } : item)));
        showToast(`Lead ${editingLeadId} successfully updated!`);
      } else {
        // Create new lead
        const res = await fetch('/rest/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = Array.isArray(errData.message)
            ? errData.message.join(', ')
            : errData.message || 'Failed to create lead on server.';
          throw new Error(errMsg);
        }

        const createdLead: LeadItem = await res.json();
        setLeads(prev => [createdLead, ...prev]);
        showToast(`Lead ${createdLead.id} created successfully!`);
      }

      // Refresh KPIs
      loadLeadsFromApi();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Save lead failed:', err);
      setApiError(err.message || 'An error occurred while saving lead.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImport = () => {
    showToast('Century Ply CX import template ready! 4 sample records imported.');
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const stage = lead.status || lead.stage;
      const matchesStage = selectedStage === 'All stages' || stage === selectedStage;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !searchQuery ||
        lead.id.toLowerCase().includes(q) ||
        lead.leadName.toLowerCase().includes(q) ||
        (lead.leadNumber && lead.leadNumber.toLowerCase().includes(q)) ||
        (lead.leadEmail && lead.leadEmail.toLowerCase().includes(q)) ||
        (lead.companyName && lead.companyName.toLowerCase().includes(q)) ||
        (lead.leadSource && lead.leadSource.toLowerCase().includes(q)) ||
        (lead.assignedSalesUser && lead.assignedSalesUser.toLowerCase().includes(q)) ||
        (lead.status && lead.status.toLowerCase().includes(q));

      return matchesStage && matchesQuery;
    });
  }, [leads, selectedStage, searchQuery]);

  // Dynamic KPI counts - exact lead counts matching active leads list
  const totalOpenCount = leads.length;
  const websiteCount = leads.filter(l => l.source === 'Website').length;
  const whatsappCount = leads.filter(l => l.source === 'WhatsApp').length;
  const phoneCount = leads.filter(l => l.source === 'Phone').length;

  const websitePct = leads.length > 0 ? Math.round((websiteCount / leads.length) * 100) : 0;
  const whatsappPct = leads.length > 0 ? Math.round((whatsappCount / leads.length) * 100) : 0;
  const phonePct = leads.length > 0 ? Math.round((phoneCount / leads.length) * 100) : 0;

  return (
    <>
      <PageTitle title="Leads — Century Ply CX" />
      <Container>
        {/* Toast Notification */}
        {toastMessage && (
          <ToastBanner isError={toastMessage.isError}>
            <span>{toastMessage.text}</span>
          </ToastBanner>
        )}

        {/* Header Section */}
        <HeaderSection>
          <TitleGroup>
            <Title>Leads</Title>
            <Subtitle>Capture, score and qualify — every source feeds one funnel.</Subtitle>
          </TitleGroup>
          <HeaderActions>
            <SecondaryButton onClick={handleImport}>Import</SecondaryButton>
            <PrimaryButton onClick={openCreateModal}>+ New lead</PrimaryButton>
          </HeaderActions>
        </HeaderSection>

        {/* 4 KPI Metric Cards */}
        <MetricsGrid>
          {/* Open Leads */}
          <MetricCard>
            <MetricIconContainer bg="rgba(226, 62, 46, 0.1)" color="#e23e2e">
              <TargetIcon />
            </MetricIconContainer>
            <MetricValue>{totalOpenCount}</MetricValue>
            <MetricLabel>Open leads</MetricLabel>
            <MetricFoot color="#12a594">▲ 12% this week</MetricFoot>
          </MetricCard>

          {/* From Website */}
          <MetricCard>
            <MetricIconContainer bg="rgba(226, 62, 46, 0.1)" color="#e23e2e">
              <GlobeIcon />
            </MetricIconContainer>
            <MetricValue>{websitePct}%</MetricValue>
            <MetricLabel>From website</MetricLabel>
            <MetricFoot color="#12a594">Best converting source</MetricFoot>
          </MetricCard>

          {/* From WhatsApp */}
          <MetricCard>
            <MetricIconContainer bg="rgba(18, 165, 148, 0.1)" color="#12a594">
              <MessageCircleIcon />
            </MetricIconContainer>
            <MetricValue>{whatsappPct}%</MetricValue>
            <MetricLabel>From WhatsApp</MetricLabel>
            <MetricFoot color="#12a594">▲ 6%</MetricFoot>
          </MetricCard>

          {/* From Phone / IVR */}
          <MetricCard>
            <MetricIconContainer bg="rgba(233, 161, 59, 0.15)" color="#e9a13b">
              <PhoneCallIcon />
            </MetricIconContainer>
            <MetricValue>{phonePct}%</MetricValue>
            <MetricLabel>From phone / IVR</MetricLabel>
            <MetricFoot color="#e9a13b">▼ 2%</MetricFoot>
          </MetricCard>
        </MetricsGrid>

        {/* Lead Pipeline Table Card */}
        <TableCard>
          <TableTopBar>
            <TableTitleGroup>
              <TableTitle>Lead pipeline</TableTitle>
              <TableSubtitle>All sources · last 30 days</TableSubtitle>
            </TableTitleGroup>

            <TableControls>
              <SearchInput
                type="text"
                placeholder="Search leads, ID, company, requirement..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FilterSelect
                value={selectedStage}
                onChange={e => setSelectedStage(e.target.value as any)}
              >
                <option value="All stages">All stages</option>
                <option value="New">New</option>
                <option value="Qualified">Qualified</option>
                <option value="Contacted">Contacted</option>
                <option value="Cold">Cold</option>
              </FilterSelect>
            </TableControls>
          </TableTopBar>

          <TableResponsive>
            <Table>
              <thead>
                <tr>
                  <Th>Lead ID</Th>
                  <Th>Lead Name</Th>
                  <Th>Lead Number</Th>
                  <Th>Lead Email</Th>
                  <Th>Lead Source</Th>
                  <Th>Is Qualified</Th>
                  <Th>Status</Th>
                  <Th>Follow-up Date</Th>
                  <Th>Assigned Sales User</Th>
                  <Th>Created At</Th>
                  <Th>Updated At</Th>
                  <Th alignRight>Action</Th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => {
                  const salesUser = lead.assignedSalesUser;
                  const salesInitials = salesUser
                    ? salesUser
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : '';

                  const phoneNum = lead.leadNumber || lead.phone || '—';
                  const emailAddr = lead.leadEmail || lead.email;

                  return (
                    <Tr key={lead.id}>
                      {/* Lead ID */}
                      <Td>
                        <LeadId>{lead.id}</LeadId>
                      </Td>

                      {/* Lead Name */}
                      <Td>
                        <LeadCell>
                          <LeadAvatar tone={lead.avatarTone}>
                            {lead.initials}
                          </LeadAvatar>
                          <LeadInfoBlock>
                            <LeadName>{lead.leadName}</LeadName>
                            {lead.companyName && (
                              <LeadCompany>{lead.companyName}</LeadCompany>
                            )}
                          </LeadInfoBlock>
                        </LeadCell>
                      </Td>

                      {/* Lead Number */}
                      <Td>
                        {phoneNum !== '—' ? (
                          <ContactLink href={`tel:${phoneNum}`}>
                            <span style={{ fontSize: '11px' }}>📞</span>
                            <span>{phoneNum}</span>
                          </ContactLink>
                        ) : (
                          <DateCell>—</DateCell>
                        )}
                      </Td>

                      {/* Lead Email */}
                      <Td>
                        {emailAddr ? (
                          <ContactLink href={`mailto:${emailAddr}`}>
                            <span style={{ fontSize: '11px' }}>✉️</span>
                            <span>{emailAddr}</span>
                          </ContactLink>
                        ) : (
                          <DateCell>—</DateCell>
                        )}
                      </Td>

                      {/* Lead Source */}
                      <Td>
                        <SourceBadge>{lead.leadSource || lead.source}</SourceBadge>
                      </Td>

                      {/* Is Qualified Lead */}
                      <Td>
                        <QualificationBadge isQualified={!!lead.isQualifiedLead}>
                          {lead.isQualifiedLead ? '● Qualified' : '○ Not Qualified'}
                        </QualificationBadge>
                      </Td>

                      {/* Status */}
                      <Td>
                        <StageBadge stage={lead.status || lead.stage}>
                          {lead.status || lead.stage}
                        </StageBadge>
                      </Td>

                      {/* Next Followup Date */}
                      <Td>
                        <FollowupBadge>
                          <span style={{ fontSize: '11px' }}>📅</span>
                          <span>{formatDateDisplay(lead.nextFollowupDate)}</span>
                        </FollowupBadge>
                      </Td>

                      {/* Assigned Sales User */}
                      <Td>
                        {salesUser ? (
                          <SalesUserCell>
                            <SalesUserAvatar>{salesInitials}</SalesUserAvatar>
                            <SalesUserName>{salesUser}</SalesUserName>
                          </SalesUserCell>
                        ) : (
                          <DateCell style={{ color: '#9ca3af' }}>—</DateCell>
                        )}
                      </Td>

                      {/* Created At */}
                      <Td>
                        <DateCell>{formatDateDisplay(lead.createdAt)}</DateCell>
                      </Td>

                      {/* Updated At */}
                      <Td>
                        <DateCell>{formatDateDisplay(lead.updatedAt)}</DateCell>
                      </Td>

                      {/* Action */}
                      <Td alignRight>
                        <ActionRow>
                          <TextActionButton onClick={() => openEditModal(lead)}>
                            Edit
                          </TextActionButton>
                          <TextActionButton danger onClick={() => handleDeleteLead(lead.id)}>
                            Delete
                          </TextActionButton>
                        </ActionRow>
                      </Td>
                    </Tr>
                  );
                })}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={12} style={{ textAlign: 'center', padding: '32px', color: '#6b7280', fontWeight: 600 }}>
                      No leads match your filter or search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableResponsive>
        </TableCard>

        {/* Modal Dialog for Create & Edit Lead */}
        {isModalOpen && (
          <ModalOverlay onClick={() => !isSaving && setIsModalOpen(false)}>
            <ModalCard onClick={e => e.stopPropagation()}>
              <ModalHeaderBanner>
                <ModalHeaderTitleGroup>
                  <ModalHeaderTitle>
                    {editingLeadId ? `Edit Lead (${editingLeadId})` : 'Create New Lead'}
                  </ModalHeaderTitle>
                  <ModalHeaderSubtitle>
                    Century Ply CX Funnel · Capture & qualify furniture leads
                  </ModalHeaderSubtitle>
                </ModalHeaderTitleGroup>
                <ModalCloseButton
                  type="button"
                  onClick={() => !isSaving && setIsModalOpen(false)}
                >
                  ✕
                </ModalCloseButton>
              </ModalHeaderBanner>

              <ModalBody>
                {apiError && <ErrorBanner>{apiError}</ErrorBanner>}

                <form onSubmit={handleSaveLead} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <FormGrid>
                    {/* Lead Name */}
                    <FormGroup>
                      <FormLabel>
                        Lead / Contact Name <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormInput
                        name="leadName"
                        value={formData.leadName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('leadName')}
                        placeholder="e.g. Rajesh Kumar"
                        hasError={!!(touched.leadName && validationErrors.leadName)}
                      />
                      {touched.leadName && validationErrors.leadName && (
                        <FieldError>{validationErrors.leadName}</FieldError>
                      )}
                    </FormGroup>

                    {/* Lead Number */}
                    <FormGroup>
                      <FormLabel>
                        Lead Number / Phone <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormInput
                        name="leadNumber"
                        type="tel"
                        value={formData.leadNumber}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('leadNumber')}
                        placeholder="e.g. +91 98765 43210"
                        hasError={!!(touched.leadNumber && validationErrors.leadNumber)}
                      />
                      {touched.leadNumber && validationErrors.leadNumber && (
                        <FieldError>{validationErrors.leadNumber}</FieldError>
                      )}
                    </FormGroup>

                    {/* Lead Email */}
                    <FormGroup>
                      <FormLabel>Lead Email (Optional)</FormLabel>
                      <FormInput
                        name="leadEmail"
                        type="email"
                        value={formData.leadEmail}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('leadEmail')}
                        placeholder="e.g. rajesh@apexwood.com"
                        hasError={!!(touched.leadEmail && validationErrors.leadEmail)}
                      />
                      {touched.leadEmail && validationErrors.leadEmail && (
                        <FieldError>{validationErrors.leadEmail}</FieldError>
                      )}
                    </FormGroup>

                    {/* Lead Source */}
                    <FormGroup>
                      <FormLabel>
                        Lead Source Channel <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormSelect
                        name="leadSource"
                        value={formData.leadSource}
                        onChange={handleInputChange}
                      >
                        <option value="Website">Website</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Phone">Phone</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Other">Other</option>
                      </FormSelect>
                    </FormGroup>

                    {/* Is Qualified Lead */}
                    <FormGroup>
                      <FormLabel style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                        <input
                          type="checkbox"
                          name="isQualifiedLead"
                          checked={formData.isQualifiedLead}
                          onChange={e => setFormData(prev => ({ ...prev, isQualifiedLead: e.target.checked }))}
                          style={{ width: '18px', height: '18px', accentColor: '#12a594', cursor: 'pointer' }}
                        />
                        <span>Qualified Lead</span>
                      </FormLabel>
                    </FormGroup>

                    {/* Status */}
                    <FormGroup>
                      <FormLabel>
                        Status / Pipeline Stage <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormSelect
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Cold">Cold</option>
                      </FormSelect>
                    </FormGroup>

                    {/* Follow-up Date */}
                    <FormGroup>
                      <FormLabel>Follow-up Date</FormLabel>
                      <FormInput
                        name="nextFollowupDate"
                        type="date"
                        value={formData.nextFollowupDate}
                        onChange={handleInputChange}
                      />
                    </FormGroup>

                    {/* Assigned Sales User */}
                    <FormGroup>
                      <FormLabel>Assigned Sales User</FormLabel>
                      <FormSelect
                        name="assignedSalesUser"
                        value={formData.assignedSalesUser}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Unassigned --</option>
                        {SALES_USERS.map(user => (
                          <option key={user} value={user}>{user}</option>
                        ))}
                      </FormSelect>
                    </FormGroup>

                    {/* Company Name */}
                    <FormGroup>
                      <FormLabel>Company / Business (Optional)</FormLabel>
                      <FormInput
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Apex Woodworks"
                      />
                    </FormGroup>

                    {/* Estimated Value */}
                    <FormGroup>
                      <FormLabel>Estimated Value</FormLabel>
                      <FormInput
                        name="estValue"
                        value={formData.estValue}
                        onChange={handleInputChange}
                        placeholder="e.g. ₹2.5L or ₹85K"
                      />
                    </FormGroup>

                    {/* Requirement / Inquiry */}
                    <FormGroup fullWidth>
                      <FormLabel>Requirement / Inquiry</FormLabel>
                      <FormInput
                        name="requirement"
                        value={formData.requirement}
                        onChange={handleInputChange}
                        placeholder="e.g. Modular office desks · 30 seats, Century Club Prime plywood"
                      />
                    </FormGroup>

                    {/* Deal Notes / Remarks */}
                    <FormGroup fullWidth>
                      <FormLabel>Deal Notes / Remarks</FormLabel>
                      <FormTextarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Customer delivery timeline, plywood grade preference, site visit notes..."
                      />
                    </FormGroup>
                  </FormGrid>

                  <ModalActions>
                    <SecondaryButton
                      type="button"
                      disabled={isSaving}
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving Lead...' : editingLeadId ? 'Update Lead' : 'Save Lead'}
                    </PrimaryButton>
                  </ModalActions>
                </form>
              </ModalBody>
            </ModalCard>
          </ModalOverlay>
        )}
      </Container>
    </>
  );
};

export default LeadsPage;
