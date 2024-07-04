import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  openEditModal(user: any, index: number): void {
    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '500px',
      data: { ...user, id: index }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchUsers();
      }
    });
  }



  openDeleteModal(user: any, index: number): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '300px',
      data: user
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Remove the user from the local users array
        this.users.splice(index, 1);
        console.log('User deleted and list updated');
      }
    });
  }
}
