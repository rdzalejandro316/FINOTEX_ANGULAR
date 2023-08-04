import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterContentInit {

  public listMenu: any = [];

  constructor(private profilesService: ProfilesService) { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.menu();
  }

  menu() {
    this.listMenu = [
      {
        label: "menu.Products",
        icon: "fas fa-tag",
        subMenu: [
          {
            label: "menu.AllProducts",
            rute: "all_product"
          },
          {
            label: "menu.BrandProducts",
            rute: "brandProducts"
          }
        ]
      },
      {
        label: "menu.ArtWorks",
        icon: "fas fa-pencil-ruler",
        subMenu: [
          {
            label: "menu.Artworks_history",
            rute: "artworks_history"
          }
        ]
      },
      {
        label: 'menu.Samples',
        icon: "fas fa-file-alt",
        subMenu: [
          {
            label: "menu.AllSamples",
            rute: "samples_list/all"
          },
          {
            label: "menu.DevelopingSamples",
            rute: "samples_list/developing"
          },
          {
            label: "menu.PendingSamples",
            rute: "samples_list/pending"
          },
          {
            label: "menu.technical-developments",
            rute: "technical_developments"
          },
        ]
      },
      {
        label: 'menu.Customers',
        icon: "fas fa-user-tag",
        hide: this.isCustomer() ? '1' : '',
        subMenu: [
          {
            label: "menu.CustomersHistory",
            rute: "customers_list"
          }
        ]
      },
      {
        label: 'menu.pqrs',
        icon: "fas fa-user",
        hide: this.isCustomer() ? '1' : '0',
        subMenu: [
          {
            label: "menu.pqrs-management",
            rute: "pqrs/managment",            
          }
        ]
      },
      {
        label: 'menu.pqrs',
        icon: "fas fa-user",
        hide: this.isCustomer() ? '0' : '1',
        subMenu: [
          {
            label: "pqrs.management-customer-title",
            rute: "pqrs/managment_customer",            
          }
        ]
      },
    ];
  }

  isCustomer() {
    return this.profilesService.validateUserType();
  }
}
