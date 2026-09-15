import { Routes } from '@angular/router';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { ListDriversComponent } from './list-drivers/list-drivers.component';
import { UpdateDriverComponent } from './update-driver/update-driver.component';
import { DeleteDriverComponent } from './delete-driver/delete-driver.component';
import { AddPackageComponent } from './add-package/add-package.component';
import { ListPackagesComponent } from './list-packages/list-packages.component';
import { UpdatePackageComponent } from './update-package/update-package.component';
import { DeletePackageComponent } from './delete-package/delete-package.component';
import { StatsComponent } from './stats/stats.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { InvaliddataComponent } from './invaliddata/invaliddata.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TranslateDescriptionComponent } from './translate-description/translate-description.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { authGuard } from './auth.guard';
import { GenerativeAiComponent } from './generative-ai/generative-ai.component';


export const routes: Routes = [
    {path: "home", component: HomeComponent, canActivate: [authGuard]},
    {path: "add-driver", component: AddDriverComponent, canActivate: [authGuard]},
    {path: "list-drivers", component: ListDriversComponent, canActivate: [authGuard]},
    {path: "update-driver", component: UpdateDriverComponent, canActivate: [authGuard]},
    {path: "delete-driver", component: DeleteDriverComponent, canActivate: [authGuard]},
    {path: "add-package", component: AddPackageComponent, canActivate: [authGuard]},
    {path: "list-packages", component: ListPackagesComponent, canActivate: [authGuard]},
    {path: "update-package", component: UpdatePackageComponent, canActivate: [authGuard]},
    {path: "delete-package", component: DeletePackageComponent, canActivate: [authGuard]},
    {path: "stats", component: StatsComponent, canActivate: [authGuard]},
    {path: "invalid-data/:id", component: InvaliddataComponent},
    {path: "login", component: LoginComponent},
    {path: "signup", component:SignupComponent},
    {path: "translate", component:TranslateDescriptionComponent, canActivate: [authGuard]},
    {path: "text2speech", component:TextToSpeechComponent, canActivate: [authGuard]},
    {path: 'gen-ai', component: GenerativeAiComponent, canActivate: [authGuard]},
    {path: "", redirectTo: "/home", pathMatch: 'full'},
    {path: "**", component: PagenotfoundComponent},
];
