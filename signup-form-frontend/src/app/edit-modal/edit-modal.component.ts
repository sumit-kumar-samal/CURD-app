import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.editForm = this.fb.group({
      firstName: [data.firstName, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      lastName: [data.lastName, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      phoneNumber: [data.phoneNumber, [Validators.required, Validators.pattern(/^\d{11}$/)]],
      password: [data.password, [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        Validators.minLength(6)
      ]],
      confirmPassword: [data.password, Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.http.put(`http://localhost:3000/users/${this.data._id}`, this.editForm.value).subscribe(
        response => {
          console.log('User updated successfully', response);
          this.dialogRef.close(true);
        },
        error => {
          console.error('Error updating user', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.controls['password'].value;
    const confirmPassword = group.controls['confirmPassword'].value;
    return password === confirmPassword ? null : { mismatch: true };
  }
}
