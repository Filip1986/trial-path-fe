import { ChangeDetectorRef, Component } from '@angular/core';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDropListGroup,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

interface ListItem {
  id: string;
  name: string;
  nestedItems?: ListItem[];
}

@Component({
  selector: 'app-my-dnd',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup],
  templateUrl: './my-dnd.component.html',
  styleUrl: './my-dnd.component.scss',
})
export class MyDndComponent {
  todo: ListItem[] = [
    { id: '1', name: 'Get to work' },
    { id: '2', name: 'Pick up groceries' },
    { id: '3', name: 'Go home' },
    { id: '4', name: 'Fall asleep' },
  ];

  done: ListItem[] = [
    { id: '5', name: 'Get up' },
    { id: '6', name: 'Brush teeth' },
    { id: '7', name: 'Take a shower' },
    { id: '8', name: 'Check e-mail' },
    { id: '9', name: 'Walk dog' },
  ];
  dynamicLists: {
    name: string;
    items: ListItem[];
  }[] = [];

  rows: { lists: { name: string; items: ListItem[] }[] }[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  drop(event: CdkDragDrop<any[]>): void {
    console.log('Drop event:', event);
    if (event.previousContainer === event.container) {
      // Reorder items within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move item between different lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  addNewList(): void {
    const newList = {
      name: this.generateUniqueId(),
      items: [],
    };
    this.dynamicLists.push(newList);
    this.cdr.detectChanges();
  }

  addRow(): void {
    const columns = parseInt(prompt('Enter the number of columns (1-12):') || '0', 10);

    if (columns >= 1 && columns <= 12) {
      const newRow = {
        lists: Array.from({ length: columns }, (_, index) => ({
          name: `Column ${index + 1}`,
          items: [],
        })),
      };
      this.rows.push(newRow);
      this.cdr.detectChanges();
    } else {
      alert('Please enter a valid number between 1 and 12.');
    }
  }

  private generateUniqueId(): string {
    return `list_${Math.floor(1000 + Math.random() * 9000).toString()}`;
  }
}
