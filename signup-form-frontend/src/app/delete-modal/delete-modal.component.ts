import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {
  @Output() userDeleted = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  onDelete(): void {
    this.http.delete(`http://localhost:3000/users/${this.data._id}`).subscribe(
      (response) => {
        console.log('User deleted successfully',response);
        this.userDeleted.emit();
        this.dialogRef.close(true);
      },
      error => {
        console.error('Error deleting user', error);
        this.dialogRef.close(false);

      }
    );
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
