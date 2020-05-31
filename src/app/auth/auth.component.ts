import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { AuthService, AuthResponseData } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = false;
  authForm: FormGroup;
  isLoading = false;
  error: string = null;
  

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { }

  get email (){
    return this.authForm.get('email');
  } 

  get password (){
    return this.authForm.get('password');
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onAuthSubmit(){ 
    //console.log(this.authForm.value);
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    
    // yet we dont recive response from firebase loading is true
    // below it is not metter we get response or error we switch isLoading to false
    this.isLoading = true;

    let authObs: Observable<AuthResponseData>

    if (this.isLoginMode){
      authObs = this.authService.login(email, password);
    }
    else {
      authObs = this.authService.signUp(email, password)
    } 
  
      // I dont want repaet my code thats way creat observable variable in above
      // and write here other wise in loginModed and in SignUp Mode we must repeat below code
     authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        // when we login I redirect me to recipies
        this.router.navigate(['/recipes']);
      },   
      errorMessage => {
        // "An error occurred!"
        this.error = errorMessage;
        console.log(errorMessage);
        this.isLoading = false;
      }
  )
}

onErrorHandle(){
  this.error = null;
}
}
