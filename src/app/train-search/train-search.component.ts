import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  // New variables to hold the last searched values
  searchedFrom: string = '';
  searchedTo: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.trainSearchForm = this.fb.group({
      from: [''],
      to: [''],
    });
  }

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
            this.isLoading = false;
            if (response.success) {
              this.trains = response.data;
              this.errorMessage = '';

              // Update the last searched values
              this.searchedFrom = from;
              this.searchedTo = to;
            } else {
              this.trains = [];
              this.errorMessage = response.message;
              Swal.fire({
                title: 'No trains found!',
                text: response.message,
                icon: 'warning',
                confirmButtonText: 'OK',
              });
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.trains = [];
            this.errorMessage = 'An error occurred while searching for trains.';
            Swal.fire({
              title: 'Error!',
              text: 'Unable to fetch train details. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
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
