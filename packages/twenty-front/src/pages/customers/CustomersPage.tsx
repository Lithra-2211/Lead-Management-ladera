import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useCustomerData, CustomerRecord } from './context/CustomerDataContext';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #fafafa;
  position: relative;
`;

const TopGlobalBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 24px 16px;
  background-color: transparent;
  border-bottom: none;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 600px;
  margin-left: 16px;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 14px;
`;

const SearchInput = styled.input`
  padding: 8px 12px 8px 36px;
  border-radius: 20px;
  border: 1px solid ${themeCssVariables.border.color.medium};
  font-size: 13px;
  width: 100%;
  outline: none;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }
  
  &::placeholder {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

const GlobalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${themeCssVariables.font.color.secondary};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;

  &:hover {
    background-color: ${themeCssVariables.background.transparent.medium};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;

  &:hover {
    background-color: ${themeCssVariables.background.transparent.light};
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #1e3a8a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const UserRole = styled.div`
  font-size: 11px;
  color: ${themeCssVariables.font.color.tertiary};
`;

const ChevronDown = styled.div`
  font-size: 10px;
  color: ${themeCssVariables.font.color.secondary};
  margin-left: 4px;
`;

const PageContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 32px 24px;
  width: 100%;
  box-sizing: border-box;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #1e1b4b;
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: ${themeCssVariables.font.color.tertiary};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Button = styled.button<{ primary?: boolean; danger?: boolean; small?: boolean }>`
  padding: ${({ small }) => (small ? '4px 8px' : '6px 14px')};
  border-radius: 8px;
  font-size: ${({ small }) => (small ? '11px' : '13px')};
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ primary, danger }) => (primary || danger ? 'transparent' : themeCssVariables.border.color.medium)};
  background-color: ${({ primary, danger }) => (primary ? '#2563eb' : danger ? '#fee2e2' : 'white')};
  color: ${({ primary, danger }) => (primary ? 'white' : danger ? '#ef4444' : themeCssVariables.font.color.primary)};
  box-shadow: ${({ primary }) => (primary ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)')};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 24px 24px;
  flex: 1;
  overflow-y: auto;
`;

const KpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const KpiCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${themeCssVariables.border.color.light};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -20px;
    right: -20px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(239, 246, 255, 0.8) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
    z-index: 0;
  }
  
  > * {
    z-index: 1;
  }
`;

const IconWrapper = styled.div<{ color: string; bg: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const KpiValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 8px;
`;

const KpiLabel = styled.div`
  font-size: 13px;
  color: ${themeCssVariables.font.color.secondary};
`;

const KpiTrend = styled.div<{ color?: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ color }) => color || '#10b981'};
`;

const MasterSection = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 400px;
  overflow: hidden;
`;

const MasterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const TableContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  box-sizing: border-box;
  border-collapse: collapse;
  min-width: 800px;

  tbody tr {
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #f8fafc;
    }
  }
`;

const Th = styled.th`
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  padding: 10px 16px;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  position: sticky;
  top: 0;
  background: #f8fafc;
  z-index: 10;
`;

const Td = styled.td`
  padding: 10px 16px;
  font-size: 13px;
  color: ${themeCssVariables.font.color.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  white-space: nowrap;

  &:first-child {
    color: ${themeCssVariables.font.color.primary};
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const AvatarCircle = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
`;

const Tag = styled.span<{ type: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ type }) => (type === 'Active' ? '#dcfce7' : type === 'At risk' ? '#ffedd5' : '#f3f4f6')};
  color: ${({ type }) => (type === 'Active' ? '#166534' : type === 'At risk' ? '#9a3412' : '#4b5563')};
`;

const OpenTicketsText = styled.span<{ count: number }>`
  color: ${({ count }) => (count > 0 ? '#ef4444' : themeCssVariables.font.color.secondary)};
  font-weight: ${({ count }) => (count > 0 ? '600' : '400')};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  width: 75%;
  max-width: 900px;
  background: white;
  height: 85%;
  max-height: 800px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: scaleUp 0.2s ease;

  @keyframes scaleUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalBody = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalFooter = styled.div`
  padding: 24px;
  border-top: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${themeCssVariables.font.color.secondary};
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid ${themeCssVariables.border.color.medium};
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }
`;



