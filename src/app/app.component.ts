
import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService} from './services/auth.service'
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public user=this.authService.actualUser


  public appPages = [
    {
      title: 'Mis Tareas',
      url: '/calendario-tareas',
      icon: 'calendar'
    },
    {
      title: 'Mis Proyectos',
      url: '/folder/Outbox',
      icon: 'briefcase'
    },
    {
      title: 'Rendimiento',
      url: '/folder/Favorites',
      icon: 'cellular'
    },
    {
      title: 'Bitácora',
      url: '/folder/Archived',
      icon: 'reader'
    },
    {
      title: 'Perfil',
      url: '/perfil',
      icon: 'person'
    },

  ];
  public labels = ['Family'];

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService:AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

}
