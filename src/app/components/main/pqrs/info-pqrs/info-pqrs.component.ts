import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-pqrs',
  templateUrl: './info-pqrs.component.html',
  styleUrls: ['./info-pqrs.component.css']
})
export class InfoPqrsComponent implements OnInit {

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/main' },
    { label: 'main.menu-pqrs', url: '/main/pqrs', current: true },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openGenerateRequest()
  {    
    this.router.navigate(['main/generate_pqrs/external']);          
  }

  openConsultRequest()
  {    
    this.router.navigate(['main/consult_pqrs']);          
  }

}
