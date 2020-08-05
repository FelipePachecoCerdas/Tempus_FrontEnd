import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BitacoraPage } from './bitacora.page';

describe('BitacoraPage', () => {
  let component: BitacoraPage;
  let fixture: ComponentFixture<BitacoraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BitacoraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BitacoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
