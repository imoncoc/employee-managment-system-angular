import { Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { map } from 'rxjs';
import { EmployeePost } from './shared/employeePost.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Employee-management-system';
  displayedColumns: string[] = ['employeeName', 'category', 'date', 'position', 'salary', 'about', 'action'];
  dataSource!: MatTableDataSource<EmployeePost>;
  loadEmployeeList: EmployeePost[] = [];
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,
              private api: ApiService){}

  ngOnInit(): void {
      this.getAllProduct();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
      }).afterClosed().subscribe(val => {
        if(val === 'save'){
          this.getAllProduct();
        }
      })
  }

  getAllProduct(){
    this.isLoading = true;

    this.api.getProductFirebase()
    .pipe(map((responseData: { [key: string]: EmployeePost }) => {
      const postsArray: EmployeePost[] = [];
      for (const key in responseData){
        if(responseData.hasOwnProperty(key)){
          postsArray.push({ ...responseData[key], id: key});
        }
      }
      return postsArray;
    }))
    .subscribe({
      next:(res) =>{
        this.isLoading = false;
        this.loadEmployeeList = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err) =>{
        alert("Error while fetching the Records!");
      }
    })
  }

  deleteProduct(id: string){
    this.api.deleteProductFirebase(id)
    .subscribe({
      next:(res)=> {
              alert("Employee Deleted Successfully");
              this.getAllProduct();
            },
            error:()=>{
              alert("Error while deleting the product");
            }
    })
  }


  editProduct(row: any){
    this.dialog.open(DialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val =>{
      if(val === 'updated'){
        this.getAllProduct();
      }
    })
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
