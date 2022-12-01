import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { GetListOptionsType } from 'src/app/models/get-list-options';
import { Pagination } from 'src/app/models/pagination';
import { Products } from 'src/app/models/products';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {



  productCardClass: string = 'card col-3 ms-3 mb-3';

  //: ! Şuan undefined olduğu için kızma, daha sonra seni atacağım şeklinde söz vermiş oluyoruz.
  //: ? Bu özellik undefined olabilir demek.
  //: null için ? kullanamıyoruz, | null diye belirtmemiz gerekiyor.
  products!: Products[];



  //selectedProductCategoryId: number | null = null;

  searchProductNameInput: string | null = null;
pagination:Pagination={
  page:1,
  pageSize:9,
}
filters:any={};
filters2:any={};
lastPage!:number;
  //#Client Side Filter
  // get filteredProducts(): Products[] {
  //   let filteredProducts = this.products;
  //   if (!filteredProducts) return [];

  //     if (this.selectedProductCategoryId)
  //       filteredProducts = filteredProducts.filter(
  //         (p) => p.categoryId === this.selectedProductCategoryId)


  //     if (this.searchProductNameInput)
  //       filteredProducts = filteredProducts.filter((p) =>
  //         p.name.toLowerCase().includes(
  //           // this.searchProductNameInput!.toLowerCase()
  //           // Non-null assertion opeartor: Sol tarafın null veya undefined olmadığını garanti ediyoruz.
  //        // searchProductName? dediğimizde hata veriyordu searchProductName! diyerek bunu aştık.Çünkü daha sonra oluşturacağım seni dedik (! ile)
  //        this.searchProductNameInput !== null
  //               ? this.searchProductNameInput.toLowerCase()
  //               : ''
  //           ));

  //       return filteredProducts;
  // }

  isLoading:number = 0 // true/false yerine sayaç methodu kullandık.Benzer işler ama bu iki veya daha fazla async işlem için daha geçerli.
  errorAlertMessage: string | null = null;


  //: ActivatedRoute mevcut route bilgisini almak için kullanılır.
  //: Router yeni route bilgisi oluşturmak için kullanılır.
  constructor(
    private activatedRoute: ActivatedRoute,
     private router: Router,
     private productService:ProductsService ) {}

  ngOnInit(): void {
    

    this.getCategoryIdFromRoute();
    this.getSearchProductNameFromRoute();
  }
  getProductsList(options?:GetListOptionsType):void {

    this.isLoading = this.isLoading + 1;
    // Subject: Observable'ın bir alt sınıfıdır. Subject'lerin bir özelliği ise, bir Subject üzerinden subscribe olunan herhangi bir yerden next() metodu çağrıldığında, o Subject üzerinden subscribe olan her yerde bu değişiklik görülebilir.
    this.productService.getProducts(options).subscribe({
      next: (response) => {
        //:Etiya projelerinde pagination bilgileri body içerisinde gelmektedir. Direk atamayı gerçekleştirebiliriz.
        // this.pagination.page = response.page;
        // this.pagination.pageSize = response.pageSize;
        // this.lastPage = response.lastPage;
        //: Json-server projelerinde pagination bilgileri header içerisinde gelmektedir. Header üzerinden atama yapmamız gerekmektedir. Bu yöntem pek kullanılmayacağı için, bu şekilde geçici bir çözüm ekleyebiliriz.
        
        if (response.length < this.pagination.pageSize) {
          if(response.length==0)
           this.pagination.page = this.pagination.page - 1;
          this.lastPage = this.pagination.page;
          this.products=response;
           }
        
        

        if (response.length > 0) this.products = response;
        this.isLoading = this.isLoading - 1
       
      },
      error: () => {
        
        this.errorAlertMessage = "Server Error. Couldn't get products list.";
        this.isLoading = this.isLoading - 1;
    
      },
      complete: () => {
        console.log('completed');
      },
    });
  }

  getCategoryIdFromRoute(): void {
    //: route params'ları almak adına activatedRoute.params kullanılır.
    this.activatedRoute.params.subscribe((params) => {
      this.pagination.page = 1;
      if (params['categoryId']) {
        // this.selectedProductCategoryId = parseInt(params['categoryId']);
        this.filters['categoryId'] = parseInt(params['categoryId']);
      }
       
      
      else {
        // this.selectedProductCategoryId = null;
        // filters = { categoryId: 1 }
       if (!this.filters['categoryId']) delete this.filters['categoryId']; //= filters = {}
        //: delete operatörü, object içerisindeki bir property'i silmek için kullanılır.
    }

      this.getProductsList({
        pagination: this.pagination,
        filters: this.filters,
      });
    });
  }
//name_like
  getSearchProductNameFromRoute(): void {
    //: query params'ları almak adına activatedRoute.queryParams kullanılır.
    this.activatedRoute.queryParams.subscribe((queryParams) => {
        this.pagination.page = 1;
     
        if(queryParams['name_like']){
         
          this.filters['name_like'] = queryParams['name_like'];
        }
      
        else
      if(!(queryParams['name_like'])){
        
        delete this.filters['name_like'];
       
      }
   
      this.getProductsList({
        pagination: this.pagination,
        filters: this.filters,
      });
    });
  }
  

  isProductCardShow(product: any): boolean {
    return product.discontinued == false;
  }

  onSearchProductNameChange(event: any): void {
    // this.searchProductNameInput = event.target.value; //: ngModel'imiz kendisi bu işlemi zaten gerçekleştiriyor.

    const queryParams: any = {};
    if (this.searchProductNameInput !== '')
      queryParams['name_like'] = this.searchProductNameInput;
    this.router.navigate([], {
      queryParams: queryParams,
    });
  }

  changePage(page:number):void{
    this.pagination.page=page;
    this.getProductsList({pagination:this.pagination,filters:this.filters});

  }

}