const Select = styled.select`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid ${themeCssVariables.border.color.medium};
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  background: white;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }
`;

const SearchableSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchableDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: 8px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SearchableOption = styled.div`
  padding: 10px;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background: ${themeCssVariables.background.secondary};
  }
`;

const AddressGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const AddressColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AddressHeader = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AddressValue = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 11px;
`;

const Alert = styled.div`
  padding: 12px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
`;

const ActionMenu = styled.div`
  display: flex;
  gap: 8px;
`;

const Toast = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  z-index: 2000;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { transform: translate(-50%, 100%); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
`;

const locationSchema = z.object({
  id: z.string().optional(),
  locationName: z.string().optional().default(""),
  contactPerson: z.string().optional().default(""),
  mobileNumber: z.string().optional().default(""),
  email: z.string().optional().default(""),
  addressLine: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().optional().default(""),
  pincode: z.string().optional().default("")
});

const customerSchema = z.object({
  type: z.enum(['Customer', 'Dealer', 'Carpenter']),
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().optional().default(""),
  mobile: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email("Invalid email").or(z.literal('')),
  address: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().optional().default(""),
  pincode: z.string().optional().default(""),
  source: z.string().optional().default(""),
  segment: z.string().optional().default(""),
  region: z.string().optional().default(""),
  potential: z.string().optional().default(""),
  locations: z.array(locationSchema).optional()
});

type CustomerFormValues = z.infer<typeof customerSchema>;
type LocationFormValues = z.infer<typeof locationSchema>;

