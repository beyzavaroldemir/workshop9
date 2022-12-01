import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {

  title: string = 'Category List';
  //: ! şuan undefined olduğu için kızma,daha sonra seni atacağım şeklinde söz vermiş oluyoruz.
  //: ? Bu özellik undefined olabilir demek.
  //:null için ? kullanamıyoruz,|null diye belirtmemiz gerekiyor.
  
  categories!: Category[] ;

  //Encapsulation
  private _categoriesListItems: any[] = [{ label: 'All', value: null }];
  //# Getter
  get categoriesListItems(): any[] {
    return [
      ...this._categoriesListItems,...this.categories.map((c) => {
        return { label: c.name, value: c.id };
      }),
    ];
  }
  //# Setter
  set categoriesListItems(value: any[]) {
    this._categoriesListItems = value;
  }
  // console.log(this.categoriesListItems); // Get
  // this.categoriesListItems = []; // Set
//private, public, protected
//default olarak her şey publictir
//protected:sadece classs içerisinde ve class'ın inherit edildiği yerlerde kullanılabilir
  public selectedCategoryId: number | null = null;

//private activatedRoute:ActivatedRoute
//IoC (Inversion of Control),referanların tutulduğu bir container'dır,
//Dependency Injection,IoC containerın içierisindeki referansları kullanmamızı sağlayan bir mekanizmadır.

    constructor(private activatedRoute:ActivatedRoute,private categoriesService:CategoriesService){
  //this.activatedRoute=activatedRoute;
    }

  ngOnInit(): void {
    //:ngOnInit() methodu'u component'in oluşturulduğu an çalışır.
this.getSelectedCategoryIdFromRoute();
this.getListCategories();
  }
  getListCategories() {
    this.categoriesService.getList().subscribe(
      (response)=>{
      this.categories=response;
    })
  }


  //observable=gözlemlenebilir
  getSelectedCategoryIdFromRoute() {
   this.activatedRoute.params.subscribe((params)=>{
    if(params['categoryId']!==undefined){
this.selectedCategoryId=Number(params['categoryId']);
    }
   })//* Callback
  }



  
  // onSelectedCategory(categoryId: number | null): void {
  //   // if (category === null) this.selectedCategoryId = null;
  //   // else this.selectedCategoryId = category.id;

  //   //# Debugging
  //   //debugger; // breakpoint. Uygulama çalışma anında bu satıra geldiğinde uygulama durucak ve adım adım takip edebileceğimiz bir panel açılacak.

  //   // this.selectedCategoryId = category === null ? null : category.id;

  //   //# optional chaining operator
  //   //: object?.id dediğimiz zaman, object null değilse ve id'e ulaşabiliyorsa id'sini alır, null ise null döner.

  //   //# nullish coalescing operator
  //   //: ?? operatörü ile sol taraf false (null, undefined, 0, "") ise sağ tarafı atar.
  //   this.selectedCategoryId = categoryId ?? null;
  // }

  isSelectedCategory(categoryId: number | null): boolean {
    return categoryId === this.selectedCategoryId;
  }
}
