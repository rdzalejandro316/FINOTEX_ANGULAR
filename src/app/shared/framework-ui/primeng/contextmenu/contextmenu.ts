import { NgModule, Component, ElementRef, Input, Output, ViewChild, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TooltipModule } from '../tooltip/tooltip';
import { RippleModule } from '../ripple/ripple';
import { ContextMenuService } from '../api/contextmenuservice';


@Component({
    selector: 'p-contextMenu',
    template: `
        <div id="{{customerId}}" class="p-contextmenu">
            <ul>
            <li *ngFor="let item of items"
            routerLink='{{item.url}}/{{customerId}}'><p>{{ item.label }}</p></li>
            </ul>
        </div>
    `,
    encapsulation: ViewEncapsulation.None, styleUrls: ['./contextmenu.css'],
    host: {
        'class': 'p-element'
    }
})
export class ContextMenu implements OnInit {

    @Input() items: any;

    @Input() customerId: string = "";

    @Input() target: any;

    @Output() leafClick: EventEmitter<any> = new EventEmitter();

    @ViewChild('sublist') sublistViewChild: ElementRef;

    @ViewChild('menuitem') menuitemViewChild: ElementRef;

    activeItemKey: string;

    hideTimeout: any;

    activeItemKeyChangeSubscription: Subscription;

    ngOnInit(): void {
        // console.log(this.customerId);
    }

    ContextMenuById(customerId: string) {
        console.log(customerId);
    }

}

@NgModule({
    imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
    exports: [ContextMenu, RouterModule, TooltipModule],
    declarations: [ContextMenu],
    providers: [ContextMenuService]
})
export class ContextMenuModule { }
