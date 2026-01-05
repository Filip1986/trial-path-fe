export enum ClinicalRoles {
  // Clinical Roles
  PRINCIPAL_INVESTIGATOR = 'PRINCIPAL_INVESTIGATOR',
  SUB_INVESTIGATOR = 'SUB_INVESTIGATOR',
  CLINICAL_RESEARCH_COORDINATOR = 'CLINICAL_RESEARCH_COORDINATOR',
  STUDY_NURSE = 'STUDY_NURSE',

  // Data Management Roles
  DATA_MANAGER = 'DATA_MANAGER',
  CLINICAL_DATA_ASSOCIATE = 'CLINICAL_DATA_ASSOCIATE',

  // Regulatory Roles
  REGULATORY_AFFAIRS_SPECIALIST = 'REGULATORY_AFFAIRS_SPECIALIST',

  // Monitoring Roles
  CLINICAL_RESEARCH_ASSOCIATE = 'CLINICAL_RESEARCH_ASSOCIATE',
  MONITOR = 'MONITOR',

  // Administrative Roles
  SITE_ADMINISTRATOR = 'SITE_ADMINISTRATOR',
  ADMIN = 'ADMIN',

  // Pharmacy Roles
  PHARMACY_MANAGER = 'PHARMACY_MANAGER',

  // Other Roles
  GUEST = 'GUEST',
}

export interface RolePermissions {
  canViewAllStudies: boolean;
  canEditStudyData: boolean;
  canApproveDocuments: boolean;
  canAccessRegulatory: boolean;
  canManageUsers: boolean;
  canExportData: boolean;
  canViewReports: boolean;
  canManagePharmacy: boolean;
  canMonitorStudies: boolean;
  canAccessAdminSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<ClinicalRoles, RolePermissions> = {
  [ClinicalRoles.PRINCIPAL_INVESTIGATOR]: {
    canViewAllStudies: true,
    canEditStudyData: true,
    canApproveDocuments: true,
    canAccessRegulatory: true,
    canManageUsers: false,
    canExportData: true,
    canViewReports: true,
    canManagePharmacy: false,
    canMonitorStudies: true,
    canAccessAdminSettings: false,
  },

  [ClinicalRoles.SUB_INVESTIGATOR]: {
    canViewAllStudies: true,
    canEditStudyData: true,
    canApproveDocuments: false,
    canAccessRegulatory: true,
    canManageUsers: false,
    canExportData: false,
    canViewReports: true,
    canManagePharmacy: false,
    canMonitorStudies: true,
    canAccessAdminSettings: false,
  },

  [ClinicalRoles.CLINICAL_RESEARCH_COORDINATOR]: {
    canViewAllStudies: true,
    canEditStudyData: true,
    canApproveDocuments: false,
    canAccessRegulatory: false,
    canManageUsers: false,
    canExportData: false,
    canViewReports: true,
    canManagePharmacy: false,
    canMonitorStudies: false,
    canAccessAdminSettings: false,
  },

  [ClinicalRoles.STUDY_NURSE]: {
    canViewAllStudies: false,
    canEditStudyData: true,
    canApproveDocuments: false,
    canAccessRegulatory: false,
    canManageUsers: false,
    canExportData: false,
    canViewReports: false,
    canManagePharmacy: false,
    canMonitorStudies: false,
    canAccessAdminSettings: false,
  },

  [ClinicalRoles.DATA_MANAGER]: {
    canViewAllStudies: true,
    canEditStudyData: false,
    canApproveDocuments: false,
    canAccessRegulatory: false,
    canManageUsers: false,
    canExportData: true,
    canViewReports: true,
    canManagePharmacy: false,
    canMonitorStudies: false,
    canAccessAdminSettings: false,
  },

  [ClinicalRoles.CLINICAL_DATA_ASSOCIATE]: {
    canViewAllStudies: false,
    canEditStudyData: true,
    canApproveDocuments: false,
    canAccessRegulatory: false,
    canManageUsers: false,
    canExportData: false,
    canViewReports: false,
    canManagePharmacy: false,
    canMonitorStudies: false,
    canAccessAdminSettings: false,
  },

  [ClinicalRoles.REGULATORY_AFFAIRS_SPECIALIST]: {
    canViewAllStudies: true,
    canEditStudyData: false,
    canApproveDocuments: true,
    canAccessRegulatory: true,
    canManageUsers: false,
    canExportData: false,
    canViewReports: true,
    canManagePharmacy: false,
    canMonitorStudies: false,
    canAccessAdminSettings: false,
  },

  [ClinicalRoles.CLINICAL_RESEARCH_ASSOCIATE]: {
    canViewAllStudies: true,
    canEditStudyData: false,
    canApproveDocuments: false,
    canAccessRegulatory: false,
    canManageUsers: false,
    canExportData: false,
    canViewReports: true,
    canManagePharmacy: false,
    canMonitorStudies: true,
    canAccessAdminSettings: false,
  },

  [ClinicalRoles.MONITOR]: {
    canViewAllStudies: true,
    canEditStudyData: false,
    canApproveDocuments: false,
    canAccessRegulatory: false,
    canManageUsers: false,
    canExportData: false,
    canViewReports: true,
    canManagePharmacy: false,
    canMonitorStudies: true,
    canAccessAdminSettings: false,
  },

  [ClinicalRoles.SITE_ADMINISTRATOR]: {
    canViewAllStudies: true,
    canEditStudyData: false,
    canApproveDocuments: true,
    canAccessRegulatory: true,
    canManageUsers: true,
    canExportData: true,
    canViewReports: true,
    canManagePharmacy: false,
    canMonitorStudies: true,
    canAccessAdminSettings: true,
  },

  [ClinicalRoles.ADMIN]: {
    canViewAllStudies: true,
    canEditStudyData: true,
    canApproveDocuments: true,
    canAccessRegulatory: true,
    canManageUsers: true,
    canExportData: true,
    canViewReports: true,
    canManagePharmacy: true,
    canMonitorStudies: true,
    canAccessAdminSettings: true,
  },

  [ClinicalRoles.PHARMACY_MANAGER]: {
    canViewAllStudies: false,
    canEditStudyData: false,
    canApproveDocuments: false,
    canAccessRegulatory: false,
    canManageUsers: false,
    canExportData: false,
    canViewReports: false,
    canManagePharmacy: true,
    canMonitorStudies: false,
    canAccessAdminSettings: false,
  },

  [ClinicalRoles.GUEST]: {
    canViewAllStudies: false,
    canEditStudyData: false,
    canApproveDocuments: false,
    canAccessRegulatory: false,
    canManageUsers: false,
    canExportData: false,
    canViewReports: false,
    canManagePharmacy: false,
    canMonitorStudies: false,
    canAccessAdminSettings: false,
  },
};

/**
 * Utility function to get permissions for a role
 */
export function getRolePermissions(role: ClinicalRoles): RolePermissions {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ClinicalRoles.GUEST];
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: ClinicalRoles, permission: keyof RolePermissions): boolean {
  const permissions = getRolePermissions(role);
  return permissions[permission];
}
