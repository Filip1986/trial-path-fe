import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SelectModule } from 'primeng/select';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ClinicalRoles, getRolePermissions, RolePermissions } from '@core/models/clinical-roles';

interface RoleOption {
  label: string;
  value: ClinicalRoles;
  description: string;
  category: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-role-selector',
  standalone: true,
  imports: [SelectModule, BadgeModule, ButtonModule, FormsModule, TooltipModule],
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleSelectorComponent implements OnInit {
  @Input() currentRole: ClinicalRoles = ClinicalRoles.GUEST;
  @Output() roleChanged: EventEmitter<ClinicalRoles> = new EventEmitter<ClinicalRoles>();

  selectedRole: WritableSignal<ClinicalRoles> = signal<ClinicalRoles>(ClinicalRoles.GUEST);
  showPermissions: WritableSignal<boolean> = signal(false);
  roleOptions: WritableSignal<RoleOption[]> = signal<RoleOption[]>([]);
  currentRoleOption: WritableSignal<RoleOption | null> = signal<RoleOption | null>(null);
  permissionsList: WritableSignal<Array<{ label: string; hasPermission: boolean }>> = signal<
    Array<{
      label: string;
      hasPermission: boolean;
    }>
  >([]);

  ngOnInit(): void {
    this.initializeRoleOptions();
    this.selectedRole.set(this.currentRole);
    this.updateCurrentRole();
  }

  onRoleChange(event: any): void {
    this.selectedRole.set(event.value as ClinicalRoles);
    this.updateCurrentRole();
    this.roleChanged.emit(this.selectedRole());
    this.showPermissions.set(false); // Hide permissions when role changes
  }

  private initializeRoleOptions(): void {
    this.roleOptions.set([
      // Clinical Roles
      {
        label: 'Principal Investigator',
        value: ClinicalRoles.PRINCIPAL_INVESTIGATOR,
        description: 'Lead physician responsible for the conduct of the clinical trial',
        category: 'Clinical',
        icon: 'pi pi-star',
        color: '#8B5CF6',
      },
      {
        label: 'Sub-Investigator',
        value: ClinicalRoles.SUB_INVESTIGATOR,
        description: 'Qualified physician who assists the Principal Investigator',
        category: 'Clinical',
        icon: 'pi pi-user-edit',
        color: '#06B6D4',
      },
      {
        label: 'Clinical Research Coordinator',
        value: ClinicalRoles.CLINICAL_RESEARCH_COORDINATOR,
        description: 'Manages daily trial operations and participant interactions',
        category: 'Clinical',
        icon: 'pi pi-users',
        color: '#10B981',
      },
      {
        label: 'Study Nurse',
        value: ClinicalRoles.STUDY_NURSE,
        description: 'Provides clinical care and monitors participant safety',
        category: 'Clinical',
        icon: 'pi pi-heart',
        color: '#F59E0B',
      },

      // Data Management Roles
      {
        label: 'Data Manager',
        value: ClinicalRoles.DATA_MANAGER,
        description: 'Oversees data quality, integrity, and database management',
        category: 'Data Management',
        icon: 'pi pi-database',
        color: '#6366F1',
      },
      {
        label: 'Clinical Data Associate',
        value: ClinicalRoles.CLINICAL_DATA_ASSOCIATE,
        description: 'Supports data entry and query resolution activities',
        category: 'Data Management',
        icon: 'pi pi-file-edit',
        color: '#8B5CF6',
      },

      // Regulatory Roles
      {
        label: 'Regulatory Affairs Specialist',
        value: ClinicalRoles.REGULATORY_AFFAIRS_SPECIALIST,
        description: 'Manages regulatory submissions and compliance',
        category: 'Regulatory',
        icon: 'pi pi-verified',
        color: '#DC2626',
      },

      // Monitoring Roles
      {
        label: 'Clinical Research Associate',
        value: ClinicalRoles.CLINICAL_RESEARCH_ASSOCIATE,
        description: 'Monitors study conduct and ensures protocol compliance',
        category: 'Monitoring',
        icon: 'pi pi-eye',
        color: '#059669',
      },
      {
        label: 'Monitor',
        value: ClinicalRoles.MONITOR,
        description: 'Conducts site visits and source data verification',
        category: 'Monitoring',
        icon: 'pi pi-search',
        color: '#0891B2',
      },

      // Administrative Roles
      {
        label: 'Site Administrator',
        value: ClinicalRoles.SITE_ADMINISTRATOR,
        description: 'Manages site operations and user access',
        category: 'Administrative',
        icon: 'pi pi-cog',
        color: '#7C3AED',
      },
      {
        label: 'System Administrator',
        value: ClinicalRoles.ADMIN,
        description: 'Full system access and configuration capabilities',
        category: 'Administrative',
        icon: 'pi pi-crown',
        color: '#DC2626',
      },

      // Pharmacy Roles
      {
        label: 'Pharmacy Manager',
        value: ClinicalRoles.PHARMACY_MANAGER,
        description: 'Manages investigational product and drug accountability',
        category: 'Pharmacy',
        icon: 'pi pi-shopping-bag',
        color: '#EA580C',
      },

      // Guest
      {
        label: 'Guest User',
        value: ClinicalRoles.GUEST,
        description: 'Limited access for demonstration purposes',
        category: 'Demo',
        icon: 'pi pi-user',
        color: '#6B7280',
      },
    ]);
  }

  private updateCurrentRole(): void {
    const found: RoleOption | null =
      this.roleOptions().find((role: RoleOption): boolean => role.value === this.selectedRole()) ||
      null;
    this.currentRoleOption.set(found);
    this.updatePermissionsList();
  }

  private updatePermissionsList(): void {
    const role: ClinicalRoles = this.selectedRole();
    if (!role) return;

    const permissions: RolePermissions = getRolePermissions(role);
    this.permissionsList.set([
      { label: 'View All Studies', hasPermission: permissions.canViewAllStudies },
      { label: 'Edit Study Data', hasPermission: permissions.canEditStudyData },
      { label: 'Approve Documents', hasPermission: permissions.canApproveDocuments },
      { label: 'Access Regulatory', hasPermission: permissions.canAccessRegulatory },
      { label: 'Manage Users', hasPermission: permissions.canManageUsers },
      { label: 'Export Data', hasPermission: permissions.canExportData },
      { label: 'View Reports', hasPermission: permissions.canViewReports },
      { label: 'Manage Pharmacy', hasPermission: permissions.canManagePharmacy },
      { label: 'Monitor Studies', hasPermission: permissions.canMonitorStudies },
      { label: 'Admin Settings', hasPermission: permissions.canAccessAdminSettings },
    ]);
  }
}
