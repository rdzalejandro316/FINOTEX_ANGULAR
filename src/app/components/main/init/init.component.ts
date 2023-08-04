import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';


@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  yearCurrent = moment(new Date()).format('yyyy');

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void 
  {
        
  }

  openPqrs()
  {        
    this.router.navigate(['main/pqrs']);              
  }
}