export const CustomersPage = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, fetchDealers, addDealerLocations, deleteDealerLocation, fetchCountries, fetchStates } = useCustomerData();
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);
  const [submitError, setSubmitError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [dealersList, setDealersList] = useState<any[]>([]);
  const [isAddingNewDealer, setIsAddingNewDealer] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [dealerSearchText, setDealerSearchText] = useState('');

  const [countries, setCountries] = useState<{code: string, name: string}[]>([]);
  const [statesList, setStatesList] = useState<{code: string, name: string}[]>([]);
  const [locationStates, setLocationStates] = useState<Record<number, {code: string, name: string}[]>>({});

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);


  const [expandedAddresses, setExpandedAddresses] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const typeFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (typeFilterRef.current && !typeFilterRef.current.contains(event.target as Node)) {
        setIsTypeFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAddressExpansion = (idx: number) => {
    setExpandedAddresses(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const { register, handleSubmit, reset, watch, setValue, getValues, control, formState: { errors } } = useForm<any>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      type: 'Customer', name: '', contactPerson: '', mobile: '', email: '', address: '', city: '', state: '', country: 'India', pincode: '', source: '', segment: '', region: '', potential: '', locations: []
    }
  });

  const watchCountry = watch('country');
  useEffect(() => {
    if (watchCountry) {
      const c = countries.find(x => x.name === watchCountry || x.code === watchCountry);
      if (c) fetchStates(c.code).then(setStatesList);
      else setStatesList([]);
    } else {
      setStatesList([]);
    }
  }, [watchCountry, countries]);


  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
    control,
    name: 'locations'
  });

  const handleDeleteExistingAddress = async (addressId: string, index: number) => {
    console.log('[Remove Address] Button clicked');
    console.log('[Remove Address] Selected Address ID:', addressId);
    
    if (window.confirm(`Are you sure you want to remove Address ${index + 1}?`)) {
      console.log('[Remove Address] Confirmation OK callback executed');
      console.log('[Remove Address] Mutation payload:', { locationId: addressId });
      console.log('[Remove Address] Delete mutation started');
      
      const res = await deleteDealerLocation(addressId);
      
      if (res.success) {
        console.log('[Remove Address] Delete mutation response:', res);
        showToast('Address removed successfully.');
        setDealersList(prev => prev.map(d => {
          if (d.cid === selectedDealerId) {
            return { ...d, locations: d.locations.filter((l: any) => l.locationId !== addressId) };
          }
          return d;
        }));
      } else {
        console.error('[Remove Address] Delete mutation error:', res.error);
        setSubmitError(res.error || 'Failed to remove address');
      }
    }
  };

  const watchType = watch('type');
  
  useEffect(() => {
    if (watchType === 'Dealer') {
      fetchDealers().then(data => {
        console.log('[Dealer Debug] API response inside CustomersPage:', data);
        setDealersList(data);
      });
    }
  }, [watchType]);

  const filteredDealers = useMemo(() => {
    return dealersList.filter(d => {
      if (!dealerSearchText) return true;
      if (!d.customerCode) return false;
      return d.customerCode.toLowerCase().includes(dealerSearchText.toLowerCase());
    });
  }, [dealersList, dealerSearchText]);

  useEffect(() => {
    console.log('[Dealer Debug] dealers array length:', dealersList?.length);
    console.log('[Dealer Debug] filtered dealers length:', filteredDealers?.length);
    console.log('[Dealer Debug] search text:', dealerSearchText);
    console.log('[Dealer Debug] selected customer type:', watchType);
  }, [dealersList?.length, filteredDealers?.length, dealerSearchText, watchType]);

  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [isDealerAccordionOpen, setIsDealerAccordionOpen] = useState(true);

  const handleDealerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedDealerId(selectedId === 'ADD_NEW' ? null : selectedId);
    
    if (selectedId === 'ADD_NEW') {
      setIsAddingNewDealer(true);
      setValue('name', '');
      setValue('mobile', '');
      setValue('email', '');
      setValue('address', '');
      setValue('city', '');
      setValue('pincode', '');
      if ((getValues('locations') || []).length === 0) {
        setValue('locations', []);
      }
    } else if (selectedId) {
      setIsAddingNewDealer(false);
      const dealer = dealersList.find(d => d.cid === selectedId);
      if (dealer) {
        setValue('name', dealer.customerCode);
        setValue('mobile', dealer.mobileNumber);
        setValue('email', dealer.email || '');
        const loc = dealer.locations?.[0];
        if (loc) {
          setValue('city', loc.city || loc.locationName || '');
          setValue('address', loc.addressLine || '');
          setValue('pincode', loc.pincode || '');
          setValue('contactPerson', loc.contactPerson || '');
        }
        if ((getValues('locations') || []).length === 0) {
          setValue('locations', [{ locationName: '', country: 'India', state: '', city: '', addressLine: '', pincode: '', contactPerson: '', mobileNumber: '', email: '' }]);
        }
      }
    }
  };

  const filteredCustomers = useMemo(() => {
    let result = customers;
    
    if (typeFilter !== 'All') {
      result = result.filter(c => c.type === typeFilter);
    }
    
    if (!searchQuery) return result;
    
    const lowerQ = searchQuery.toLowerCase();
    return result.filter(c => 
      c.name.toLowerCase().includes(lowerQ) ||
      c.mobile.includes(lowerQ) ||
      (c.email && c.email.toLowerCase().includes(lowerQ)) ||
      c.city.toLowerCase().includes(lowerQ) ||
      (c.dealerCode && c.dealerCode.toLowerCase().includes(lowerQ))
    );
  }, [customers, searchQuery, typeFilter]);

  const kpis = [
    { icon: '👥', iconColor: '#ef4444', iconBg: '#fee2e2', value: customers.length.toString(), label: 'Total customers', trend: '▲ 214 this month', trendColor: '#10b981' },
    { icon: '🔄', iconColor: '#10b981', iconBg: '#dcfce7', value: '31%', label: 'Repeat purchase rate', trend: '▲ 3.2 pts', trendColor: '#10b981' },
    { icon: '⭐', iconColor: '#f59e0b', iconBg: '#fef3c7', value: '4.6', label: 'Avg CSAT - 90d', trend: '3,902 responses', trendColor: '#10b981' },
    { icon: '₹', iconColor: '#8b5cf6', iconBg: '#ede9fe', value: '₹28.4K', label: 'Avg lifetime value', trend: '▲ 9%', trendColor: '#10b981' },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const openDrawer = (customer?: CustomerRecord) => {
    setSubmitError('');
    if (customer) {
      setEditingCustomer(customer);
      reset({
        type: customer.type, name: customer.name, contactPerson: customer.contactPerson || '', mobile: customer.mobile, email: customer.email, address: customer.address, city: customer.city, state: customer.state, country: 'India', pincode: customer.pincode, source: customer.source, segment: customer.segment, region: customer.region, potential: customer.potential, locations: customer.type === 'Dealer' ? [{ locationName: '', country: 'India', state: '', city: '', addressLine: '', pincode: '', contactPerson: '', mobileNumber: '', email: '' }] : (customer.locations || [])
      });
      if (customer.type === 'Dealer' && customer.id) {
        setSelectedDealerId(customer.id);
      } else {
        setSelectedDealerId(null);
      }
    } else {
      setEditingCustomer(null);
      setSelectedDealerId(null);
      reset({
        type: 'Customer', name: '', contactPerson: '', mobile: '', email: '', address: '', city: '', state: '', country: 'India', pincode: '', source: 'Website', segment: 'Retail', region: 'South', potential: 'Medium', locations: []
      });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const onSubmit = async (data: any) => {
    setSubmitError('');
    
    if (data.type === 'Dealer') {
      if (!isAddingNewDealer && !selectedDealerId) {
        setSubmitError('Please select a dealer or add a new one.');
        return;
      }

      if (selectedDealerId && !isAddingNewDealer) {
        // Editing existing dealer - update dealer locations
        const newLocations = data.locations?.filter(l => !l.id) || [];
        if (newLocations.length > 0) {
          const res = await addDealerLocations(selectedDealerId, newLocations);
          if (!res.success) {
            setSubmitError(res.error || 'Failed to save locations');
            return;
          }
          fetchDealers().then(data => setDealersList(data));
          closeDrawer();
          showToast('New addresses added successfully');
        } else {
          closeDrawer();
        }
        return;
      } else {
        const isDuplicate = dealersList.some(d => d.customerCode.toLowerCase() === data.name.toLowerCase());
        if (isDuplicate && !editingCustomer) {
          setSubmitError('A dealer with this name already exists.');
          return;
        }
      }
    }
    
    const { country, ...rest } = data;
    const dbData = { ...rest, country, dealerCode: '', notes: '' };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, dbData);
      closeDrawer();
      showToast('Customer updated successfully');
    } else {
      const res = await addCustomer(dbData);
      if (res.success) {
        if (data.type === 'Dealer' && isAddingNewDealer) {
          fetchDealers().then(data => setDealersList(data));
          setSelectedDealerId(res.data?.cid || res.data?.id || null);
          setIsAddingNewDealer(false);
          showToast('Dealer created successfully. You can now add locations.');
          return;
        } else if (data.type === 'Dealer') {
          fetchDealers().then(data => setDealersList(data));
        }
        closeDrawer();
        showToast(data.type === 'Dealer' ? 'Dealer created successfully.' : 'Customer added successfully');
      } else {
        setSubmitError(res.error || 'Unknown error occurred.');
      }
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteCustomer(id);
    }
  };

  return (
    <>
      <PageTitle title="Customers" />
      <PageWrapper>
                        <TopGlobalBar>
          <SearchInputWrapper>
            <SearchIcon><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></SearchIcon>
            <SearchInput 
              placeholder="Search leads, customers, deals, tickets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInputWrapper>
          <GlobalActions>
            <IconButton><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></IconButton>
            <UserProfile>
              <Avatar>NL</Avatar>
              <UserInfo>
                <UserName>Nagarajan Ladera</UserName>
              </UserInfo>
              <ChevronDown>▼</ChevronDown>
            </UserProfile>
          </GlobalActions>
        </TopGlobalBar>
        
        <PageContainer>
          <PageHeader>
            <TitleSection>
              <Title>Customers</Title>
              <Subtitle>Capture, score and qualify — every source feeds one funnel.</Subtitle>
            </TitleSection>
            <HeaderActions>
              <Button primary onClick={() => openDrawer()}>+ New customer</Button>
            </HeaderActions>
          </PageHeader>
          
          <Grid>
            <KpiRow>
              {kpis.map((kpi, i) => (
                <KpiCard key={i}>
                  <IconWrapper color={kpi.iconColor} bg={kpi.iconBg}>
                    {kpi.icon}
                  </IconWrapper>
                  <div>
                    <KpiValue>{kpi.value}</KpiValue>
                    <KpiLabel>{kpi.label}</KpiLabel>
                    <KpiTrend color={kpi.trendColor}>{kpi.trend}</KpiTrend>
                  </div>
                </KpiCard>
              ))}
            </KpiRow>

            <MasterSection>
              <MasterHeader>
                <TitleSection>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: themeCssVariables.font.color.primary }}>
                    Customer master
                  </h3>
                  <Subtitle>Synced with SAP · updated just now</Subtitle>
                </TitleSection>
                <div style={{ position: 'relative' }} ref={typeFilterRef}>
                  <Button onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}>
                    {typeFilter === 'All' ? 'Filter By Type' : typeFilter} ▼
                  </Button>
                  {isTypeFilterOpen && (
                    <div style={{ 
                      position: 'absolute', top: '100%', right: 0, marginTop: '4px', zIndex: 100, 
                      background: 'white', border: `1px solid ${themeCssVariables.border.color.light}`, 
                      borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '150px',
                      overflow: 'hidden'
                    }}>
                      {['All', 'Dealer', 'Customer', 'Carpenter'].map(type => (
                        <div 
                          key={type}
                          onClick={() => { setTypeFilter(type); setIsTypeFilterOpen(false); }}
                          style={{
                            padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
                            background: typeFilter === type ? '#f0f9ff' : 'white',
                            color: typeFilter === type ? '#0284c7' : themeCssVariables.font.color.primary,
                            fontWeight: typeFilter === type ? 600 : 400
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = typeFilter === type ? '#f0f9ff' : '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.background = typeFilter === type ? '#f0f9ff' : 'white'}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </MasterHeader>
              
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>CUSTOMER</Th>
                      <Th>CITY</Th>
                      <Th>SEGMENT</Th>
                      <Th>LIFETIME VALUE</Th>
                      <Th>ORDERS</Th>
                      <Th>OPEN TICKETS</Th>
                      <Th>HEALTH</Th>
                      <Th>ACTIONS</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <Td colSpan={8} style={{ textAlign: 'center', padding: '32px' }}>
                          No customers found matching your search.
                        </Td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => (
                        <tr key={c.id}>
                          <Td>
                            <AvatarCircle color={c.color}>{c.initials}</AvatarCircle>
                            {c.name}
                          </Td>
                          <Td>{c.city}</Td>
                          <Td><Tag type="Segment">{c.segment}</Tag></Td>
                          <Td>{c.ltv}</Td>
                          <Td>{c.orders}</Td>
                          <Td><OpenTicketsText count={c.openTickets}>{c.openTickets}</OpenTicketsText></Td>
                          <Td><Tag type={c.health}>{c.health}</Tag></Td>
                          <Td>
                            <ActionMenu>
                              <Button small onClick={() => navigate(`/customers/${c.id}`)}>View 360</Button>
                              <Button small onClick={() => openDrawer(c)}>Edit</Button>
                              <Button small danger onClick={() => handleDelete(c.id, c.name)}>Delete</Button>
                            </ActionMenu>
                          </Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </TableContainer>
            </MasterSection>
          </Grid>
        </PageContainer>

        {isDrawerOpen && (
          <ModalOverlay onClick={closeDrawer}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <Title style={{ fontSize: '28px', fontWeight: 600 }}>{editingCustomer ? `Edit ${watchType || 'Customer'}` : `New ${watchType || 'Customer'}`}</Title>
                <div style={{ cursor: 'pointer', fontSize: '20px', color: themeCssVariables.font.color.tertiary }} onClick={closeDrawer}>&times;</div>
              </ModalHeader>
              <ModalBody>
                {submitError && <Alert>{submitError}</Alert>}
                <form id="customer-form" onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <FormGroup>
                    <Label>Customer Type</Label>
                    <Select {...register('type')}>
                      <option value="Customer">Customer</option>
                      <option value="Dealer">Dealer</option>
                      <option value="Carpenter">Carpenter</option>
                    </Select>
                  </FormGroup>

                  {watchType === 'Dealer' && !isAddingNewDealer && !editingCustomer ? (
                      <>
                        <FormGroup>
                          <Label>Dealer Name *</Label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1, cursor: 'text' }} ref={dropdownRef} onClick={() => { setIsDropdownOpen(true); setDealerSearchText(''); }}>
                              <Input 
                                  value={isDropdownOpen ? dealerSearchText : (selectedDealerId ? (dealersList.find(d => d.cid === selectedDealerId)?.customerCode || '') : '')}
                                  placeholder="Search Dealer"
                                  autoComplete="off"
                                  onFocus={() => { setIsDropdownOpen(true); setDealerSearchText(''); }}
                                  onChange={(e) => {
                                    setDealerSearchText(e.target.value);
                                    setIsDropdownOpen(true);
                                    if (!e.target.value) handleDealerSelect({ target: { value: '' } } as any);
                                  }}
                                  style={{ width: '100%', paddingRight: '30px' }}
                                />
                              <div style={{ 
                                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', 
                                pointerEvents: 'none', color: themeCssVariables.font.color.secondary, fontSize: '10px'
                              }}>
                                ▼
                              </div>
                              {isDropdownOpen && (
                                <div style={{ 
                                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, 
                                  background: '#fff', border: `1px solid ${themeCssVariables.border.color.light}`, 
                                  borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                                  maxHeight: '300px', overflowY: 'auto', marginTop: '4px' 
                                }}>
                                  <div style={{ padding: '8px', borderBottom: `1px solid ${themeCssVariables.border.color.light}` }}>
                                    <Button type="button" small onClick={(e) => { e.stopPropagation(); setIsAddingNewDealer(true); setValue('name', ''); setValue('mobile', ''); setValue('email', ''); setValue('city', ''); setValue('address', ''); setValue('pincode', ''); setValue('locations', []); setValue('locations', []); setIsDropdownOpen(false); }} style={{ width: '100%' }}>+ Add New Dealer</Button>
                                  </div>
                                  {filteredDealers.map(dealer => (
                                    <div 
                                      key={dealer.cid} 
                                      style={{ 
                                        padding: '12px 16px', 
                                        borderBottom: `1px solid ${themeCssVariables.border.color.light}`,
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        color: themeCssVariables.font.color.primary
                                      }}
                                      onClick={(e) => { e.stopPropagation(); handleDealerSelect({ target: { value: dealer.cid } } as any); setIsDropdownOpen(false); }}
                                    >
                                      {dealer.customerCode}
                                    </div>
                                  ))}
                                  {filteredDealers.length === 0 && (
                                    <div style={{ padding: '12px', fontSize: '12px', color: '#666' }}>No dealers found</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </FormGroup>
                        {selectedDealerId && (
                          <div style={{ marginTop: '24px', marginBottom: '8px', fontSize: '18px', fontWeight: 600, color: themeCssVariables.font.color.primary }}>
                            {dealersList.find(d => d.cid === selectedDealerId)?.customerCode}
                          </div>
                        )}
                      </>
                    ) : (
                      <FormGroup>
                        <Label>{watchType === 'Dealer' ? 'Dealer Name *' : 'Customer Name *'}</Label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Input {...register('name')} placeholder={watchType === 'Dealer' ? "Enter dealer name" : "Enter full name"} style={{ flex: 1 }} />
                        </div>
                        {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
                      </FormGroup>
                    )}

                    {!(watchType === 'Dealer' && !isAddingNewDealer) && (
                    <>
                      <FormGroup>
                        <Label>Contact Person Name</Label>
                        <Input {...register('contactPerson')} placeholder="Contact person name" disabled={!!selectedDealerId && !isAddingNewDealer} />
                      </FormGroup>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormGroup>
                          <Label>Mobile Number *</Label>
                          <Input {...register('mobile')} placeholder="Enter 10-digit number" disabled={!!selectedDealerId && !isAddingNewDealer} />
                          {errors.mobile && <ErrorText>{errors.mobile.message}</ErrorText>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Email</Label>
                          <Input {...register('email')} placeholder="Email address" type="email" disabled={!!selectedDealerId && !isAddingNewDealer} />
                          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
                        </FormGroup>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormGroup>
                          <Label>Country</Label>
                          <Select 
                            {...register('country')} 
                            disabled={!!selectedDealerId && !isAddingNewDealer}
                            onChange={(e) => {
                              register('country').onChange(e);
                              setValue('state', '');
                            }}
                          >
                            <option value="">Select Country</option>
                            {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                          </Select>
                        </FormGroup>
                        <FormGroup>
                          <Label>State</Label>
                          <Select {...register('state')} disabled={!!selectedDealerId && !isAddingNewDealer}>
                            <option value="">Select State</option>
                            {statesList.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                          </Select>
                        </FormGroup>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormGroup>
                          <Label>City *</Label>
                          <Input {...register('city')} placeholder="City name" disabled={!!selectedDealerId && !isAddingNewDealer} />
                          {errors.city && <ErrorText>{errors.city.message}</ErrorText>}
                        </FormGroup>
                        <FormGroup>
                          <Label>Pincode</Label>
                          <Input {...register('pincode')} disabled={!!selectedDealerId && !isAddingNewDealer} />
                        </FormGroup>
                      </div>

                      <FormGroup>
                        <Label>Address</Label>
                        <Input {...register('address')} disabled={!!selectedDealerId && !isAddingNewDealer} />
                      </FormGroup>
                    </>
                  )}

                  {watchType === 'Dealer' && (
                    <div style={{ marginTop: '16px', paddingTop: '16px' }}>
                      
                      {locationFields.map((field, index) => (
                        <div key={field.id} style={{ marginTop: index > 0 ? '16px' : '0', paddingBottom: '16px', borderBottom: '1px solid #eaeaea' }}>
                          {index > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--font-color-secondary)' }}>
                                Address {index + 1}
                              </h4>
                              <Button type="button" small danger onClick={() => removeLocation(index)}>Remove</Button>
                            </div>
                          )}

                          <FormGroup style={{ marginBottom: '12px' }}>
                            <Label>Branch Name *</Label>
                            <Input {...register(`locations.${index}.locationName` as const)} placeholder="Location name" />
                          </FormGroup>

                          <FormGroup style={{ marginBottom: '12px' }}>
                            <Label>Contact Person Name *</Label>
                            <Input {...register(`locations.${index}.contactPerson` as const)} placeholder="Contact person name" />
                          </FormGroup>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <FormGroup>
                              <Label>Mobile Number *</Label>
                              <Input {...register(`locations.${index}.mobileNumber` as const)} placeholder="Enter 10-digit number" />
                            </FormGroup>
                            <FormGroup>
                              <Label>Email</Label>
                              <Input {...register(`locations.${index}.email` as const)} placeholder="Email address" type="email" />
                            </FormGroup>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <FormGroup>
                              <Label>Country *</Label>
                              <Select 
                                {...register(`locations.${index}.country` as const)}
                                onChange={(e) => {
                                  register(`locations.${index}.country` as const).onChange(e);
                                  setValue(`locations.${index}.state` as const, ''); // Clear state
                                  const c = e.target.value;
                                  if (c) {
                                    fetchStates(c).then(st => {
                                      setLocationStates(prev => ({ ...prev, [index]: st }));
                                    });
                                  } else {
                                    setLocationStates(prev => ({ ...prev, [index]: [] }));
                                  }
                                }}
                              >
                                <option value="">Select Country</option>
                                {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                              </Select>
                            </FormGroup>
                            <FormGroup>
                              <Label>State *</Label>
                              <Select {...register(`locations.${index}.state` as const)}>
                                <option value="">Select State</option>
                                {(locationStates[index] || []).map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                              </Select>
                            </FormGroup>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <FormGroup>
                              <Label>City *</Label>
                              <Input {...register(`locations.${index}.city` as const)} />
                            </FormGroup>
                            <FormGroup>
                              <Label>Pincode *</Label>
                              <Input {...register(`locations.${index}.pincode` as const)} />
                            </FormGroup>
                          </div>

                          <FormGroup>
                            <Label>Address *</Label>
                            <Input {...register(`locations.${index}.addressLine` as const)} />
                          </FormGroup>
                        </div>
                      ))}

                      {(isAddingNewDealer || selectedDealerId) && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px', marginBottom: '12px' }}>
                          <Button type="button" small onClick={() => appendLocation({ locationName: '', country: 'IN', state: '', city: '', addressLine: '', pincode: '', contactPerson: '', mobileNumber: '', email: '' })}>+ Add Another Address</Button>
                        </div>
                      )}
                    </div>
                  )}

                  {!(watchType === 'Dealer' && !isAddingNewDealer) && (
                    <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <FormGroup>
                        <Label>Source</Label>
                        <Select {...register('source')} disabled={!!selectedDealerId && !isAddingNewDealer}>
                          <option value="Website">Website</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Referral">Referral</option>
                          <option value="Campaign">Campaign</option>
                          <option value="Dealer Portal">Dealer Portal</option>
                          <option value="Field Sales">Field Sales</option>
                        </Select>
                      </FormGroup>
                      <FormGroup>
                        <Label>Segment</Label>
                        <Select {...register('segment')} disabled={!!selectedDealerId && !isAddingNewDealer}>
                          <option value="Retail">Retail</option>
                          <option value="Dealer">Dealer</option>
                          <option value="B2B">B2B</option>
                        </Select>
                      </FormGroup>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <FormGroup>
                        <Label>Region</Label>
                        <Select {...register('region')} disabled={!!selectedDealerId && !isAddingNewDealer}>
                          <option value="South">South</option>
                          <option value="North">North</option>
                          <option value="East">East</option>
                          <option value="West">West</option>
                        </Select>
                      </FormGroup>
                      <FormGroup>
                        <Label>Business Potential</Label>
                        <Select {...register('potential')} disabled={!!selectedDealerId && !isAddingNewDealer}>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Very High">Very High</option>
                        </Select>
                      </FormGroup>
                    </div>
                    </>
                  )}

                </form>
              </ModalBody>
              <ModalFooter>
                <Button type="button" onClick={() => {
                  if (isAddingNewDealer) {
                    setIsAddingNewDealer(false);
                    if (!selectedDealerId) {
                      setValue('name', '');
                      setValue('mobile', '');
                      setValue('email', '');
                      setValue('city', '');
                      setValue('address', '');
                      setValue('pincode', ''); setValue('locations', []);
                    }
                  } else {
                    closeDrawer();
                  }
                }}>Cancel</Button>
                {watchType === 'Dealer' ? (
                  isAddingNewDealer ? (
                    <Button primary type="submit" form="customer-form">Save Dealer</Button>
                  ) : selectedDealerId ? (
                    locationFields.length > 0 ? (
                      <Button primary type="submit" form="customer-form">Save Address</Button>
                    ) : null
                  ) : null
                ) : (
                  <Button primary type="submit" form="customer-form">{editingCustomer ? 'Update Customer' : 'Create Customer'}</Button>
                )}
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}

        {toastMessage && (
          <Toast>
            {toastMessage}
          </Toast>
        )}
      </PageWrapper>
    </>
  );
};
