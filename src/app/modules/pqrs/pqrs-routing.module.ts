import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PqrsComponent } from './pqrs.component';
import { ManagmentPqrsComponent } from '../pqrs/managment-pqrs/managment-pqrs.component';
import { EditPqrsComponent } from './edit-pqrs/edit-pqrs.component';
import { InformationRequestComponent } from './edit-pqrs/components/information-request/information-request.component';
import { DetailRequestComponent } from './edit-pqrs/components/detail-request/detail-request.component';
import { InformationAdditionalComponent } from './edit-pqrs/components/information-additional/information-additional.component';
import { ActionPlanComponent } from './edit-pqrs/components/action-plan/action-plan.component';
import { CustomerResponseComponent } from './edit-pqrs/components/customer-response/customer-response.component';
import { ManagmentCustomerPqrsComponent } from './customer/managment-customer-pqrs/managment-customer-pqrs.component';
import { GenerateCustomerPqrsComponent } from './customer/generate-customer-pqrs/generate-customer-pqrs.component';
import { PqrsGuard } from 'src/app/core/guards/pqrs.guard';

const routes: Routes = [{
    path: '',
    component: PqrsComponent,
    children: [
        { path: 'managment', component: ManagmentPqrsComponent, canActivate: [PqrsGuard], data: { role: 'internal' } },        
        { path: 'edit/:documentId/:requestTypeId/:isReadOnly', component: EditPqrsComponent },
        { path: 'managment_customer', component: ManagmentCustomerPqrsComponent },        
        { path: 'generate_pqrs_customer/:type/:customerId', component: GenerateCustomerPqrsComponent },
        { path: 'generate_pqrs_customer/:type/:customerId/:documentId', component: GenerateCustomerPqrsComponent },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [PqrsComponent]
})
export class PqrsRoutingModule {     
}

export const routedComponents = [
    ManagmentPqrsComponent,
    EditPqrsComponent,
    InformationRequestComponent,
    DetailRequestComponent,
    InformationAdditionalComponent,
    ActionPlanComponent,
    CustomerResponseComponent
]