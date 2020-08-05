import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RendimientoPage } from './rendimiento.page';

describe('RendimientoPage', () => {
  let component: RendimientoPage;
  let fixture: ComponentFixture<RendimientoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RendimientoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RendimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
