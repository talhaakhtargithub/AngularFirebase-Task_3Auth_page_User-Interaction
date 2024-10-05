import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface Student {
  firstName: string;
  lastName: string;
  semester: string;
  identificationNumber: string;
  dateOfBirth: string;
  dateOfAdmission: string;
  degreeTitle: string;
  yearOfStudy: number;
  uploadPicture: string;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  studentForm: FormGroup;
  students: Student[] = [];
  semesters = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
  ];
  degrees = [
    'Bachelor of Science in Electrical Engineering',
    'Bachelor of Science in Chemical Engineering',
    'Bachelor of Science in Industrial Engineering',
    'Bachelor of Science in Metallurgical Engineering',
    'Bachelor of Science in Environmental Engineering',
    'Bachelor of Science in Software Engineering',
    'Bachelor of Science in Computer Science (CS)',
    'Bachelor of Science in Information Technology Engineering',
  ];
  selectedFile: File | null = null;
  studentId: string | null = null;
  page = 1;
  isShowForm = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      semester: ['', Validators.required],
      identificationNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      dateOfAdmission: ['', Validators.required],
      degreeTitle: ['', Validators.required],
      yearOfStudy: ['', Validators.required],
      uploadPicture: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.studentId = this.route.snapshot.paramMap.get('id');
    if (this.studentId) {
      this.getStudentDetails(this.studentId);
    }
  }

  loadStudents() {
    this.http.get<Student[]>(`http://localhost:3000/api/students?page=${this.page}`).subscribe(
      (data) => {
        this.students = [...this.students, ...data];
      },
      (err) => {
        console.error('Error fetching students:', err);
        alert('Error fetching students: ' + (err.error?.message || 'Unknown error'));
      }
    );
  }

  getStudentDetails(id: string): void {
    this.http.get<Student>(`http://localhost:3000/api/students/${id}`).subscribe({
      next: (student) => {
        this.studentForm.patchValue(student);
      },
      error: (err) => {
        console.error('Error fetching student details:', err);
        alert('Error fetching student details: ' + (err.error?.message || 'Unknown error'));
      },
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file || null;
    if (this.selectedFile) {
      this.studentForm.get('uploadPicture')?.setErrors(null);
    } else {
      this.studentForm.get('uploadPicture')?.setErrors({ required: true });
    }
  }

  onSubmit(): void {
    this.studentForm.markAllAsTouched();

    if (this.studentForm.valid) {
      const identificationNumber = this.studentForm.value.identificationNumber;

      this.http.get<any>(`http://localhost:3000/api/students/check/${identificationNumber}`).subscribe({
        next: () => {
          this.studentId ? this.updateStudent() : this.createStudent();
        },
        error: (err) => {
          console.error('Error checking identification number:', err);
          alert('Error: ' + (err.error?.message || 'Unknown error'));
        },
      });
    }
  }

  createStudent(): void {
    const formData = this.buildFormData();

    this.http.post<any>('http://localhost:3000/api/students', formData).subscribe({
      next: () => {
        alert('Student added successfully');
        this.resetForm();
      },
      error: (err) => {
        alert('Error adding student: ' + (err.error?.message || 'Unknown error'));
      },
    });
  }

  updateStudent(): void {
    const formData = this.buildFormData();

    this.http.put<any>(`http://localhost:3000/api/students/${this.studentId}`, formData).subscribe({
      next: () => {
        alert('Student updated successfully');
        this.router.navigate(['/students']);
      },
      error: (err) => {
        alert('Error updating student: ' + (err.error?.message || 'Unknown error'));
      },
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    Object.keys(this.studentForm.value).forEach((key) => {
      formData.append(key, this.studentForm.value[key]);
    });
    if (this.selectedFile) {
      formData.append('uploadPicture', this.selectedFile as Blob);
    }
    return formData;
  }

  private resetForm(): void {
    this.studentForm.reset();
    this.selectedFile = null;
  }

  onScroll() {
    this.page++;
    this.loadStudents();
  }

  onDelete(identificationNumber: string) {
    console.log('Attempting to delete student with ID:', identificationNumber);
    if (confirm('Are you sure you want to delete this student?')) {
      this.http.delete(`http://localhost:3000/api/students/${identificationNumber}`).subscribe({
        next: () => {
          this.students = this.students.filter(student => student.identificationNumber !== identificationNumber);
          alert('Student deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting student:', err);
          alert('Error deleting student: ' + (err.error?.message || 'Unknown error'));
        },
      });
    }
  }
}
