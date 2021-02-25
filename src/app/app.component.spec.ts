import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ApplicationFooterComponent } from './components/application-footer/application-footer.component';
import { ApplicationHeaderComponent } from './components/application-header/application-header.component';
import { MaterialComponentsModule } from './modules/material-components.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialComponentsModule],
      declarations: [
        AppComponent,
        ApplicationHeaderComponent,
        ApplicationFooterComponent,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'StarterProject'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('StarterProject');
  });
});
