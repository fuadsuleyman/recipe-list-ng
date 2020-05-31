import { Component, OnInit, OnDestroy} from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub: Subscription;
  isAuthenticated = false;
  collapsed = true;

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService) { }
  
  ngOnInit(){
    this.userSub = this.authService.user.subscribe(user => {
      
      // below two line is same mean
      this.isAuthenticated = !!user;
      // this.isAuthenticated = user ? false : true;
      //console.log(!user);
      //console.log(!!user);
    })
  }

  onSaveData(){
    this.dataStorageService.storeRecipes();
  }

  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(){
      this.authService.logout();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

}
