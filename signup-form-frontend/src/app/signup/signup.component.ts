import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<void>();
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signupForm = this.fb.group(
      {
        firstName: [
          '',
          [Validators.required, Validators.pattern('[a-zA-Z ]*')],
        ],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^\d{11}$/)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
            Validators.minLength(6),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.signupForm.valid) {
      this.http.post('http://localhost:3000/signup', this.signupForm.value).subscribe(
        response => {
          console.log('Form submitted successfully', response);
          this.signupForm.reset();
          this.formSubmitted.emit();  // Emit event when form is successfully submitted
          this.router.navigate(['/list']);
        },
        error => {
          console.error('Error submitting form', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.controls['password'].value;
    const confirmPassword = group.controls['confirmPassword'].value;

    return password === confirmPassword ? null : { mismatch: true };
  }
}
