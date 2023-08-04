import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Home_sampleComponent } from './home_sample.component';
import { Route } from '@angular/compiler/src/core';


import { Routes, RouterModule } from '@angular/router';
import { HomeSamplesComponent } from './components/home-samples/home-samples.component';
import { AdditionalPropertiesComponent } from './components/additional-properties/additional-properties.component';
import { AniloxComponent } from './components/anilox/anilox.component';
import { FormulaColorsComponent } from './components/color-formula/color-formula.component';
import { CustomerReferenceComponent } from './components/customer-reference/customer-reference.component';
import { GeneralDataOfSampleComponent } from './components/general-data-of-sample/general-data-of-sample.component';
import { HomologsComponent } from './components/homologs/homologs.component';
import { IdentificationDataComponent } from './components/identification-data/identification-data.component';
import { ImageSettingsComponent } from './components/image-settings/image-settings.component';
import { InventoryTweaksComponent } from './components/inventory-tweaks/inventory-tweaks.component';
import { MallasComponent } from './components/mallas/mallas.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { QualityDataComponent } from './components/quality-data/quality-data.component';
import { TechnicalDataComponent } from './components/technical-data/technical-data.component';
import { TroquelComponent } from './components/troquel/troquel.component';

const routes: Routes = [{
  path: '',
    component: HomeSamplesComponent,
    children: [
  { path: 'home_samples', component: HomeSamplesComponent },
  { path: 'create/:action', component: HomeSamplesComponent },
  { path: 'edit/:action/:sampleId', component: HomeSamplesComponent },
  { path: 'detail/:action/:sampleId', component: HomeSamplesComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule],
  declarations: [Home_sampleComponent]
})
export class Home_sampleRoutingModule { }

export const routedComponents =[
    AdditionalPropertiesComponent,
    AniloxComponent,
    FormulaColorsComponent,
    CustomerReferenceComponent,
    GeneralDataOfSampleComponent,
    HomeSamplesComponent,
    HomologsComponent,
    IdentificationDataComponent,
    ImageSettingsComponent,
    InventoryTweaksComponent,
    MallasComponent,
    MaterialsComponent,
    QualityDataComponent,
    TechnicalDataComponent,
    TroquelComponent
]