import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  positionList = ["Intern-Ship", "Fresher", "Mid-Level", "Senior"];
  productForm !: FormGroup;
  actionButton: string = "Save";

  constructor(private formBuilder: FormBuilder,
              private api: ApiService,
              private matDialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public editData: any ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      employeeName: ['', Validators.required],
      category: ['', Validators.required],
      position: ['', Validators.required],
      salary: ['', Validators.required],
      about: ['', Validators.required],
      date: ['', Validators.required]
    })

    if(this.editData){
      this.actionButton = "Update";
      this.productForm.controls['employeeName'].setValue(this.editData.employeeName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['position'].setValue(this.editData.position);
      this.productForm.controls['salary'].setValue(this.editData.salary);
      this.productForm.controls['about'].setValue(this.editData.about);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProductFirebase(this.productForm.value).subscribe({
          next:(res) =>{
            alert("Employee added successfully");
            this.productForm.reset();
            this.matDialogRef.close('save');
          },
          error:()=> {
            alert("Error while adding the product");
          }
        })
      }
    }
    else{
      this.updateProduct();
    }
  }



  updateProduct(){
    this.api.putProductFirebase(this.productForm.value, this.editData.id).subscribe({
      next:(res)=> {
        alert("Employee updated Successfully.");
        this.productForm.reset();
        this.matDialogRef.close("updated");
      },
      error:()=>{
        alert("Error while updating the record!!");
      }
    })
  }

}
