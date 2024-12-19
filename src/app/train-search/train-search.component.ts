import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

interface Train {
  train_name: string;
  train_number: string;
  arrival_time: string;
  departure_time: string;
  fare: number;
  travel_time: { hours: number };
}

interface TrainSearchResponse {
  success: boolean;
  message: string;
  data: Train[];
}

@Component({
  selector: 'app-train-search',
  templateUrl: './train-search.component.html',
  styleUrls: ['./train-search.component.css'],
})
export class TrainSearchComponent {
  trainSearchForm: FormGroup;
  trains: Train[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.trainSearchForm = this.fb.group({
      from: [''],
      to: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.trainSearchForm.valid) {
      this.isLoading = true;
      const { from, to } = this.trainSearchForm.value;

      this.http
        .post<TrainSearchResponse>(`${environment.apiBaseUrl}/search`, {
          from,
          to,
        })
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.trains = response.data;
              this.errorMessage = '';
              // Swal.fire({
              //   title: 'Success!',
              //   text: 'Trains found successfully.',
              //   icon: 'success',
              //   confirmButtonText: 'OK',
              // });
            } else {
              this.errorMessage = response.message;
              this.trains = [];
              Swal.fire({
                title: 'No trains found!',
                text: response.message,
                icon: 'warning',
                confirmButtonText: 'OK',
              });
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error occurred while searching for trains:', error);
            this.errorMessage = 'An error occurred while searching for trains.';
            this.trains = [];
            Swal.fire({
              title: 'Error!',
              text: 'Unable to fetch train details. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
            this.isLoading = false;
          },
        });
    } else {
      Swal.fire({
        title: 'Invalid Input!',
        text: 'Please enter valid station names.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }
}
