import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';
import {UserService} from '@back-end/services/UserService';

// Define the interface for user data from the API
interface UserDto {
  id: number;
  username: string;
  email: string;
}

interface Customer {
  id: number;
  name: string;
  country: {
    name: string;
    code: string;
  };
  representative: {
    name: string;
    image: string;
  };
  date: Date;
  balance: number;
  status: string;
  activity: number;
}

interface Representative {
  name: string;
  image: string;
}

interface Status {
  label: string;
  value: string;
}

type Severity =
  | 'success'
  | 'secondary'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast'
  | undefined;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    CommonModule,
    FormsModule,
    MultiSelectModule,
    InputTextModule,
    SelectModule,
    SliderModule,
    ProgressBarModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  customers!: Customer[];
  selectedCustomers!: Customer[];
  representatives!: Representative[];
  statuses!: Status[];
  users: UserDto[] = [];
  activityValues: number[] = [0, 100];
  searchValue = '';

  public selectedValue: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();

    this.customers = [
      {
        id: 1,
        name: 'John Doe',
        country: { name: 'USA', code: 'us' },
        representative: { name: 'Amy Elsner', image: 'amyelsner.png' },
        date: new Date(),
        balance: 1000,
        status: 'qualified',
        activity: 75,
      },
      {
        id: 2,
        name: 'Jane Smith',
        country: { name: 'Canada', code: 'ca' },
        representative: { name: 'Anna Fali', image: 'annafali.png' },
        date: new Date(),
        balance: 2000,
        status: 'new',
        activity: 50,
      },
    ];

    this.representatives = [
      { name: 'Amy Elsner', image: 'amyelsner.png' },
      { name: 'Anna Fali', image: 'annafali.png' },
      { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
      { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
      { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
      { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
      { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
      { name: 'Onyama Limba', image: 'onyamalimba.png' },
      { name: 'Stephen Shaw', image: 'stephenshaw.png' },
      { name: 'Xuxue Feng', image: 'xuxuefeng.png' },
    ];

    this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' },
    ];
  }

  fetchUsers(): void {
    // Using the correct method from UserService
    this.userService.userControllerFindAll().subscribe({
      next: (response: any): void => {
        console.log('Users:', response);
        this.users = response;
      },
      error: (error: unknown): void => {
        console.error('Error fetching users:', error);
      },
    });
  }

  clear(dt: Table): void {
    dt.clear();
  }

  getSeverity(status: string | null): Severity {
    switch (status) {
      case 'success':
      case 'info':
      case 'warn':
      default:
        return 'secondary';
    }
  }
}
