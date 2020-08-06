import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalendarioProyectoComponent } from './calendario-proyecto.component';

describe('CalendarioTareasComponent', () => {
  let component: CalendarioProyectoComponent;
  let fixture: ComponentFixture<CalendarioProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarioProyectoComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
