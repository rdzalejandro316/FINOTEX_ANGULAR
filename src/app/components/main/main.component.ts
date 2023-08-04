import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    
  }

  onActivate($event)
  {            
    var route = $event.router.routerState.snapshot.url;    
    this.viewOptionsMenu(route == "/main" ? false : true);    
  }

  viewOptionsMenu(flag)
  {
    const logoLeftRow = document.getElementById("logo-left-row");        
    const logoCompany = document.getElementById("logo-company");        

    if(flag)
    {
      var display = logoLeftRow.style.display;        
      logoLeftRow.style.display = "inherit";    
  
      //var display = logoCompany.style.display;        
      logoCompany.style.display = "none";        
    }
    else
    {
      //var display = logoLeftRow.style.display;        
      logoLeftRow.style.display = "none";    
  
      //var display = logoCompany.style.display;        
      logoCompany.style.display = "inherit";        
    }            
  }


}
